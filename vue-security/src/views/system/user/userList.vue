<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 左侧部门树形菜单列表 -->
    <el-aside
      style="
          padding: 0px 0px 0px 0px;
          background: #fff;
          border-right: 1px solid #dfe6ec;
          "
      width="250px"
    >
      <el-tree
        ref="leftTree"
        :data="deptList"
        :expand-on-click-node="false"
        :highlight-current="true"
        :props="defaultProps"
        :show-checkbox="false"
        default-expand-all
        empty-text="暂无数据"
        node-key="id"
        style="font-size: 14px"
        @node-click="handleNodeClick"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div>
            <span v-if="data.children.length == 0">
            <i class="el-icon-document"></i>
            </span>
            <span v-else @click.stop="openBtn(data)">
              <svg-icon v-if="data.open" icon-class="add-s"/>
              <svg-icon v-else icon-class="sub-s"/>
            </span>
            <!-- 名称 -->
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>
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
          <el-input v-model="searchModel.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.realName" placeholder="请输入真实姓名"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.phone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary"
                     @click="search(departmentId, pageNo, pageSize)">查询
          </el-button>
          <el-button icon="el-icon-delete" @click="resetValue()">重置</el-button>
          <el-button icon="el-icon-plus" size="small" type="success"
                     v-if="hasPermission('sys:user:add')"
                     @click="openAddWindow()">新增
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 用户表格数据 -->
      <el-table
        :data="userList"
        :height="tableHeight"
        border
        stripe
        style="width: 100%; margin-bottom: 10px"
      >
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="所属部门" prop="departmentName"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column align="center" label="操作" width="290">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini"
                       type="primary" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button icon="el-icon-delete" size="mini"
                       type="danger" @click="handleDelete(scope.row)">删除
            </el-button>
            <el-button icon="el-icon-setting" size="mini"
                       type="primary" @click="assignRole(scope.row)">分配角色
            </el-button>
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
    </el-main>
    <!-- 添加和编辑用户窗口 -->
    <system-dialog
      :height="userDialog.height"
      :title="userDialog.title"
      :visible="userDialog.visible"
      :width="userDialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="userForm"
          :inline="true"
          :model="user"
          :rules="rules"
          label-width="80px"
          size="small"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item v-if="user.id === ''" label="密码" prop="password">
            <el-input v-model="user.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentName">
            <el-input
              v-model="user.departmentName"
              :readonly="true"
              @click.native="selectDepartment()"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="user.realName"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="user.phone"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="user.nickName"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="user.gender">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <!-- 用户头像：待补充 -->
          <el-form-item label="用户头像" prop="gender">
            <el-upload
              :before-upload="beforeAvatarUpload"
              :data="uploadHeader"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              action="http://localhost:8888/file/upload?file=avatar"
              border
              class="avatar-uploader"
            >
              <img v-if="user.avatar" :src="user.avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>


        </el-form>
      </div>
    </system-dialog>
    <!--  所属部门弹框  -->
    <system-dialog
      :height="parentDialog.height"
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentList"
          :expand-on-click-node="false"
          :highlight-current="true"
          :props="parentProps"
          :show-checkbox="false"
          default-expand-all
          node-key="id"
          @node-click="parentClick"
        >
          <div slot-scope="{ node, data }" class="customer-tree-node">
            <span v-if="data.children.length == 0">
              <i class="el-icon-document"/>
            </span>
            <span v-else @click.stop="openParentBtn(data)">
              <svg-icon v-if="data.open" icon-class="add-s"/>
              <svg-icon v-else icon-class="sub-s"/>
            </span>
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>

    <!-- 分配角色窗口 -->
    <system-dialog
      :height="assignDialog.height"
      :title="assignDialog.title"
      :visible="assignDialog.visible"
      :width="assignDialog.width"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <div slot="content">
        <!-- 分配角色数据列表 -->
        <el-table
          ref="assignRoleTable"
          :data="assignRoleList"
          :height="assignHeight"
          border
          stripe
          style="width: 100%; margin-bottom: 10px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column label="角色编码" prop="roleCode"/>
          <el-table-column label="角色名称" prop="roleName"/>
          <el-table-column label="角色备注" prop="remark"/>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination
          :current-page.sync="roleVo.pageNo"
          :page-size="roleVo.pageSize"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="roleVo.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="assignSizeChange"
          @current-change="assignCurrentChange"
        >
        </el-pagination>
      </div>
    </system-dialog>
  </el-container>


</template>

<script>
import {getDepartmentList} from "@/api/department";
import {
  addUser,
  deleteUser,
  getAssignRoleList,
  getRoleIdByUserId,
  getUserList,
  saveUserRole,
  updateUser
} from "@/api/user";
import systemDialog from "@/components/system/systemDialog.vue";
import {getToken} from "@/utils/auth";

