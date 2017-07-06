<template>
  <div class="main-right">
    <div id='image-matrix'>
      <image-matrix-view></image-matrix-view>
    </div>
    <div id='image-comparison'>
      <image-comparison-view></image-comparison-view>
    </div>
    <div id='distribution-histogram'>
      <distribution-histogram-view></distribution-histogram-view>
    </div>
  </div>
</template>
<script>
  import ImageMatrixView from './ImageMatrixView.vue'
  import ImageComparisonView from './ImageComparisonView.vue'
  import DistributionHistogramView from './DistributionHistogramView.vue'
  export default {
    data () {
      return {
      }
    },
    components: {
      ImageMatrixView,
      ImageComparisonView,
      DistributionHistogramView
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  .main-right {
    margin-left: 10px;
    #image-matrix {
      position: absolute;
      top: 0;
      left: 20.8%;
      width: 79.2%;
      height: 33.3%;
      overflow-y: auto;
    }
    #image-comparison {
      position: absolute;
      left: 25%;
      top: 33.3%;
      width: 75%;
      height: 66.7%;
    }
    #distribution-histogram {
      position: absolute;
      left: 87.5%;
      top: 33.3%;
      width: 12.5%;
      height: 66.6%;
    }
  }
</style>