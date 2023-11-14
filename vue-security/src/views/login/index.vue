<template>
  <div class="login-container">
    <!--
      "autocomplete"属性：用于设置表单的自动完成功能，可以是"on"、"off"等。
      "label-position"属性：用于设置表单标签的位置，可以是"left"、"right"等。
    -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <!--输入框标题-->
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>
      <!--用户名输入框-->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <!--
          "ref"属性：用于给输入框添加一个引用，可以通过该引用在Vue实例中访问到输入框的DOM元素。
          "v-model"属性：用于双向绑定输入框的值和Vue实例中的数据模型。当用户在输入框中输入内容时，该值会实时更新，反之亦然。
          "placeholder"属性：用于设置输入框的占位符文本，当输入框为空时，会显示该文本。
          "name"属性：用于设置输入框的名称，在提交表单时，该名称会作为键名，对应输入框的值会被发送到服务器。
          "type"属性：用于设置输入框的类型，可以是"text"、"password"、"number"等。
          "tabindex"属性：用于设置输入框的Tab键顺序，可以是数字或"auto"。
          "autocomplete"属性：用于设置输入框的自动完成功能，可以是"on"、"off"等。
        -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁已打开" manual placement="right">
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" style="width:100%;margin-bottom:30px;" type="primary"
                 @click.native.prevent="handleLogin">Login
      </el-button>
    </el-form>
  </div>
</template>

<script>
import {validUsername} from '@/utils/validate'
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: {SocialSign},
  data() {
    /**
     * 校验用户名
     * @param rule 规则
     * @param value
     * @param callback
     */
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    /**
     * 校验密码
     * @param rule
     * @param value
     * @param callback
     */
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      // 登录表单对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },

      passwordType: 'password', //密码输入框的类型
      capsTooltip: false, //大写锁
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  /**
   *
   * 这是一个Vue.js的watch选项，用于监听路由参数的变化。
   * 当路由参数发生变化时，该函数会被调用。在这个函数中，
   * 首先获取路由参数中的query对象，然后判断该对象是否存在。
   * 如果存在，就将该对象的redirect属性赋值给Vue实例的redirect属性，
   * 并将该对象的其他属性赋值给Vue实例的otherQuery属性。
   * 最后，immediate选项表示该函数会在组件挂载后立即执行一次。
   */
  // watch: {
  //   $route: {
  //     handler: function (route) {
  //       const query = route.query
  //       if (query) {
  //         this.redirect = query.redirect
  //         this.otherQuery = this.getOtherQuery(query)
  //       }
  //     },
  //     immediate: true
  //   }
  // },
  mounted() {
    //如果登录输入框为空，则把焦点聚焦到输入框上
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
      //如果密码输入框为空，则把焦点聚焦到输入框上
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    /**
     * 判断大写锁是否打开
     * @param e
     */
    checkCapslock(e) {
      const {key} = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    /**
     * 是否显示密码
     */
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      //表单验证
      this.$refs.loginForm.validate(valid => {
        //验证通过
        if (valid) {
          //开启进度条
          this.loading = true
          //调用src/store/modules/user.js中的login方法
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              //路由转发到指定地址
              this.$router.push({path: this.redirect || '/', query: this.otherQuery})
              //关闭进度条
              this.loading = false
            })
            .catch(() => {
              //关闭进度条
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
