<template>
  <div id="App">
    <app-header></app-header>
    <app-main></app-main>
  </div>
</template>
<script>
  import AppHeader from './components/AppHeader.vue'
  import AppMain from './components/AppMain.vue'

  export default {
    data () {
      return {
        favicon: ''
      }
    },
    components: { AppHeader, AppMain },
    ready () {}
  }
</script>
<style lang="less" scoped>
  @import "./App.less";
</style>