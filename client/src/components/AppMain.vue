<template>
  <div id="AppMain">
    <div class="containter">
      <div class="uk-grid">
        <div id = 'event-list'>
          <event-view-list></event-view-list>
        </div>
        <div id = 'icon-list'>
          <icon-list-view></icon-list-view>
        </div>
        <div id = 'image-tagged'>
          <image-tagged-view></image-tagged-view>
        </div>
        <div id = 'image-matrix'>
          <image-matrix-view></image-matrix-view>
        </div>
        <div id = 'image-comparison'>
          <image-comparison-view></image-comparison-view>
        </div>
        <div id = 'distribution-histogram'>
          <distribution-histogram-view></distribution-histogram>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import EventViewList from './AppMainLeft/EventViewList.vue'
  import IconListView from './AppMainLeft/IconListView.vue'
  import ImageTaggedView from './AppMainLeft/ImageTaggedView.vue'
  import ImageMatrixView from './AppMainRight/ImageMatrixView.vue'
  import ImageComparisonView from './AppMainRight/ImageComparisonView.vue'
  import DistributionHistogramView from './AppMainRight/DistributionHistogramView.vue'
  export default {
    data () {
      return {
        favicon: ''
      }
    },
    components: {EventViewList, IconListView, ImageTaggedView, ImageMatrixView, ImageComparisonView, DistributionHistogramView},
    ready () {}
  }
</script>
<style lang="less" scoped>
  #AppMain {
    box-sizing: border-box;
    min-height: 100%;
    .containter {
      position: absolute;
      box-sizing: border-box;
      padding: 5px 10px;
      width: 100%;
      height: calc(100% - 30px);
      #event-list {
        position: absolute;
        left: 0%;
        top: 0%;
        width: 16.6%;
        height: 33.3%;
        background-color: red;
      }
      #icon-list {
        position: absolute;
        left: 16.6%;
        top: 0%;
        width: 4.2%;
        height: 33.3%;
        background-color: green;
      }
      #image-tagged {
        position: absolute;
        left: 0%;
        top: 33.3%;
        width: 25%;
        height: 66.7%;
        background-color: blue;
      }
      #image-matrix {
        position: absolute;
        top: 0%;
        left: 20.8%;
        width: 79.2%;
        height: 33.3%;
        background-color: yellow;
      }
      #image-comparison {
        position: absolute;
        left: 25%;
        top: 33.3%;
        width: 75%;
        height: 66.7%;
        background-color: gray;
      }
      #distribution-histogram {
        position: absolute;
        left: 87.5%;
        top: 33.3%;
        width: 12.5%;
        height: 66.6%;
        background-color: black;
      }
    }
  }
</style>
