<template>
  <div class="uk-grid image-tagged-view-main">
    <div class="uk-width-1-1 image-tagged-menu" id="image_menu">
      <ul class="uk-list">
        <li :class="{'active': index == selectedId}" v-for="(index, menu) in imageMenu"
            v-on:click.stop.prevent="getMenuMsg(menu.index)">
          <a href="#" ><i class="uk-icon-justify {{menu.icon}}"></i></a>
        </li>
      </ul>
    </div>
    <div class="uk-thumbnail uk-thumbnail-expand del-padding" v-el:graph>
      <canvas id="image_canvas"></canvas>
      <canvas id="region_canvas"></canvas>
    </div>
  </div>
  <div id="attributes-panel" v-if="willShow">
    <div class="uk-animation-slide-bottom close" @click="closeTag()"><i class="uk-icon-justify uk-icon-close"></i></div>
    <template v-if="isShowTable">
      <div class="error-msg">No selected feature</div>
    </template>
    <template v-else>
      <table class="uk-table uk-table-hover uk-table-condensed">
      <thead>
      <tr>
        <th v-for="head in tableHeader">
          <input type="text" placeholder="head.name" class="uk-form-width-small"  v-model="head.name" disabled>
        </th>
       <!--<th><input type="text" placeholder="Add New" class="uk-form-width-small" @keyup.enter="addNewFeature" v-model="featureName"></th>-->
      </tr>
      </thead>
      <tbody>
      <tr v-for="tbody in tableBody">
        <td v-for="(i, attr) in tbody">
          <input v-if="!i" type="text" placeholder="{{ attr.value | json}}" class="uk-form-width-small" disabled>
          <select v-else v-model="attr.value">
               <option v-for="opt in featuresObj">{{ opt }}</option>
          </select>
          <!--<input v-else type="text" placeholder="{{attr.value | json}}" class="uk-form-width-small" v-model="attr.value">-->
        </td>
      </tr>
      </tbody>
    </table>
    </template>
    <button class="uk-button uk-width-1-1 uk-margin-small-bottom" @click.stop.prevent="goSubmit">Submit</button>
  </div>
  <div class="image-time">{{imageTime}}</div>
