<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">

html {
  background-color: #525288;
  background-image: url("../static/img/texture.png");
}

html, body, h3, p {
  padding: 0;
  margin: 0;

}
</style>
