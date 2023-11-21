<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchModel"
      label-width="80px"
      size="small"
    >
      <el-form-item>
        <el-input v-model="searchModel.roleName" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search(pageNo,pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetValue">重置</el-button>
        <el-button icon="el-icon-plus" type="success" @click="openAddWindow">新增</el-button>
      </el-form-item>
    </el-form>
    <!--  表格  -->
    <el-table
      :data="roleList"
      :height="tableHeight"
      border
      stripe
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column
        align="center"
        label="角色编号"
        prop="id"
        width="100">
      </el-table-column>
      <el-table-column label="角色编码" prop="roleCode"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色备注" prop="remark"></el-table-column>
      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
          >
          <el-button
            icon="el-icon-setting"
            size="small"
            type="primary"
            @click="assignRole(scope.row)"
          >分配权限
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination
      :current-page="pageNo"
      :page-size="10"
      :page-sizes="[10, 20, 30, 40, 50]"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <system-dialog
      :height="roleDialog.height"
      :title="roleDialog.title"
      :visible="roleDialog.visible"
      :width="roleDialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm">
      <div slot="content">
        <el-form
          ref="roleForm"
          :inline="false"
          :model="role"
          :rules="rules"
          label-width="80px"
          size="small">
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="role.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="role.remark" :rows="5" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>

    <!-- 分配权限树窗口 -->
    <system-dialog
      :height="assignDialog.height"
      :title="assignDialog.title"
      :visible="assignDialog.visible"
      :width="assignDialog.width"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <div slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          :highlight-current="true"
          :props="defaultProps"
          :show-checkbox="true"
          default-expand-all
          empty-text="暂无数据"
          node-key="id"
        ></el-tree>
      </div>
    </system-dialog>
  </el-main>

</template>

<script>
import {addRole, assignSave, checkRole, deleteRole, getAssignTree, getRoles, updateRole} from "@/api/role";
import systemDialog from "@/components/system/systemDialog.vue";
import leafUtils from "@/utils/leaf";

export default {
  components: {
    systemDialog
  },
  data() {
    return {
      searchModel: {
        roleName: '',
        pageNumber: 1,
        pageCount: 10,
        userId: this.$store.getters.userId
      },
      roleList: [],
      tableHeight: 0,//表格高度
      pageNo: 1,
      pageSize: 10,
      total: 0,
      roleDialog: {
        title: '',
        visible: false,
        height: 230,
        width: 500
      },
      rules: {
        roleCode: [{required: true, trigger: 'blur', message: '请输入角色编码'}],
        roleName: [{required: true, trigger: 'blur', message: '请输入角色名称'}]
      },
      role: {
        id: "",
        roleCode: "",
        roleName: "",
        remark: "",
        createUser: this.$store.getters.userId
      },
      assignDialog: {
        title: '',
        visible: false,
        height: 450,
        width: 300
      },
      assignTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      roleId: ''
    }
  }, methods: {
    async assignRole(row) {
      //将row.id赋值给roleId,为分配权限时做准备
      this.roleId = row.id
      //构建查询的参数
      let params = {
        roleId: row.id,
        userId: this.$store.getters.userId
      }
      console.log(params)
      //发送查询分配权限菜单的请求
      let res = await getAssignTree(params)
      if (res.success) {
        //获取当前登录用户拥有的所有权限
        let permissionList = res.data.permissionList
        //获取当前被分配的角色已经拥有的权限信息
        let checkList = res.data.checkList
        //判断当前菜单是否是末级
        let {setLeaf} = leafUtils()
        //设置权限菜单列表
        let newPermissionList = setLeaf(permissionList)
        //设置树节点菜单数据
        this.assignTreeData = newPermissionList
        //将回调延迟到下次DOM更新循环之后执行,在修改数据之后立即使用它,然后等待DOM更新。
        this.$nextTick(() => {
          //获取树菜单的节点数据
          let nodes = this.$refs.assignTree.children
          //设置子节点
          this.setChild(nodes, checkList)
        })
      }
      this.assignDialog.title = `给【${row.roleName}】分配权限`
      this.assignDialog.visible = true
    },
    setChild(childNodes, checkList) {
      //判断是否存在子节点
      if (childNodes && childNodes.length > 0) {
        //循环所有权限
        for (let i = 0; i < childNodes.length; i++) {
          //根据 data 或者 key 拿到 Tree 组件中的 node
          let node = this.$refs.assignTree.getNode(childNodes[i])
          //判断是否已经拥有对应的角色数据
          if (checkList && checkList.length > 0) {
            //循环遍历已有的权限集合
            for (let j = 0; j < checkList.length; j++) {
              //找到已经存在的菜单权限节点
              if (checkList[j] == childNodes[i].id) {
                //如果节点是展开状态，则将树节点选中
                if (childNodes[i].open) {
                  this.$refs.assignTree.setChecked(node, true)
                  break
                }
              }
            }
          }
          //如果存在子节点，则递归选中if (childNodes[i].children) {
          this.setChild(childNodes[i].children, checkList)
        }
      }
    },
    onAssignClose() {
      this.assignDialog.visible = false
    },
    async onAssignConfirm() {
      //获取选中的节点key
      let ids = this.$refs.assignTree.getCheckedKeys()
      //获取选中节点的父节点id
      let pids = this.$refs.assignTree.getHalfCheckedKeys()
      //组装选中的节点ID数据
      let listId = ids.concat(pids)
      //组装参数
      let params = {
        roleId: this.roleId,
        list: listId
      }
      //发送请求
      let res = await assignSave(params)
      //判断是否成功
      if (res.success) {
        //关闭窗口
        this.assignDialog.visible = false
        //提示成功
        this.$message.success(res.message)
      } else {
        //提示失败
        this.$message.error(res.data)
      }
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      //清空表单数据
      this.$resetForm("roleForm", this.role);
      this.roleDialog.title = '新增角色'//设置窗口标题
      this.roleDialog.visible = true//显示窗口
    },
    /**
     * 窗口取消事件
     */
    onClose() {
      this.roleDialog.visible = false
    },
    /**
     * 窗口确认事件
     */
    onConfirm() {
      //表单验证
      this.$refs.roleForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          //判断角色ID是否为空
          if (this.role.id === "") {
            //新增
            //发送添加请求
            res = await addRole(this.role);
          } else {
            //发送修改请求
            //发送修改请求
            res = await updateRole(this.role);
          }
          //判断是否成功
          if (res.success) {
            this.$message.success(res.message);
            //刷新
            this.search(this.pageNo, this.pageSize);
            //关闭窗口
            this.roleDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },


    search(pageNo = 1, pageSize = 10) {
      //修改每页当前的页码
      this.searchModel.pageNumber = pageNo
      this.searchModel.pageCount = pageSize
      getRoles(this.searchModel).then(res => {
        this.roleList = res.data.records
        this.total = res.data.total
      })
    },
    handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.role); //将当前编辑的数据复制到role对象中
//设置窗口标题
      this.roleDialog.title = "编辑角色";
//显示编辑角色窗口
      this.roleDialog.visible = true;
    },
    async handleDelete(row) {
      //查询部门下是否存在子部门或用户
      let result = await checkRole({id: row.id});
      //判断是否可以删除
      if (!result.success) {
        //提示不能删除
        this.$message.warning(result.message);
      } else {
        //确认是否删除
        let confirm = await this.$myconfirm("确定要删除该数据吗?");
        if (confirm) {
          //发送删除请求
          let res = await deleteRole({id: row.id});
          //判断是否成功
          if (res.success) {
            //成功提示
            this.$message.success(res.message);
            //刷新
            this.search(this.pageNo, this.pageSize);
          } else {
            //失败提示
            this.$message.error(res.message);
          }
        }
      }
    },
    /**
     * 每页显示数量发生变化时
     * @param size
     */
    handleSizeChange(size) {
      this.pageSize = size;
      this.search(this.pageNo, size)
    },
    /**
     * 页码改变时
     * @param page
     */
    handleCurrentChange(page) {
      this.pageNo = page
      this.search(page, this.pageSize)
    },
    resetValue() {
      //清空数据
      this.searchModel.roleName = ''
      this.search()
    },
  }
  ,
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  }
  ,
  created() {
    this.search()
  }
}
</script>

<style lang="scss" scoped>

</style>
