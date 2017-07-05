<template>
  <div class="uk-grid image-tagged-view-main">
    <div class="uk-width-1-1 image-tagged-menu"　>
      <ul class="uk-list">
        <li v-for="menu in imageMenu" v-on:click.stop.prevent="getMenuMsg(menu.index)">
          <a href="#"><i class="uk-icon-justify {{menu.icon}}"></i></a>
        </li>
      </ul>
    </div>
    <div class="selectedInform" v-if="selectedChannels && selectedTime">
      <strong>Selection Information:</strong>
      <span>{{ selectedChannels }} {{ selectedTime }} </span>
    </div>
    <div class="uk-thumbnail uk-thumbnail-expand" v-el:graph>
      <!--<img class="uk-thumbnail" src="../../../resource/3B/B1B5B6_2014_03_17.png" alt="">-->
    </div>
  </div>
</template>
<script>
  import EG from 'ENGINES'
  // d3v3 使用方式
//  let d3 = require('../../../plugins/d3v3.min.js')
//  console.log('d3v3', d3)
//  // d3v4 使用方式
//  console.log('d3v4', window.d3)
  export default {
    data () {
      return {
        isShowSelect: true,
        selectedTime: '', // 选择的时间 2014 2015 2016
        selectedChannels: '', // 单个通道 或者 有意义的组合
        renderIns: null,
        imageMenu: [
          { name: '选择', icon: 'uk-icon-bars', index: 0 },
          { name: '点击', icon: 'uk-icon-mouse-pointer', index: 1 },
          { name: '放大', icon: 'uk-icon-search-plus', index: 2 },
          { name: '缩小', icon: 'uk-icon-search-minus', index: 3 },
          { name: '平移', icon: 'uk-icon-arrows', index: 4 },
          { name: '圈选', icon: 'uk-icon-object-ungroup', index: 5 },
          { name: '标记', icon: 'uk-icon-text-height', index: 6 }
        ]
      }
    },
    methods: {
      getMenuMsg (index) {
        if (index === 0) {
          this.isShowSelect = true
        }
      }
    },
    ready () {
      this.renderIns = new EG.renders.GraphTag({ selector: this.$els.graph })
      this.renderIns.init()
    }
  }
</script>
<style lang="less" scoped>
  .image-tagged-view-main {
    border: 1px solid gray;
    box-sizing: border-box;
    padding: 0 8px;
    .image-tagged-menu {
      background: gray;
      li {
        list-style: none;
        float: left;
        width: 40px;
        text-align: center;
        i {
          color: black;
        }
      }
      li:hover {
        background: #324057;
      }
    }
    .select-tagged-menu {
      position: absolute;
    }
    .selectedInform {
      font-size: xx-small;
    }
  }
</style>