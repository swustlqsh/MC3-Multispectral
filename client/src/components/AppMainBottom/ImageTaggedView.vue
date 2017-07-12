<template>
  <div class="uk-grid image-tagged-view-main">
    <div class="uk-width-1-1 image-tagged-menu" id="image_menu">
      <ul class="uk-list">
        <li :class="{'active': index == selectedId}" v-for="(index, menu) in imageMenu"
            v-on:click.stop.prevent="getMenuMsg(menu.index)">
          <a href="#"><i class="uk-icon-justify {{menu.icon}}"></i></a>
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
    <template v-if="selectIndex==-1">
      <div class="error-msg">No selected feature</div>
    </template>
    <template v-else>
      <table class="uk-table uk-table-hover uk-table-condensed">
        <thead>
        <tr>
          <th v-for="head in tableHeader">
            <input type="text" placeholder="head.name" class="uk-form-width-small" v-model="head.name" disabled>
          </th>
          <!--<th><input type="text" placeholder="Add New" class="uk-form-width-small" @keyup.enter="addNewFeature" v-model="featureName"></th>-->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td v-for="(i, attr) in selectRegionTableBody">
            <input v-if="!i" type="text" placeholder="{{ attr.value | json}}" class="uk-form-width-small" disabled>
            <select v-else v-model="attr.value" @change="chooseRegionType(attr.value)">
              <option v-for="opt in featuresObj">{{ opt }}</option>
            </select>
          </td>
          <!--<input v-else type="text" placeholder="{{attr.value | json}}" class="uk-form-width-small" v-model="attr.value">-->
        </tr>
        <!--<tr v-for="tbody in tableBody">-->
        <!--<td v-for="(i, attr) in tbody">-->
        <!--<input v-if="!i" type="text" placeholder="{{ attr.value | json}}" class="uk-form-width-small" disabled>-->
        <!--<select v-else v-model="attr.value">-->
        <!--<option v-for="opt in featuresObj">{{ opt }}</option>-->
        <!--</select>-->
        <!--&lt;!&ndash;<input v-else type="text" placeholder="{{attr.value | json}}" class="uk-form-width-small" v-model="attr.value">&ndash;&gt;-->
        <!--</td>-->
        <!--</tr>-->
        </tbody>
      </table>
      <button class="uk-button uk-width-1-1 uk-margin-small-bottom" @click.stop.prevent="goSubmit">Submit</button>
    </template>
  </div>
  <div class="image-time">{{imageTime}}</div>
