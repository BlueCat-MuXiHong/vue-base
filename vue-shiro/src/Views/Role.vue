<template>
  <div>
    <el-table
      :data="tableData" border
      style="width: 100%"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}">
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
          <el-button size="mini" type="warning" @click="handleRolePermission(scope.row.id)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :before-close="handleClose"
      :title="modalType===0?'新增':'修改'"
      :visible.sync="dialogVisibleRole"
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
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisiblePermission" width="50%">
      <Detail v-if="dialogVisiblePermission"
              :roleId="roleId" :roles="rolePermission" @cancel='cancel' @save-role="saveRole">
      </Detail>
    </el-dialog>
  </div>
</template>

<script>
import {getPermissionByRoleId, getRoleByPage, insetRolePermission} from "../api";
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
      dialogVisibleRole: false,
      dialogVisiblePermission: false,
      rolePermission: [],
      roleId: '',
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
    /**
     * 关闭dialog前做的事
     */
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisibleRole = false
    },
    /**
     * 初始化，获取全部不的角色信息
     */
    getRoles() {
      getRoleByPage(this.pageParams).then(data => {
        this.tableData = data.data.list
      })
    },
    /**
     * 编辑角色信息
     */
    handleEdit() {
      this.dialogVisibleRole = true;
    },
    /**
     * 删除角色操作
     */
    handleDel() {

    },
    /**
     * 作用于新增或编辑时的提交按钮
     */
    submit() {
      this.$refs.form.resetFields();
      this.dialogVisibleRole = false;
    },
    /**
     * 作用于新增或编辑时的取消按钮
     */
    cancel() {
      this.dialogVisiblePermission = false
    },
    /**
     * 打开dialog并将当前的权限信息更新
     * @param roleId
     */
    handleRolePermission(roleId) {
      getPermissionByRoleId(roleId).then(data => {
        this.rolePermission = data.data
        this.roleId = roleId
        this.dialogVisiblePermission = true
      })
    },
    saveRole(data) {
      insetRolePermission(data).then(data => {
        if (data.code === 200) {
          this.$message.success("修改成功")
          this.getRoles()
        }
      })
      this.dialogVisiblePermission = false;
    },
  },
  mounted() {
    this.getRoles()
  }
}
</script>

<style lang="less" scoped>


</style>
