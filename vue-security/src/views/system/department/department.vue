<template>
  <el-main>
    <!--  条件查询区域  -->
    <el-form ref="searchForm" :inline="true" label-width="80px" size="small">
      <el-form-item label="审批人">
        <el-input v-model="searchModel.departmentName" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetValue">重置</el-button>
        <el-button icon="el-icon-plus" type="success" @click="openAddWindow">新增</el-button>
      </el-form-item>
    </el-form>
    <!--  表单区域  -->
    <!--
      stripe：斑马线
      row-key：行数据的key,用于优化渲染
      default-expand-all：默认展开树形表格的数据
      :tree-props：属性表格配置属性选项
     -->
    <el-table
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      default-expand-all
      row-key="id"
      stripe
      style="width: 100%;margin-bottom: 20px;">
      <!--   prop 填写数据的属性名称   -->
      <el-table-column label="部门名称" prop="departmentName"></el-table-column>
      <el-table-column label="所属部门" prop="parentName"></el-table-column>
      <el-table-column label="部门电话" prop="phone"></el-table-column>
      <el-table-column label="部门地址" prop="address"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            icon="el-icon-delete-solid"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  添加和修改窗口  -->
    <system-dialog
      :height="deptDialog.height"
      :title="deptDialog.title"
      :visible="deptDialog.visible"
      :width="deptDialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <!--   作用域插槽   -->
      <div slot="content">
        <el-form ref="deptForm"
                 :inline="true"
                 :model="dept"
                 :rules="rules"
                 label-width="80px"
                 size="small">
          <el-form-item label="所属部门" prop="parentName">
            <el-input v-model="dept.parentName" :readonly="true" @click.native="openSelectDeptWindow()"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="departmentName">
            <el-input v-model="dept.departmentName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话">
            <el-input v-model="dept.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="dept.address"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dept.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!--选择所属部门的窗口-->
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
          :data="treeList"
          :default-expand-all="true"
          :highlight-current="true"
          :props="defaultProps"
          :show-checkbox='false'

          empty-text="暂无数据"
          @node-click="handleNodeClick">
          <div slot-scope="{node,data}" class="custom-tree-node">
            <!--判断当前节点的子节点长度是否为0-->
            <span v-if="data.children.length===0">
              <i class="el-icon-document"></i>
            </span>
            <span v-else>
              <svg-icon v-if="data.open" icon-class="add_circle_outlined"></svg-icon>
              <svg-icon v-else icon-class="remove_circle_outlined"></svg-icon>
            </span>
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>

import {
  addDept,
  checkDepartment,
  deleteDepartmentById,
  getDepartmentList,
  getParentTreeList,
  updateDept
} from "@/api/department";
import SystemDialog from "@/components/system/systemDialog.vue";

export default {
  components: {
    SystemDialog
  },
  data() {
    return {
      searchModel: {
        departmentName: ''
      },
      tableData: [],
      deptDialog: {
        title: "",//窗口标题
        visible: false,//是否显示
        width: 560,//窗口宽度
        height: 170//矿口高度
      }
      , dept: {
        id: '',//部门id
        parentName: '', //所属部门名
        pid: '',//所属部门id
        departmentName: '',//部门名称
        phone: '',//部门电话
        address: '',//部门地址
        orderNum: ''//部门序号
      },
      rules: {
        parentName: [{required: true, message: '请选择所属部门', trigger: 'change'}],
        departmentName: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
      },
      //选择所属部门的矿口
      parentDialog: {
        title: "选择所属部门",//窗口标题
        visible: false,//是否显示
        width: 300,//窗口宽度
        height: 400//矿口高度
      },
      treeList: [],
      defaultProps: {
        //树型组件默认值
        children: 'children',
        label: 'departmentName'
      }
    }
  }, methods: {
    search() {
      getDepartmentList(this.searchModel).then(res => {
        //判断是否成功
        if (res.success) {
          this.tableData = res.data
        }
      })
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      this.$resetForm("deptForm", this.dept)
      //设置窗口的属性
      this.deptDialog.title = "新增部门"
      this.deptDialog.visible = true
    },
    /**
     * 窗口关闭事件
     */
    onClose() {
      this.deptDialog.visible = false
    },
    /**
     * 窗口确定事件
     */
    onConfirm() {
      //进行表单验证
      this.$refs.deptForm.validate((valid) => {
        //验证通过
        if (valid) {
          //关闭窗口
          this.deptDialog.visible = false
          //判断当前是新增还是修改（判断dept对象的id是否为空）
          if (this.dept.id === "") {
            //发送添加请求
            addDept(this.dept).then(res => {
              if (res.success) {
                //提示
                this.$message.success(res.message)
                //刷新
                this.search()
                //关闭
                this.deptDialog.visible = false
              } else {
                //提示失败
                this.$message.error(res.message)
              }
            })
          } else {
            updateDept(this.dept).then(res => {
              if (res.success) {
                //提示
                this.$message.success(res.message)
                //刷新
                this.search()
                //关闭
                this.deptDialog.visible = false
              } else {
                //提示失败
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    //打开选择所属部门的矿口
    openSelectDeptWindow() {
      this.parentDialog.visible = true
      getParentTreeList().then(res => {
        if (res.success) {
          this.treeList = res.data
        }
      })
    },
    onParentClose() {
      this.parentDialog.visible = false
    },
    onParentConfirm() {
      this.parentDialog.visible = false
    },
    /**
     * 树节点点击事件
     */
    handleNodeClick(data) {
      data.open = !data.open
      //当点击树节点时，赋予选中的值
      this.dept.pid = data.id;
      this.dept.parentName = data.departmentName;
    },
    //编辑部门
    handleEdit(row) {
      this.$objCopy(row, this.dept)
      //dialog标题
      this.deptDialog.title = "编辑部门"
      //显示窗口
      this.deptDialog.visible = true
    },
    //删除部门
    async handleDelete(row) {
      //查询部门下是否有子部门和用户
      //查询部门下是否存在子部门或用户
      let result = await checkDepartment({id: row.id});
      //判断是否可以删除
      if (!result.success) {
        //提示不能删除
        this.$message.warning(result.message);
      } else {
        //确认是否删除
        let confirm = await this.$myconfirm("确定要删除该数据吗?");
        if (confirm) {
          //发送删除请求
          let res = await deleteDepartmentById({id: row.id});
          //判断是否成功
          if (res.success) {
            //成功提示
            this.$message.success(res.message);
            //刷新
            this.search();
          } else {
            //失败提示
            this.$message.error(res.message);
          }
        }
      }
    },
    resetValue() {
      //清空数据
      this.searchModel.departmentName = ''
      this.search()
    }
  }, created() {
    //初始化时调用获取部门的数据
    this.search()
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }

  .el-tree-node__children {
    padding-left: 20px;
  }

  .el-tree-node :last-child:before {
    height: 40px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree :first-child .el-tree-node:before {
    border-left: none;
  }

  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }

  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }

  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }

  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

::v-deep .el-tree > div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}
</style>