</template>
<script>
  import $ from 'jquery'
  import EG from 'ENGINES'
  import {pageSize, selectedImage} from '../../vuex/getters'
  import {createSelection, addFeatures, exportArea} from '../../vuex/actions'
  import config from '../../commons/config'
  export default {
    vuex: {
      getters: {pageSize, selectedImage},
      actions: {
        addFeatures, exportArea, createSelection
      }
    },
    data () {
      return {
        isShowSelect: true,
        selectedTime: '', // 选择的时间 2014 2015 2016
        selectedChannels: '', // 单个通道 或者 有意义的组合
        renderIns: null,
        selectedId: 0,
        willShow: false,
        imageMenu: [
          { name: '选择', icon: 'uk-icon-mouse-pointer', index: 0, image: '../../../assets/images/选择.png' },
          { name: '放大', icon: 'uk-icon-search-plus', index: 1, image: '../../../assets/images/放大.png' },
          { name: '缩小', icon: 'uk-icon-search-minus', index: 2, image: '../../../assets/images/缩小.png' },
          { name: '平移', icon: 'uk-icon-arrows', index: 3, image: '../../../assets/images/移动.png' },
          { name: '套索', icon: 'uk-icon-object-ungroup', index: 4, image: '../../../assets/images/套索.png' },
          { name: '标记', icon: 'uk-icon-text-height', index: 5, image: '../../../assets/images/文字.png' }
        ],
        tableHeader: [{name: '#'}, {name: 'Type'}],
        tableBody: [],
        $regions: {},
        tableIndex: [],
        featureName: 'Add New',
        featuresObj: Object.keys(config.defaultFeaturesObj),
        imageTime: ''
      }
    },
    watch: {
      pageSize: {
        handler (curVal, oldVal) {
//          this.init()
//          this.renderIns.init({
//            image_canvas_id: 'image_canvas',
//            region_canvas_id: 'region_canvas',
//            image_real_width: Math.round($('#image-tagged').width()),
//            image_real_height: Math.round($('#image-tagged').height())
//          })
//          this.renderIns.setShowImage('../../../resource/3B/B1B5B6_2014_03_17.png')
//          this.renderIns.on('dblclick', this.clickEvent)
//          this.renderIns.regionBindAllEvent()

          if (!this.renderIns) {
            this.init()
            this.renderIns.init({
              image_canvas_id: 'image_canvas',
              region_canvas_id: 'region_canvas',
              image_real_width: Math.round($('#image-tagged').width()),
              image_real_height: Math.round($('#image-tagged').height())
            })
//            this.renderIns.loadStoreLocalImg('../../../data/B1B5B6/B1B5B6_2014_03_17.png', 'B1B5B6_2014_03_17')
//            this.renderIns.showImage(0)
//            this.renderIns.addEventListenerClick() // default
            this.renderIns.addEventListenerMouseup()
            this.renderIns.addEventListenerMousedown()
            this.renderIns.addEventListenerMousemove()
            this.renderIns.addEventListenerMouseover()
          } else {
            this.renderIns.updateDivContainer({
              image_real_width: Math.round($('#image-tagged').width()),
              image_real_height: Math.round($('#image-tagged').height())})
            this.renderIns.goUpdate()
          }
        },
        deep: true
      },
      selectedImage: {
        handler (curVal, oldVal) { // object
          //  接收到select image然后可以更新图片
          console.log('selectedImage', this.selectedImage)
          this.imageTime = this.selectedImage.split('_').slice(1).join('_')
          let path = '../../../data/' + this.selectedImage.split('_')[0] + '/' + this.selectedImage + '.png'
          if (this.renderIns) {
            this.renderIns.loadStoreLocalImg(path, this.selectedImage)
            this.renderIns.showImage(0)
          }
        },
        deep: true
      }
    },
    computed: {
      isShowTable () {
        return Object.keys(this.$regions).length === 0 || Object.keys(this.$regions.regions).length === 0
      }
    },
    methods: {
      getMenuMsg (index) {
        if (this.selectedId === index) {
          return
        }

        this.selectedId = index
        if (this.selectedId === 0) {
          return
        }
        if (this.selectedId === 4) {
          return
        }
        if (this.selectedId === 5) {
          this.willShow = true
//          this.tableHeader = [{name: '#'}]
          this.tableBody = []
          this.$regions = JSON.parse(this.renderIns.getMetaData())
          console.log('this.$regions', this.$regions)
          if (!this.isShowTable) {
            let regionAttributes = this.$regions.regions
            let features = Object.keys(regionAttributes)
            for (let i = 0; i < features.length; i++) {
              let tbody = []
              tbody.push({value: i})
              tbody.push({value: ''})
              let attributes = features[i].region_attributes
              for (let attr in attributes) {
                tbody.push({value: attributes[attr]})
              }
              this.tableBody.push(tbody)
//              if (i === 0) {
//                attributes && Object.keys(attributes).forEach(function (d) {
//                  this.tableHeader.push({name: d})
//                }.bind(this))
//              }
            }
          }
          console.log('tableBody', this.tableBody)
          return
        }
        if (this.selectedId === 1) {
          this.renderIns && this.renderIns.zoom_in()
          return
        }
        if (this.selectedId === 2) {
          this.renderIns && this.renderIns.zoom_out()
          return
        }
      },
      // loadStart 读取相关的事件
      loadStart () {
      },
      init () {
        this.renderIns = new EG.renders.GraphTag({ selector: this.$els.graph })
      },
      closeTag (e) {
        this.willShow = false
      },
      goSubmit () {
        this.selectedId = 0
        let regionAttributes = {}
        let bodyNum = this.tableBody.length
        for (let j = 0; j < bodyNum; j++) {
          regionAttributes[j] = {}
          let tempBox = {}
          for (let i = 1; i < this.tableHeader.length; i++) {
            tempBox[this.tableHeader[i].name] = this.tableBody[j][i].value
          }
          regionAttributes[j] = tempBox
        }

        this.willShow = false
        for (let key in regionAttributes) {
          let typs = regionAttributes[key]
          this.$regions.regions[key].region_attributes = typs
        }
        // 传递lasso区域，只支持一个区域
        this.exportArea([ this.$regions.regions[ 0 ].shape_attributes.all_points_x, this.$regions.regions[ 0 ].shape_attributes.all_points_y ])
        this.createSelection('B1B5B6_2014_03_17', this.$regions)
        this.renderIns.resetMetaData()
        this.addFeatures('features')
        console.log('click submit')
      },
      addNewFeature () {
        console.log(this.featureName)
        this.tableHeader.push({name: this.featureName})
        for (let i = 0; i < this.tableBody.length; i++) {
          this.tableBody[i].push({value: ''})
        }
        console.log(this.tableBody)
        this.featureName = 'Add New'
      }
    },
    ready () {
//      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .image-tagged-view-main {
    border: 1px solid gray;
    box-sizing: border-box;
    padding: 0 8px;
    .image-tagged-menu {
      height: 30px;
      margin: 0 auto;
      line-height: 30px;
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
      left: 0;
      z-index: 1;
    }
    #region_canvas {
      position: absolute;
      left: 0;
      z-index: 2;
    }
    .del-padding {
      padding: 0;
    }
  }
  #attributes-panel {
    position: absolute;
    z-index: 10;
    width: 100%;
    max-height: 30%;
    overflow: auto;
    background-color: #fff;
    border: 1px solid #324057;
    padding: 0;
    padding-bottom: 2em;
    font-size: small;
    left: 100%;
    .error-msf {
      text-align: center;
      margin: 0 auto;
    }
    .close {
      display: block;
      height: 30px;
      width: 100%;
      position: relative;
      padding: 0;
      margin: 0;
    }
  }
  .image-time {
    position: absolute;
    width: 100%;
    top: 96%;
    text-align: center;
  }

</style>