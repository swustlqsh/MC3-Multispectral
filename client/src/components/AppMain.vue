<template>
  <!-- header main -->
  <div id="AppMain">
    <div class="containter">
      <!--<div class="uk-grid">-->
      <!--</div>-->
      <app-main-left-view></app-main-left-view>
      <app-main-right-view></app-main-right-view>
    </div>
  </div>
</template>
<script>
  import AppMainLeftView from './AppMainLeft/Index.vue'
  import AppMainRightView from './AppMainRight/Index.vue'
  export default {
    data () {
      return {
      }
    },
    components: {
      AppMainLeftView,
      AppMainRightView
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
      padding: 5px 10px;
      width: 100%;
      height: 100%;
    }
  }
</style>
