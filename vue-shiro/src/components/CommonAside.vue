<template>

  <el-menu active-text-color="#ffd04b"
           background-color="#545c64"
           class="el-menu-vertical-demo"
           default-active="1-4-1"
           :collapse="isCollapse"
           text-color="#fff"
           @close="handleClose"
           @open="handleOpen"
  >
    <h3>{{ isCollapse ? '后台' : '通用系统' }} </h3>
    <el-menu-item v-for="item in noChildren"
                  :key="item.id"
                  :index="item.id"
                  @click="clickMenu(item)"
    >
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>

    <el-submenu v-for="item in hasChildren" :key="item.label" index="item.label">
      <template>
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.name }}</span>
      </template>
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
        <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">{{ subItem.name }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

  </el-menu>
</template>

<script>

export default {

  data() {
    return {}
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //点击菜单
    clickMenu(item) {
      //当页面的路由与跳转的路由不一致才允许跳转
      if (this.$route.path !== item.url && !(this.$route.path === '/home' && (item.path === '/'))) {
        this.$router.push(item.url)
      }
    }
  }, computed: {
    menu() {
      return this.$store.state.tab.menu || JSON.parse(localStorage.getItem('menu'))
    },
    noChildren() {
      console.log(this.menu)
      return this.menu.filter(item => item.children.length === 0)
    },
    hasChildren() {
      return this.menu.filter(item => item.children.length !== 0)
    },
    isCollapse() {
      return this.$store.state.tab.collapseMenu
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
  }

  height: 100vh;
  border: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
