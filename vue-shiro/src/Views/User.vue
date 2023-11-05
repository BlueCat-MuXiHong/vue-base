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
      :data="tableData"
      style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="账号" prop="username" width="100"></el-table-column>
      <el-table-column label="姓名" prop="realname" width="100"></el-table-column>
      <el-table-column label="性别" width="50">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gender === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="phone"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="出生日期" prop="birthday"></el-table-column>
      <el-table-column label="是否启用">
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
          <el-select v-model="value" multiple placeholder="请选择" style="margin-left: 5px">
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
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
import {addUser, getRoleByPage, getUserByPage, updateUser} from "../api";

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
    handleEdit(val) {
      this.modalType = 1;
      this.dialogVisible = true;
      //注意需要对数据进行深拷贝，否则会出错
      this.form = JSON.parse(JSON.stringify(val))
    },
    handleDel() {
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   delUser({id:val.id}).then(()=>{
      //     this.getUserList()
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
    },
    handleAdd() {
      this.modalType = 0;
      this.dialogVisible = true;
    },
    cancel() {
      this.handleClose()
    },
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
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    getUserList() {
      getUserByPage(this.pageParams).then((data) => {
        this.tableData = data.data.list
      })
    },
    getRoleList() {
      getRoleByPage(this.pageParams).then((data) => {
        data.data.list.forEach(item => {
          this.options.push({value: item.name, label: item.code})
        })
      })
    }
  },
  computed: {
    roleTemp(val) {
      let temp;
      val.forEach(item => {
        temp.push({value: item.id, label: item.name})
      })
      return temp
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
  border-left: 0;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
