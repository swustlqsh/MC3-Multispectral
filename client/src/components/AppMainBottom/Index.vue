<template>
  <div class="main-bottom" :style="mainBottomStyle">
    <div id='image-tagged' :style="imageTaggedStyle">
      <image-tagged-view></image-tagged-view>
    </div>
    <div id='image-comparison' :style="imageComparisonStyle">
      <image-comparison-view></image-comparison-view>
    </div>
    <div id='distribution-histogram' :style="DistributionHistogramViewStyle">
      <distribution-histogram-view></distribution-histogram-view>
    </div>
    <div id='timeline' :style="TimelineViewStyle">
      <timeline-view></timeline-view>
    </div>
  </div>
</template>
<script>
  import ImageTaggedView from './ImageTaggedView.vue'
  import ImageComparisonView from './ImageComparisonView.vue'
  import DistributionHistogramView from './DistributionHistogramView.vue'
  import TimelineView from './TimelineView.vue'
  import {pageSize} from '../../vuex/getters'
  export default {
    vuex: {
      getters: {pageSize}
    },
    data () {
      return {
        tH2: 30
      }
    },
    components: {
      ImageTaggedView,
      ImageComparisonView,
      DistributionHistogramView,
      TimelineView
    },
    computed: {
      mainBottomStyle () {
        let style = {}
        let height = this.pageSize.pageWidth / 2 + 'px'
        style.height = height
        return style
      },
      imageTaggedStyle () {
        let style = {}
        style.height = 2 * this.pageSize.pageHeight / 3 + 'px'
        style.width = this.pageSize.pageWidth * 0.25 + 'px'
        return style
      },
      imageComparisonStyle () {
        let style = {}
//        style.top = tH * this.pageSize.pageHeight - 15 + 'px'
        style.top = this.tH2 + 'px'
        style.height = 2 * this.pageSize.pageHeight / 3 - this.tH2 + 'px'
        style.width = this.pageSize.pageWidth * 0.625 + 'px'
        return style
      },
      DistributionHistogramViewStyle () {
        let style = {}
//        style.top = this.tH * this.pageSize.pageHeight - 15 + 'px'
        style.top = this.tH2 + 'px'
        style.height = 2 / 3 * this.pageSize.pageHeight - this.tH2 + 'px'
        style.width = this.pageSize.pageWidth * 0.125 + 'px'
        return style
      },
      TimelineViewStyle () {
        let style = {}
//        style.height = this.tH * this.pageSize.pageHeight - 15 + 'px'
        style.height = this.tH2 + 'px'
        style.width = this.pageSize.pageWidth * 0.75 + 'px'
        return style
      }
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  .main-bottom {
    position: relative;
    width: 100%;
    #timeline {
      position: absolute;
      left: 25%;
      width: 75%;
      height: 10%;
      border: 1px solid rebeccapurple;
    }
    #image-tagged {
      position: absolute;
      left: 0;
      width: 25%;
      height: 66.7%;
      border: 1px solid rebeccapurple;
    }
    #image-comparison {
      position: absolute;
      left: 25%;
      width: 62.5%;
      height: 66.7%;
      border: 1px solid rebeccapurple;
    }
    #distribution-histogram {
      position: absolute;
      left: 87.5%;
      width: 12.5%;
      height: 66.6%;
      border: 1px solid rebeccapurple;
    }
  }
</style>