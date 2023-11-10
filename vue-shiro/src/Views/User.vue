<template>
  <div>
    <div class="manage-header">
      <el-button type="primary" @click="handleAdd">+ 新增</el-button>
      <!--      &lt;!&ndash;  收缩  &ndash;&gt;-->
      <!--      <el-form :inline="true" :model="userForm" label-width="80px">-->
      <!--        <el-form-item >-->
      <!--          <el-input placeholder="请输入名称" v-model="userForm.name"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item >-->
      <!--          <el-button type="primary" @click="onSubmit">查询</el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
    </div>
    <el-table
      :data="tableData" border
      style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="账号" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="realname"></el-table-column>
      <el-table-column label="性别" width="50">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gender === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="phone"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="出生日期" prop="birthday"></el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.lock"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="roles">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.rolesList" multiple placeholder="请选择" style="margin-left: 5px"
            @visible-change="handlerUserRolesVisibleChange($event,scope.row)"
            @remove-tag="handlerUserRolesRemoveChange(scope.row)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="编辑">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row.usercode)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :before-close="handleClose"
      :title="modalType===0?'新增':'修改'"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option :value="1" label="男"/>
            <el-option :value="0" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            placeholder="选择日期"
            type="date"
            value-format="yyyy-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
import {addUser, delUser, getRoleByPage, getUserByPage, insertUserRoles, updateUser} from "../api";
import {compareArray} from "../utils/ArrayUtils";

export default {
  data() {
    return {
      pageParams: {
        pageNumber: 1,
        pageCount: 20,
        keyword: "string",
        sort: "string"
      },
      tableData: [],
      form: {
        usercode: '',
        username: '',
        realname: '',
        gender: '',
        phone: '',
        birthday: '',
        email: '',
        headImg: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        realname: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        gender: [
          {required: true, message: '请输入性别', trigger: 'blur'},
        ],
        phone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
        ],
        birthday: [
          {required: true, message: '请输入生日', trigger: 'blur'},
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
        ]
      },
      modalType: 0, //
      dialogVisible: false,
      options: [],
      value: []
    }
  },
  methods: {
    /**
     * 初始化获取用户列表
     */
    getUserList() {
      getUserByPage(this.pageParams).then((data) => {
        let list = data.data.list
        //后端返回的值需要转换一下，适配角色在下拉框中
        list.map(item => {
          if (item.roles.length === 0) {
            item.rolesList = []
          } else {
            item.rolesList = []
            item.roles.forEach(temp => {
              if (temp) {
                item.rolesList.push(temp.id)
              }
            })
          }
        })
        this.tableData = list
      })
    },
    /**
     * 获取初始化的角色信息
     */
    getRoleList() {
      getRoleByPage(this.pageParams).then((data) => {
        data.data.list.forEach(item => {
          this.options.push({value: item.id, label: item.name})
        })
      })
    },
    /**
     * 点击添加用户时，展开dialog框
     */
    handleAdd() {
      this.modalType = 0;
      this.dialogVisible = true;
    },
    /**
     * 编辑用户时，更新this.form
     * @param val
     */
    handleEdit(val) {
      this.modalType = 1;
      this.dialogVisible = true;
      //注意需要对数据进行深拷贝，否则会出错
      this.form = JSON.parse(JSON.stringify(val))
    },
    /**
     * 删除用户
     */
    handleDel(usercode) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(usercode).then(() => {
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * dialog点击取消按钮
     */
    cancel() {
      this.handleClose()
    },
    /**
     * 提交表单（增加/修改）
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //新增
          if (this.modalType === 0) {
            addUser(this.form).then(data => {
              if (data.code === 200) {
                this.$message.success("添加成功")
                this.getUserList()
              }
            })
          } else {
            //编辑
            updateUser(this.form).then((data) => {
              if (data.code === 200) {
                this.$message.success("修改成功")
                this.getUserList(this.pageParams)
              }
            })
          }
          this.handleClose()
        }
      })
    },
    /**
     * 关闭dialog事对表单进行清空
     */
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    /**
     * 角色更新时的逻辑判断
     * @param isVisible $event
     * @param val 值
     */
    handlerUserRolesVisibleChange(isVisible, val) {
      if (!isVisible) {
        //判断，如果rolesList中的值和role中的值相同，不发起请求
        //取出roles中的值
        let rolesId = []
        val.roles.forEach(item => {
          rolesId.push(item.id)
        })
        if (!compareArray(rolesId, val.rolesList)) {
          let params = {id: val.usercode, ids: val.rolesList}
          insertUserRoles(params).then(data => {
            if (data.code === 200) {
              this.$message.success("修改成功")
              this.getUserList()
            }
          })
        }
      }
    },
    /**
     * 在dialog没有展开式，点检删除角色时，触发该方法
     * @param val 值
     */
    handlerUserRolesRemoveChange(val) {
      let params = {id: val.usercode, ids: val.rolesList}
      insertUserRoles(params).then(data => {
        if (data.code === 200) {
          this.$message.success("修改成功")
          this.getUserList()
        }
      })
    }
  },
  mounted() {
    this.getUserList()
    this.getRoleList()
  }
}


</script>

<style scoped>
.box /deep/ .el-table--border td {
  border-left: 0 !important;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
