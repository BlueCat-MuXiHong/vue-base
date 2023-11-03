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

<style>
body {
  html, body, h3, p {
    padding: 0;
    margin: 0;
  }

  background-color: #D3D2C6;
  background-image: url("../static/img/texture.png");
}
</style>
