<template>
  <div class="main-left">
    <div id='event-list'>
      <event-view-list></event-view-list>
    </div>
    <div id='icon-list'>
      <icon-list-view></icon-list-view>
    </div>
    <div id='image-tagged'>
      <image-tagged-view></image-tagged-view>
    </div>
  </div>
</template>
<script>
  import EventViewList from './EventViewList.vue'
  import IconListView from './IconListView.vue'
  import ImageTaggedView from './ImageTaggedView.vue'
  export default {
    data () {
      return {
        favicon: ''
      }
    },
    components: {
      EventViewList,
      IconListView,
      ImageTaggedView
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  .main-left {
    width: 100%;
    height: 100%;
    #event-list {
      position: absolute;
      left: 0;
      top: 0;
      width: 16.6%;
      height: 33.3%;
      background-color: #0b97c4;
    }
    #icon-list {
      position: absolute;
      left: 16.6%;
      top: 0;
      width: 4.2%;
      height: 33.3%;
      background-color: rebeccapurple;
    }
    #image-tagged {
      position: absolute;
      left: 0;
      top: 33.3%;
      width: 25%;
      height: 66.7%;
    }
  }

</style>