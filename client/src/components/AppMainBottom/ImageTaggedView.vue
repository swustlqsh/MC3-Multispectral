<template>
  <div class="uk-grid image-tagged-view-main">
    <div class="uk-width-1-1 image-tagged-menu" id="image_menu">
      <ul class="uk-list">
        <li :class="{'active': index == selectedId}" v-for="(index, menu) in imageMenu"
            v-on:click.stop.prevent="getMenuMsg(menu.index)">
          <a href="#" v-if="index==0"><i class="uk-icon-justify {{menu.icon}}"></i></a>
          <a href="#" v-else>
            <img :src="menu.image" height="15" width="15"/>
          </a>
        </li>
      </ul>
    </div>
    <div v-el:graph>
      <!--<img class="uk-thumbnail" src="../../../resource/3B/B1B5B6_2014_03_17.png" alt="">-->
      <canvas id="image_canvas"></canvas>
      <canvas id="region_canvas"></canvas>
    </div>
  </div>
</template>
<script>
  import EG from 'ENGINES'
  export default {
    data () {
      return {
        isShowSelect: true,
        selectedTime: '', // 选择的时间 2014 2015 2016
        selectedChannels: '', // 单个通道 或者 有意义的组合
        renderIns: null,
        selectedId: 0,
        imageMenu: [
          { name: '选择', icon: 'uk-icon-bars', index: 0 },
          { name: '点击', icon: 'uk-icon-mouse-pointer', index: 1, image: '../../../assets/images/选择.png' },
          { name: '放大', icon: 'uk-icon-search-plus', index: 2, image: '../../../assets/images/放大.png' },
          { name: '缩小', icon: 'uk-icon-search-minus', index: 3, image: '../../../assets/images/缩小.png' },
          { name: '平移', icon: 'uk-icon-arrows', index: 4, image: '../../../assets/images/移动.png' },
          { name: '套索', icon: 'uk-icon-object-ungroup', index: 5, image: '../../../assets/images/套索.png' },
          { name: '标记', icon: 'uk-icon-text-height', index: 6, image: '../../../assets/images/文字.png' }
        ]
      }
    },
    methods: {
      getMenuMsg (index) {
        if (index === 0) {
          this.isShowSelect = true
        }
        this.selectedId = index
      },
      // loadStart 读取相关的事件
      loadStart () {

      }
    },
    ready () {
      this.renderIns = new EG.renders.GraphTag({ selector: this.$els.graph })
      this.renderIns.init({
        image_canvas_id: 'image_canvas',
        region_canvas_id: 'region_canvas'
      })
      this.renderIns.loadStoreLocalImg('../../../resource/3B/B1B5B6_2014_03_17.png', 'B1B5B6_2014_03_17')
      this.renderIns.showImage(0)
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
      position: relative;
      li {
        list-style: none;
        float: left;
        width: 30px;
        text-align: center;
        i {
          color: black;
        }
      }
      li:hover {
        background: #324057;
      }
      .active {
        background: #324057;
      }
    }
    .select-tagged-menu {
      position: relative;
    }
    .selectedInform {
      font-size: xx-small;
    }
    #image_canvas {
      position: absolute;
      top: 30px;
      left: 0;
      z-index: 1;
    }
    #region_canvas {
      position: absolute;
      top: 30px;
      left: 0;
      z-index: 2;
    }
  }
</style>