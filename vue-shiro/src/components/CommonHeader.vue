<template>
  <div class="header-container">
    <!--    <div class="l-content">-->
    <!--      <el-button style="margin-right: 10px" icon="el-icon-menu" size="mini" @click="handMenu"></el-button>-->
    <!--      &lt;!&ndash;面包屑&ndash;&gt;-->
    <!--      <el-breadcrumb separator="/">-->
    <!--        <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">{{ item.label }}-->
    <!--        </el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="r-content">
      <el-dropdown>
                <span class="el-dropdown-link">
                  <img class="userImg" src="../assets/images/user.png"/>
                </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="lagOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Cookie from "js-cookie";

export default {
  data() {
    return {}
  },
  methods: {
    handMenu() {
      this.$store.commit('collapseMenu')
    },
    lagOut() {
      sessionStorage.removeItem('Authorization')
      sessionStorage.removeItem('refreshToken')
      Cookie.remove('menu')
      this.$router.push('/login')
    }
  },
  // computed: {
  //   ...mapState({
  //     tags: state => state.tab.tableList
  //   })
  // }
}
</script>

<style lang="less" scoped>
.header-container {
  background-color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }

  .r-content {
    .userImg {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  .l-content {
    display: flex;
    align-items: center;

    /deep/ .el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;

        &.is-link {
          color: #666;
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: white;
        }
      }
    }
  }
}

</style>
