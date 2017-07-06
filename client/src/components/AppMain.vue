<template>
  <!-- header main -->
  <div id="AppMain">
    <div class="containter">
      <!--<div class="uk-grid">-->
      <!--</div>-->
      <app-main-top-view></app-main-top-view>
      <app-main-bottom-view></app-main-bottom-view>
    </div>
  </div>
</template>
<script>
  import AppMainTopView from './AppMainTop/Index.vue'
  import AppMainBottomView from './AppMainBottom/Index.vue'
  export default {
    data () {
      return {
      }
    },
    components: {
      AppMainTopView,
      AppMainBottomView
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  #AppMain {
    box-sizing: border-box;
    min-height: 100%;
    overflow: auto;
    .containter {
      position: absolute;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
