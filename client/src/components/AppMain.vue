<template>
  <!-- header main -->
  <div id="AppMain">
    <div class="containter">
      <div class="loading" id='loading'>
        <div class="back"></div>
        <div class="logo">
          <i class="fa fa-spinner fa-spin fa-lg"></i>
          <span> Loading ...</span>
        </div>
      </div>
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
      height: 80%;
      overflow-y: hidden;
    }
    @myTransition: all 0.3s ease;
    .loading {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-transition: @myTransition;
      transition: @myTransition;
      .back {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #f8f8f8;
        opacity: 0.8;
        z-index: 99;
      }
      .logo {
        position: absolute;
        margin: 50px auto;
        font-size: 30px;
        text-align: center;
        left: 45%;
        top: 40%;
        z-index: 100;
      }
      .hidden {
        opacity: 0;
        -webkit-transition: @myTransition;
        transition: @myTransition;
      }
    }
  }
</style>
