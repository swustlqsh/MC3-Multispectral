<template>
  <div class="main-top" :style="mainTopStyle">
    <div id='event-list' :style="eventListStyle">
      <event-view-list></event-view-list>
    </div>
    <div id='icon-list' :style="iconListStyle">
      <icon-list-view></icon-list-view>
    </div>
    <div id='image-matrix' :style="mainTopStyle">
      <image-matrix-view></image-matrix-view>
    </div>
  </div>
</template>
<script>
  import EventViewList from './EventViewList.vue'
  import IconListView from './IconListView.vue'
  import ImageMatrixView from './ImageMatrixView.vue'
  import {pageSize} from '../../vuex/getters'
  export default {
    vuex: {
      getters: {pageSize}
    },
    data () {
      return {
      }
    },
    components: {
      EventViewList,
      IconListView,
      ImageMatrixView
    },
    computed: {
      mainTopStyle () {
        let style = {}
        let height = this.pageSize.pageHeight / 3 - 15 + 'px'
        style.height = height
        return style
      },
      eventListStyle () {
        let style = {}
        style.height = this.pageSize.pageHeight / 3 - 15 + 'px'
        style.width = this.pageSize.pageWidth * 0.166 + 'px'
        return style
      },
      iconListStyle () {
        let style = {}
        style.height = this.pageSize.pageHeight / 3 - 15 + 'px'
        style.width = this.pageSize.pageWidth * 0.042 + 'px'
        return style
      }
    },
    ready () {
    }
  }
</script>
<style lang="less" scoped>
  .main-top {
    position: relative;
    width: 100%;
    #event-list {
      position: absolute;
      left: 0;
      top: 0;
      width: 16.6%;
      height: 33.3%;
      border: 1px solid #faa732;
    }
    #icon-list {
      position: absolute;
      left: 16.6%;
      top: 0;
      width: 4.2%;
      height: 33.3%;
      border: 1px solid #faa732;
    }
    #image-matrix {
      position: absolute;
      top: 0;
      left: 20.8%;
      width: 79.2%;
      height: 33.3%;
      overflow-y: auto;
    }
  }

</style>