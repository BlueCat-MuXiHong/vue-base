<template>
  <el-form ref="form" :inline="true" :model="form" :rules="rules" class="login-container" label-width="70px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getMenu, login} from "../api";

export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [{required: true, trigger: 'blur', message: '请输入用户名'}],
        password: [{required: true, trigger: 'blur', message: '请输入密码'}]
      }
    }
  }, methods: {
    //登录
    submit() {
      //校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          //校验成功
          login(this.form).then((data) => {
            //登录
            var code = data.code
            if (code === 200) {
              sessionStorage.setItem("Authorization", data.data.access_token)
              sessionStorage.setItem("refreshToken", data.data.refresh_token)
              //获取菜单

              this.menuFormat();
              // getMenu().then((data) => {
              //   this.$store.commit('setMenu', data.data)
              //   this.$store.commit('addMenu', this.$router)
              //   this.$message.success("登录成功")
              //   this.$router.push("/main")
              // })

            } else {
              this.$message.error(data.data.message)
            }
          })
        }
      })
    },
    menuFormat() {
      getMenu().then(data => {
        //处理数据
        console.log('allMenu', data.data)
        //存储两份，1.份存储在local,一份在store
        localStorage.setItem('menu', JSON.stringify(data.data))
        this.$store.commit('setMenu', data.data)
        this.$message.success("登录成功")
        this.$router.push("/main")
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  border: 1px solid #eaeaea;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  background-color: #FFF;
  border-radius: 15px;
  box-shadow: 0 0 25px #cac6c6;
  box-sizing: border-box;
  text-align: center;

  .el-input {
    width: 198px;
  }

  .login_title {
    text-align: center;
    margin-bottom: 40px;
    color: #505458;
  }
}
</style>
