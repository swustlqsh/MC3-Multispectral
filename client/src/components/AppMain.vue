<template>
  <div id="AppMain">
    <div class="containter">
      <div class="uk-grid">
        <div class="uk-width-3-10">
          <event-view-list></event-view-list>
          <image-tagged-view></image-tagged-view>
        </div>
        <div class="uk-width-7-10">
          app-main-right
          <!--<app-main-right></app-main-right>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import EventViewList from './AppMainLeft/EventViewList.vue'
  import ImageTaggedView from './AppMainLeft/ImageTaggedView.vue'
  export default {
    data () {
      return {
        favicon: ''
      }
    },
    components: {EventViewList, ImageTaggedView},
    ready () {}
  }
</script>
<style lang="less" scoped>
  #AppMain {
    box-sizing: border-box;
    min-height: 100%;
    .containter {
      position: relative;
      box-sizing: border-box;
      padding: 5px 10px;
    }
  }
</style>