</template>
<script>
  import $ from 'jquery'
  import Promise from 'bluebird'
  import EG from 'ENGINES'
  import {pageSize, selectedImage} from '../../vuex/getters'
  import {createSelection, addFeatures, exportArea, activeRegionSelectionImages} from '../../vuex/actions'
  import config from '../../commons/config'
  import {getBoundaryToArray, getBoundary} from '../../commons/utils'
  import VirtulDomOpt from './VirtualDomOpt'
  export default {
    vuex: {
      getters: { pageSize, selectedImage },
      actions: {
        addFeatures, exportArea, createSelection, activeRegionSelectionImages
      }
    },
    data () {
      return {
        isShowSelect: true,
        selectedTime: '', // 选择的时间 2014 2015 2016
        selectedChannels: '', // 单个通道 或者 有意义的组合
        $$renderIns: null,
        selectedId: 0,
        imageIndex: 0,
        imageName: null,
        willShow: false,
        featureIndex: 0,
        imageMenu: [
          { name: '选择', icon: 'uk-icon-mouse-pointer', index: 0, image: '../../../assets/images/选择.png' },
          { name: '放大', icon: 'uk-icon-search-plus', index: 1, image: '../../../assets/images/放大.png' },
          { name: '缩小', icon: 'uk-icon-search-minus', index: 2, image: '../../../assets/images/缩小.png' },
          { name: '平移', icon: 'uk-icon-arrows', index: 3, image: '../../../assets/images/移动.png' },
          { name: '套索', icon: 'uk-icon-object-ungroup', index: 4, image: '../../../assets/images/套索.png' },
          { name: '标记', icon: 'uk-icon-text-height', index: 5, image: '../../../assets/images/文字.png' }
        ],
        tableHeader: [ { name: '#' }, { name: 'Type' } ],
        tableBody: [],
        $regions: {},
        tableIndex: [],
        featuresObj: Object.keys(config.defaultFeaturesObj),
        featureName: 'Add New',
        imageTime: '',
        selectRegionTableBody: [], // 当前选中的region 开始从meta data中获取
        $selectRegionsObs: {}, // 不执行vue绑定操作
        selectIndex: -1
      }
    },
    watch: {
      pageSize: {
        handler (curVal, oldVal) {
          if (!this.$renderIns) {
            this.init()
            this.$renderIns.init({
              image_canvas_id: 'image_canvas',
              region_canvas_id: 'region_canvas',
              image_real_width: Math.round($('#image-tagged').width()),
              image_real_height: Math.round($('#image-tagged').height())
            })
            this.$renderIns.addEventListenerMouseup()
            this.$renderIns.addEventListenerMousedown()
            this.$renderIns.addEventListenerMousemove()
            this.$renderIns.addEventListenerMouseover()
          } else {
            this.$renderIns.updateDivContainer({
              image_real_width: Math.round($('#image-tagged').width()),
              image_real_height: Math.round($('#image-tagged').height())
            })
            this.$renderIns.goUpdate()
          }
        },
        deep: true
      },
      selectedImage: {
        handler (curVal, oldVal) { // object
          //  接收到select image然后可以更新图片 更新option
          let channels = this.selectedImage.split('_')[ 0 ]
          if (channels.length > 5) {
            this.featuresObj = Object.keys(config.featureColors[ channels ])
          }
          window.currentSelectionChannel = channels
          if ((typeof (this.selectedImage) !== 'undefined') && (this.selectedImage != null)) {
            this.imageTime = this.selectedImage.split('_').slice(1).join('_')
            let path = '../../../data/' + this.selectedImage.split('_')[ 0 ] + '/' + this.selectedImage + '.png'
            if (this.$renderIns) {
              let imgIndex = this.$renderIns.loadStoreLocalImg(path, this.selectedImage)
              console.log('imgIndex', imgIndex)
              console.log('this._via_img_metadata', this.$renderIns._via_img_metadata[this.selectedImage])
              this.imageIndex = imgIndex
              this.$renderIns.showImage(this.imageIndex)
              this.imageName = this.selectedImage
              // this.imageIndex = this.imageIndex + 1
//              this.$renderIns.updateDivContainer({
//                image_real_width: Math.round($('#image-tagged').width()),
//                image_real_height: Math.round($('#image-tagged').height())
//              })
//              this.$renderIns.goUpdate()
            }
          } else {
            //  清空所选择的图片
          }
        },
        deep: true
      }
    },
    computed: {
      isShowTable () {
        return Object.keys(this.$regions).length === 0 || Object.keys(this.$regions.regions).length === 0
      },
      isShowSelectTable () {
        console.log('this.$renderIns._via_user_sel_region_id', this.$renderIns._via_user_sel_region_id)
        return this.$renderIns._via_user_sel_region_id === -1
      }
    },
    methods: {
      chooseRegionType (attr) {
        let newAttr = JSON.parse(JSON.stringify(attr))
        let channels = this.selectedImage.split('_')[ 0 ]
        let info = { 'type': newAttr, 'color': config.featureColors[channels][newAttr] }
        if (this.selectRegionTableBody.length !== 0) {
          // this.$selectRegionsObs[ this.selectRegionTableBody[ 0 ].value - 1 ] = JSON.parse(JSON.stringify(this.selectRegionTableBody))
          this.$renderIns.updateCurrentSelectRegion(info)
          // 传递lasso区域，只支持一个区域
          let selectId = this.selectIndex
          this.$regions = JSON.parse(this.$renderIns.getMetaData(selectId))
          this.exportArea([ this.$regions.regions[ selectId ].shape_attributes.all_points_x, this.$regions.regions[ selectId ].shape_attributes.all_points_y ])
        }
      },
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
          this.selectIndex = this.$renderIns._via_user_sel_region_id
          this.willShow = true
          // 确保当前有选中的节点
          if (this.selectIndex !== -1) {
            this.selectRegionTableBody = []
            this.selectRegionTableBody.push({ value: this.selectIndex + 1 })
            this.selectRegionTableBody.push({ value: this.$renderIns.getSelectRegionValue() })
          }
        }
        if (this.selectedId === 1) {
          this.$renderIns && this.$renderIns.zoom_in()
          return
        }
        if (this.selectedId === 2) {
          this.$renderIns && this.$renderIns.zoom_out()
        }
      },
      loadStart () {
      },
      init () {
        this.$renderIns = new EG.renders.GraphTag({ selector: this.$els.graph })
      },
      closeTag () {
        this.willShow = false
        this.selectedId = 0
      },
      goSubmit () {
        this.selectedId = 0
        this.willShow = false
        let selectId = this.selectIndex
        this.$regions = JSON.parse(this.$renderIns.getMetaData(selectId))
        console.log('this.$regions', this.$regions)
        // 传递lasso区域，只支持一个区域
        // this.exportArea([ this.$regions.regions[ selectId ].shape_attributes.all_points_x, this.$regions.regions[ selectId ].shape_attributes.all_points_y ])
        this.createSelection(this.selectedImage, this.$regions)
        // this.featureIndex = this.featureIndex + 1
        this.addFeatures({ featureName: selectId, imageName: this.imageName })
        this.getSelectedRegionImagesURL()
      },
      addNewFeature () {
        this.tableHeader.push({ name: this.featureName })
        for (let i = 0; i < this.tableBody.length; i++) {
          this.tableBody[ i ].push({ value: '' })
        }
        this.featureName = 'Add New'
      },
      getSelectedRegionImagesURL () {
        let selectId = this.selectRegionTableBody[ 0 ].value - 1
        if (selectId < 0) {
          return
        }
        // 获取特定组合下12张图片路径
        let date = config.date
        let selectedImageSplit = this.selectedImage.split('_')
        let basePath = config.baseDataPath + selectedImageSplit[ 0 ] + '/'
        let imagePaths = date.map(function (d) {
          return basePath + selectedImageSplit[ 0 ] + '_' + d + '.png'
        })

        let area = getBoundaryToArray(this.$regions.regions[ selectId ].shape_attributes.all_points_x, this.$regions.regions[ selectId ].shape_attributes.all_points_y)

        // let color = config.defaultFeaturesObj[this.selectRegionTableBody[1].value]
        let color = '#D6E2D7'
        let requests = []
        imagePaths.forEach(function (d) {
          let virtual = new VirtulDomOpt()
          virtual.init({ bbox: getBoundary(area) })
          virtual.getAllCanvas()
          virtual.setColor(color)
          requests.push(virtual.updateSourceImageAndCutImage(d, area))
        })
        let selectedRegions = {}
        selectedRegions[ selectId ] = {}
        let urls = {}
        Promise.all(requests).then(function (res) {
          res.forEach(function (d, i) {
            let img = selectedImageSplit[ 0 ] + '_' + date[ i ]
            urls[ img ] = d
          })
          selectedRegions[ selectId ] = urls
          this.activeRegionSelectionImages(this.selectedImage, selectedRegions)
        }.bind(this))
      }
    },
    ready () {
      this.$selectRegionsObs = {}
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
    .error-msg {
      text-align: center;
      width: 100%;
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
    font-size: 12px;
  }

</style>