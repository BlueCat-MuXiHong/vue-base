<template>
  <div>
    <el-table
      :data="tableData" border
      style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="角色名" prop="name"></el-table-column>
      <el-table-column label="角色描述" prop="description"></el-table-column>
      <el-table-column label="角色类型" prop="roleType"></el-table-column>
      <el-table-column label="创建人" prop="createPerson"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
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
      <el-table-column label="编辑">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
          <el-button size="mini" type="warning" @click="handleRolePermission(scope.row)">分配权限</el-button>
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
    <el-dialog :visible.sync="dialogVisible1">
      <Detail
        :roles="rolePermission">
      </Detail>
    </el-dialog>
  </div>
</template>

<script>
import {getPermissionByRoleId, getRoleByPage} from "../api";
import Detail from "../components/Detail.vue";

export default {
  components: {
    Detail
  },
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
      modalType: 0,
      dialogVisible: false,
      dialogVisible1: true,
      rolePermission: [],

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
      }
    }
  }, methods: {
    handleEdit() {
      this.dialogVisible = true;
    },
    handleDel() {

    },
    handleRolePermission() {
      this.dialogVisible1 = true
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    submit() {
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
    },
    getRoles() {
      getRoleByPage(this.pageParams).then(data => {
        this.tableData = data.data.list
      })
    },
    getPermissionByRoleId() {
      getPermissionByRoleId("922909b9-eb8c-4bc7-bd74-6638ea9e0a2c").then(data => {
        console.log(data.data)
        this.rolePermission = data.data
      })
    }
  },
  mounted() {
    this.getRoles()
    this.getPermissionByRoleId()
  }
}
</script>

<style lang="less" scoped>
.roles-box {
  height: 75vh;

  .button_list {
    margin-top: 24px;

    & > .el-button + .el-button {
      margin-left: 10px;
    }
  }


  .content-children {
    width: 100%;
  }

  .role-name {
    margin-top: 20px;

    & span {
      padding-right: 15px;
      width: 70px;
      color: #606266;
      font-size: 14px;
      line-height: 38px;
    }

    & input {
      box-sizing: border-box;
      padding: 0 15px;
      width: calc(100% - 95px);
      height: 38px;
      outline: none;
      border: 1px solid #ebebeb;
      border-radius: 19px;
      background: rgba(245, 248, 253, 1);
      font-size: 15px;
    }
  }

  .role-all_show {
    margin-bottom: 15px;
    color: #303133;
    font-size: 16px;
  }

  .table-head {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    border: 1px solid #ebebeb;
    font-size: 16px;

    > div {
      &:first-child,
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        width: 170px;
        text-align: center;
      }

      &:last-child {
        flex: 1;
        text-align: center;
      }
    }
  }

  table {
    margin: 0 0 2px 0;
    padding: 0;
    width: 100%;
    border-collapse: collapse;
  }

  tr td {
    margin: 0;
    padding: 0;
  }

  .title-about__model {
    width: 170px;
    text-align: center;
  }

  .title-about__name {
    border-top: solid 1px #ebebeb;
    border-left: solid 1px #ebebeb;
  }

  .roles_list {
    display: flex;
    width: 100%;
  }

  .roles_pege {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 10px;
    width: 170px;
    border-top: solid 1px #ebebeb;
    border-left: solid 1px #ebebeb;
  }

  td {
    border-right: solid 1px #ebebeb;
    border-bottom: solid 1px #ebebeb;
    border-left: solid 1px #ebebeb;
  }

  .level1 {
    padding: 10px 0;
  }

  .level2-name {
    padding: 10px 0;
  }

  .level3, .level4 {
    border-left: solid 1px #ebebeb;
  }

  .level2:not(:last-child) {
    border-bottom: solid 1px #ebebeb;
  }

  .level3:not(:last-child) {
    border-bottom: solid 1px #ebebeb;
  }

  .level2, .level3, .level4 {
    align-items: center;
  }

  .roles_roles {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: calc(100% - 170px);
    border-top: solid 1px #ebebeb;
    border-right: solid 1px #ebebeb;
    border-left: solid 1px #ebebeb;
  }

  .roles_check {
    padding: 10px;
  }

  .role-modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    width: 100%;
  }

  .role-table-wrapper {
    height: 55vh;
    border-bottom: solid 1px #ebebeb;
  }

  .role-table__scrollbar {
    overflow: hidden;
    width: 100%;
    height: 99%;
  }
}
</style>