export default {
  components: {
    systemDialog
  },
  data() {
    //自定义验证规则
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号码"));
        //使用正则表达式进行验证手机号码
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      containerHeight: 0,//容器高度
      deptList: [],//左侧部门树菜单列表
      //树节点属性
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      searchModel: {
        username: '',
        realName: '',
        phone: '',
        departmentId: "",
        pageNo: 1,
        pageSize: 10,
      },
      departmentSearchModel: {
        departmentName: ''
      },
      tableHeight: 0,
      userList: [],
      pageNo: 1,
      pageCount: 10,
      total: 0,
      departmentId: "", //部门编号
      //添加和修改用户窗口属性
      userDialog: {
        title: '',
        height: 410,
        width: 610,
        visible: false
      },
      //用户对象
      user: {
        id: '',
        departmentId: '',
        departmentName: '',
        email: '',
        realName: '',
        phone: '',
        nickName: '',
        password: '',
        username: '',
        gender: '',
        avatar: ''
      },
      rules: {
        departmentName: [{required: true, trigger: 'change', message: '请选择所属部门'}],
        realName: [{required: true, trigger: 'blur', message: '请填写姓名'}],
        phone: [{trigger: 'blur', validator: validatePhone}],
        username: [{required: true, trigger: 'blur', message: '请填写登录名'}],
        password: [{required: true, trigger: 'blur', message: '请填写登录密码'}],
        gender: [{required: true, trigger: 'change', message: '请选择性别'}]
      },
      //选择所属部门窗口属性
      parentDialog: {
        title: '选择所属部门',
        width: 300,
        height: 450,
        visible: false
      },//树节点属性
      parentProps: {
        children: 'children',
        label: 'departmentName'
      },
      parentList: [], //所属部门节点数据
      //上传需要携带的数据
      uploadHeader: {"token": getToken()},

      //分配角色窗口属性
      assignDialog: {
        title: "",
        visible: false,
        width: 800,
        height: 410,
      },
//角色对象
      roleVo: {
        pageNo: 1,
        pageSize: 10,
        userId: "",
        total: 0,
      },
      assignRoleList: [], //角色列表
      assignHeight: 0, //分配角色表格高度
      selectedIds: [], //被选中的角色id
      selectedUserId: "", //被分配角色的用户ID
    }
  }, methods: {
    onAssignClose() {
//隐藏窗口
      this.assignDialog.visible = false;
    },
    async onAssignConfirm() {
      //判断用户是否有选中角色
      if (this.selectedIds.length === 0) {
        this.$message.warning("请选择要分配的角色！");
        return;
      }
      let params = {
        userId: this.selectedUserId,
        roleIds: this.selectedIds,
      };
//发送请求
      let res = await saveUserRole(params);
//判断是否成功
      if (res.success) {
        this.$message.success(res.message);
//关闭窗口
        this.assignDialog.visible = false;
      } else {
        this.$message.error(res.message);
      }
    },
    /**
     * 当点击多选框时触发该事件
     */
    handleSelectionChange(rows) {
      let roleIds = [];
//循环遍历选中的角色ID
      for (let i = 0; i < rows.length; i++) {
//将当前选中的角色ID放到数组中
        roleIds.push(rows[i].id);
      }
//将选中的角色ID交给成员变量
      this.selectedIds = roleIds;
// this.selectedIds = rows.map(item => item.id);//等同于上述代码
    },
    /**
     * 查询当前登录用户的所有角色信息
     */
    async getAssignRoleList(pageNo = 1, pageSize = 10) {
//给用户ID赋值
      this.roleVo.userId = this.$store.getters.userId;
      this.roleVo.pageNo = pageNo;
      this.roleVo.pageSize = pageSize;
//发送查询请求
      let res = await getAssignRoleList(this.roleVo);
//判断是否成功
      if (res.success) {
//角色列表赋值
        this.assignRoleList = res.data.records;
//角色总数量赋值
        this.roleVo.total = res.data.total;
      }
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    assignSizeChange(size) {
      this.roleVo.pageSize = size; //将每页显示的数量交给成员变量
      this.getAssignRoleList(this.roleVo.pageNo, size);
    },
    /**
     * 当页码发生变化时触发该事件
     */
    assignCurrentChange(page) {
      this.roleVo.pageNo = page;
      //调用查询方法
      this.getAssignRoleList(page, this.roleVo.pageSize);
    },
    parentClick(data) {
      this.user.departmentId = data.id
      this.user.departmentName = data.departmentName
    },
    selectDepartment() {
      getDepartmentList({}).then(res => {
        if (res.success) {
          this.parentList = res.data
        }
        this.parentDialog.visible = true
      })

    },
    onParentClose() {
      this.parentDialog.visible = false
    },
    onParentConfirm() {
      this.parentDialog.visible = false
    },
    openParentBtn() {
      //使用默认
    },
    search(departmentId, pageNo = 1, pageSize = 10) {
      //将查询条件交给searchModel对象
      this.searchModel.departmentId = departmentId
      this.searchModel.pageNo = pageNo
      this.searchModel.pageSize = pageSize
      //发送请求
      getUserList(this.searchModel).then(res => {
        if (res.success) {
          this.userList = res.data.records;
          this.total = res.data.total;
        }
      })
    },
    resetValue() {
      this.searchModel.username = ''
      this.searchModel.realName = ''
      this.searchModel.departmentId = ''
      this.searchModel.pageNo = 1
      this.searchModel.pageSize = 10
      this.search(this.departmentId)
    },
    openAddWindow() {
      this.$resetForm('userForm', this.user)
      this.userDialog.visible = true //显示窗口
      this.userDialog.title = '新增用户' //设置标题
    },
    onClose() {
      this.userDialog.visible = false;
    },
    onConfirm() {
      //表单验证
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (this.user.id === '') {
            //新增
            addUser(this.user).then(res => {
              if (res.success) {
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            updateUser(this.user).then(res => {
              if (res.success) {
                if (res.success) {
                  this.$message.success(res.message)
                } else {
                  this.$message.error(res.message)
                }
              }
            })
          }
        }
        this.userDialog.visible = false;
        this.search(this.departmentId)
      })
    },
    handleEdit(row) {
      //设置弹框属性
      this.userDialog.title = '编辑用户'
      this.userDialog.visible = true
      //把当前编辑的数据复制到表单数据域，供回显使用
      this.$objCopy(row, this.user)
    },
    async handleDelete(row) {
      let confirm = await this.$myconfirm('确定要删除该数据吗?')
      if (confirm) {
        //封装条件
        let params = {id: row.id}
        //发送删除请求
        let res = await deleteUser(params)
        //判断是否成功
        if (res.success) {
          this.$message.success(res.message)
          //刷新
          this.search(this.departmentId, this.pageNo, this.pageSize);
        } else {
          this.$message.error(res.message)
        }
      }
    },
    /**
     * 打开分配角色
     */
    async assignRole(row) {
      //防止回显出现问题
      this.selectedIds = [];
      this.selectedUserId = "";
//被分配用户的id
      this.selectedUserId = row.id;
//显示窗口
      this.assignDialog.visible = true;
//设置标题
      this.assignDialog.title = `给【${row.realName}】分配角色`;
//查询当前登录用户的所有角色信息
      await this.getAssignRoleList();
//获取当前被分配用户的ID
      let params = {
        userId: row.id,
      };
//发送根据用户ID查询角色列表的请求
      let res = await getRoleIdByUserId(params);
//如果存在数据
      if (res.success && res.data) {
//将查询到的角色ID列表交给选中角色数组
        this.selectedIds = res.data;
//循环遍历
        this.selectedIds.forEach((key) => {
          this.assignRoleList.forEach((item) => {
            if (item.id === key) {
              this.$refs.assignRoleTable.toggleRowSelection(item, true);
            }
          });
        });
      }
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    handleSizeChange(size) {
      this.pageSize = size; //将每页显示的数量交给成员变量
      this.search(this.departmentId, this.pageNo, size);
    },
    /**
     * 当页码发生变化时触发该事件
     */
    handleCurrentChange(page) {
      this.pageNo = page;
      //调用查询方法
      this.search(this.departmentId, page, this.pageSize);
    },

    getDeptList() {
      getDepartmentList(this.departmentSearchModel).then(res => {
        //判断是否成功
        if (res.success) {
          this.deptList = res.data
          //树加载完成后，默认点击第一个节点
          this.$nextTick(() => {
            const firstNode = document.querySelector(".el-tree-node");
            firstNode.click();
          });
        }
      })
    },
    handleNodeClick(data) {
      //将当前选中节点的id赋值给departmentId
      this.departmentId = data.id
      this.search(this.departmentId)
    },
    openBtn() {

    },
    /**
     * 上传成功回调
     * @param res
     * @param file
     */
    handleAvatarSuccess(res, file) {
      this.user.avatar = res.data
      // 强制重新渲染
      this.$forceUpdate()
    },
    /**
     * 上传校验
     * @param file
     * @returns {boolean}
     */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  },
  mounted() {
    this.$nextTick(() => {
      //内容高度
      this.containerHeight = window.innerHeight - 80;
      this.tableHeight = window.innerHeight - 220
      //角色表格高度
      this.assignHeight = window.innerHeight - 350;
    })
  },

  created() {
    this.getDeptList()
    this.search()
  }
}
</script>

<style lang="scss" scoped>
//用户头像
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar-uploader img {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
