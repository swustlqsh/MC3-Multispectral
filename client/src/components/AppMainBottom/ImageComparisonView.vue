<template>
  <div id='imageCompare' style='padding-left: 0; padding-right: 0; padding-top: 0'>
    <div class="uk-grid image-tagged-view-main">
      <div id="graph1" class="uk-thumbnail uk-thumbnail-expand del-padding" v-el:graph1>
        <canvas id="image_canvas1" class="image_canvas"></canvas>
        <canvas id="region_canvas1" class="region_canvas"></canvas>
      </div>
    </div>
    <div class="uk-grid image-tagged-view-main">
      <div id="graph2" class="uk-thumbnail uk-thumbnail-expand del-padding" v-el:graph2>
        <canvas id="image_canvas2" class="image_canvas"></canvas>
        <canvas id="region_canvas2" class="region_canvas"></canvas>
      </div>
    </div>
    <!--<div v-el:graph1 id="graph1" v-el:graph1>-->
      <!--&lt;!&ndash;<img class="uk-thumbnail" src="../../../resource/3B/B1B5B6_2014_03_17.png" alt="">&ndash;&gt;-->
      <!--<canvas id="image_canvas1" class="image_canvas"></canvas>-->
      <!--<canvas id="region_canvas1" class="region_canvas"></canvas>-->
    <!--</div>-->
    <!--<div v-el:graph2 id="graph2" v-el:graph2>-->
      <!--&lt;!&ndash;<img class="uk-thumbnail" src="../../../resource/3B/B1B5B6_2014_03_17.png" alt="">&ndash;&gt;-->
      <!--<canvas id="image_canvas2" class="image_canvas"></canvas>-->
      <!--<canvas id="region_canvas2" class="region_canvas"></canvas>-->
    <!--</div>-->
  </div>
  <div id='statistics'>
    <div id='tagChannel'></div>
    <div id='submmit'>
      <div>
        Type
        <select id='eventSelect'>
          <option value="Flood" class="option-text">Flood</option>
          <option value="Burnt" class="option-text">Burnt</option>
          <option value="Shrink" class="option-text">Shrink</option>
          <option value="Expand" class="option-text">Expand</option>
        </select>
      </div>
      <div style="margin-top: 10px">
        Description
      </div>
      <div style="height: 50%">
        <textarea id='commentsText' name='textarea'></textarea>
      </div>
      <div style="text-align: center;" id="submitButton">
        <button type="button" id="sbutton"> Submit</button>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize, comparedMessage, addedFeatures, activeRegionByIds, allRegions} from '../../vuex/getters'
  import {eventSubmit, activeRegionSelectionIds} from '../../vuex/actions'
  import config from '../../commons/config'
  import DATA from '../../../data/index'
  import EG from 'ENGINES'
  import _ from 'lodash'
  export default {
    vuex: {
      actions: {
        eventSubmit, activeRegionSelectionIds
      },
      getters: { pageSize, comparedMessage, addedFeatures, activeRegionByIds, allRegions }
    },
    data () {
      return {
        divName: 'image-comparison',
        load: false,
        currentChannel: 'B1',
        channelTagNum: {
          'B3B2B1': 0,
          'B5B4B2': 0,
          'B4B3B2': 0,
          'B1B5B6': 0,
          'NDVI': 0,
          'B1': 0,
          'B2': 0,
          'B3': 0,
          'B4': 0,
          'B5': 0,
          'B6': 0
        },
        $graph1: null,
        $graph2: null
      }
    },
    watch: {
      pageSize: {
        handler (curVal, oldVal) {
          if (!this.load) {
            this.init()
          }
          this.pageSizeForGrape()
          this.load = true
        },
        deep: true
      },
      comparedMessage: {
        handler (curVal, oldVal) {
          this.loadComparisonImages()
        },
        deep: true
      },
      addedFeatures: {
        handler (curVal, oldVal) {
          let imageName = this.addedFeatures.imageName
          this.updatePanel(imageName.split('_')[0])
        },
        deep: true
      }
    },
    methods: {
      initGraphAll () {
        this.$graph1 = new EG.renders.GraphTag({ selector: this.$els.graph1 })
        this.$graph2 = new EG.renders.GraphTag({ selector: this.$els.graph2 })
      },
      pageSizeForGrape () {
        this.$graph1.init({
          image_canvas_id: 'image_canvas1',
          region_canvas_id: 'region_canvas1',
          image_real_width: Math.round($('#graph1').width()),
          image_real_height: Math.round($('#graph1').height())
        })
        this.$graph2.init({
          image_canvas_id: 'image_canvas2',
          region_canvas_id: 'region_canvas2',
          image_real_width: Math.round($('#graph2').width()),
          image_real_height: Math.round($('#graph2').height())
        })
      },
      init () {
        let self = this
        $('#sbutton').click(function () {
          self.localEventSubmit()
        })
        this.drawTagPannel()
      },
      drawTagPannel () {
        let d3 = window.d3
        let channelTagNum = this.channelTagNum
        let channels = Object.keys(channelTagNum)
        let width = $('#tagChannel').width()
        let height = $('#tagChannel').height()
        let padding = { left: 2, right: 20, top: 2, bottom: 15 }
        let svg = d3.select('#tagChannel').append('svg').attr('width', width).attr('height', height)
        this.channelSvg = svg
        let divH = (height - padding.top - padding.bottom) / channels.length
        let marginH = divH * 0.1
        let textWidth = config.emSize * 6
        let cellWidth = (width - textWidth) / 20
        let g = svg.selectAll('g')
          .data(channels)
          .enter()
          .append('g')
          .attr('transform', function (d, i) {
            return 'translate(' + padding.left + ',' + (padding.top + i * divH) + ')'
          })
          .attr('id', function (d, i) {
            return 'g' + d
          })
        g.append('rect')
          .attr('x', textWidth)
          .attr('y', 0)
          .attr('height', divH - marginH)
          .attr('width', function (d, i) {
            return channelTagNum[ d ] * cellWidth
          })
          .style('fill', 'grey')
          .attr('id', function (d) {
            return 'rect' + d
          })
        g.append('text')
          .attr('x', textWidth - 2)
          .attr('y', (divH - marginH) / 2 + 5)
          .text(function (d) {
            return d
          })
          .attr('font-size', config.emSize)
          .attr('text-anchor', 'end')
        g.append('text')
          .attr('x', function (d, i) {
            return channelTagNum[ d ] * cellWidth + textWidth + 2
          })
          .attr('y', (divH - marginH) / 2 + 5)
          .text(function (d) {
            return channelTagNum[ d ]
          })
          .attr('id', function (d) {
            return 'text' + d
          })
          .attr('font-size', config.emSize)
        this.cellWidth = cellWidth
        this.textWidth = textWidth
        this.channelTagNum = channelTagNum
      },
      updatePanel (channel) {
        let textWidth = this.textWidth
        let cellWidth = this.cellWidth
        let channelTagNum = this.channelTagNum
        channelTagNum[ channel ] += 1
        $('#rect' + channel)
          .attr('width', channelTagNum[ channel ] * cellWidth)
        $('#text' + channel)
          .attr('x', channelTagNum[ channel ] * cellWidth + textWidth + 2)
          .text(channelTagNum[ channel ])
      },
      getSelectedFeatureById (imgId, ids) {
        let imageMeta = this.allRegions[imgId]
        let newRegions = {}
        let newMeta = {}
        let regions = imageMeta.regions
        newMeta = _.cloneDeep(imageMeta)
        if (Array.isArray(ids)) {
          ids.forEach((id) => {
            if (regions.hasOwnProperty(id)) {
              newRegions[id] = regions[id]
            }
          })
          newMeta.regions = newRegions
        } else {
          if (regions.hasOwnProperty(ids)) {
            newRegions[ids] = regions[ids]
          }
          newMeta.regions = newRegions
        }
        let resMeta = {}
        resMeta[imgId] = newMeta
        return resMeta
      },
      loadComparisonImages () {
        let width = $('#graph1').width()
        let height = $('#graph1').height()
        let emSize = config.emSize
        let padding = { left: 10, right: 10, top: 2, bottom: emSize }
        let size = width - padding.left - padding.right
        let toTop = padding.top + size + 10
        let lineToTop = toTop - 5
        console.log(lineToTop)
//        $('#graph1').empty()
//        $('#graph2').empty()
//        let svg1 = d3.select('#graph1').append('svg').attr('width', width).attr('height', height)
//        let svg2 = d3.select('#graph2').append('svg').attr('width', width).attr('height', height)
        let time = '2014_03_17, 2014_08_24, 2014_11_28, 2014_12_30, 2015_02_15, 2015_06_24, 2015_09_12, 2015_11_15, 2016_03_06, ' +
          '2016_06_26, 2016_09_06, 2016_12_19'
        time = time.split(',')
        time = time.map(function (d, i) {
          return d.trim()
        })
        console.log('comparedMessage', this.comparedMessage)
        this.currentCmpChannel = this.comparedMessage.img1.imgName.split('_')[0]
        this.currentChannel = this.comparedMessage.img1.feature.name
        this.time = time
        let belongedLineWidth = height / 200
        console.log(belongedLineWidth)
        if (this.comparedMessage.type === 'originalImgs') {
          if (this.comparedMessage.img2 === null) {
            let comparedMessage = $.extend(true, {}, this.comparedMessage)
            this.localComparedMessage = comparedMessage
            let cxt = document.getElementById('image_canvas2').getContext('2d')
            cxt.clearRect(0, 0, width, height)
            cxt = document.getElementById('region_canvas2').getContext('2d')
            cxt.clearRect(0, 0, width, height)
            let img1Name = comparedMessage.img1.imgName
            let channel1Image = img1Name.split('_')[0]
            // load first image
            if (img1Name !== null) {
              // let prefix = img1Name.split('_')[ 0 ]
              // let path = '../../../data/' + prefix + '/' + img1Name + '.png'
              let imgIndex = this.$graph1.loadCompareLocalImg(DATA[img1Name], channel1Image)
              // this.activeRegionSelectionIds(img1Name, [this.currentChannel.substr(7) - 1]) // ['0'] feature 编号b
              let activeRegionByIds = this.getSelectedFeatureById(channel1Image, [this.currentChannel.substr(7) - 1])
              this.$graph1.importAnnotationsFromJson(activeRegionByIds)
              this.$graph1.showImage(imgIndex)
//              let g = svg1.append('g')
//              let arr1 = this.comparedMessage.img1.imgName.split('_')
//              let date1 = arr1[ 1 ] + '_' + arr1[ 2 ] + '_' + arr1[ 3 ]
//              g.append('image')
//                .attr('xlink:href', path)
//                .attr('width', size)
//                .attr('height', size)
//                .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
//              svg1.append('text')
//                .attr('y', toTop)
//                .attr('x', width / 2)
//                .attr('alignment-baseline', 'hanging')
//                .attr('text-anchor', 'middle')
//                .text(date1)
//                .attr('font-size', emSize)
//              svg1.append('line')
//                .attr('y1', lineToTop)
//                .attr('x1', padding.left)
//                .attr('x2', width - padding.right)
//                .attr('y2', lineToTop)
//                .style('stroke', comparedMessage.img1.color)
//                .style('stroke-width', belongedLineWidth + 'px')
            }
            return
          }
          let arr1 = this.comparedMessage.img1.imgName.split('_')
          let date1 = arr1[ 1 ] + '_' + arr1[ 2 ] + '_' + arr1[ 3 ]
          let arr2 = this.comparedMessage.img2.imgName.split('_')
          let date2 = arr2[ 1 ] + '_' + arr2[ 2 ] + '_' + arr2[ 3 ]
          let index1 = this.time.indexOf(date1)
          let index2 = this.time.indexOf(date2)
          let comparedMessage = $.extend(true, {}, this.comparedMessage)
          if (index1 > index2) {
            let mid = $.extend(true, {}, comparedMessage.img1)
            comparedMessage.img1 = $.extend(true, {}, comparedMessage.img2)
            comparedMessage.img2 = mid
            date1 = this.time[ index2 ]
            date2 = this.time[ index1 ]
          }
          this.localComparedMessage = comparedMessage
          let img1Name = comparedMessage.img1.imgName
          let img2Name = comparedMessage.img2.imgName
          let channel1Image = img1Name.split('_')[0]
          let channel2Image = img2Name.split('_')[0]
          if (img1Name !== null) {
            let currentChanne1 = this.comparedMessage.img1.feature.name
            let imgIndex = this.$graph1.loadCompareLocalImg(DATA[img1Name], channel1Image)
            let activeRegionByIds = this.getSelectedFeatureById(channel1Image, [currentChanne1.substr(7)])
            this.$graph1.importAnnotationsFromJson(activeRegionByIds)
            this.$graph1.showImage(imgIndex)
//            let prefix = img1Name.split('_')[ 0 ]
//            this.currentChannel = prefix
//            let path = '../../../data/' + prefix + '/' + img1Name + '.png'
//            let g = svg1.append('g')
//            g.append('image')
//              .attr('xlink:href', path)
//              .attr('width', size)
//              .attr('height', size)
//              .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
//            svg1.append('text')
//              .attr('y', toTop)
//              .attr('x', width / 2)
//              .text(date1)
//              .attr('alignment-baseline', 'hanging')
//              .attr('text-anchor', 'middle')
//              .attr('font-size', emSize)
//            svg1.append('line')
//              .attr('y1', lineToTop)
//              .attr('x1', padding.left)
//              .attr('x2', width - padding.right)
//              .attr('y2', lineToTop)
//              .style('stroke', comparedMessage.img1.color)
//              .style('stroke-width', belongedLineWidth + 'px')
          }
//          this.renderIns.loadStoreLocalImg('../../../resource/3B/B1B5B6_2014_03_17.png', 'B1B5B6_2014_03_17')
          if (img2Name !== null) {
            let currentChanne2 = this.comparedMessage.img2.feature.name
            let imgIndex = this.$graph2.loadCompareLocalImg(DATA[img2Name], channel2Image)

            let activeRegionByIds = this.getSelectedFeatureById(channel2Image, [currentChanne2.substr(7)])
            this.$graph2.importAnnotationsFromJson(activeRegionByIds)
            this.$graph2.showImage(imgIndex)
//            let prefix = img2Name.split('_')[ 0 ]
//            let path = '../../../data/' + prefix + '/' + img2Name + '.png'
//            let g = svg2.append('g')
//            g.append('image')
//              .attr('xlink:href', path)
//              .attr('width', size)
//              .attr('height', size)
//              .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
//            svg2.append('text')
//              .attr('y', toTop)
//              .attr('x', width / 2)
//              .attr('alignment-baseline', 'hanging')
//              .attr('text-anchor', 'middle')
//              .text(date2)
//              .attr('font-size', emSize)
//            svg2.append('line')
//              .attr('y1', lineToTop)
//              .attr('x1', padding.left)
//              .attr('x2', width - padding.right)
//              .attr('y2', lineToTop)
//              .style('stroke', comparedMessage.img2.color)
//              .style('stroke-width', belongedLineWidth + 'px')
          }
        }
      },
      localEventSubmit () {
        let comparedMessage = this.localComparedMessage
        let arr1 = comparedMessage.img1.imgName.split('_')
        let startChannel = arr1[ 0 ]
        let startFeature = comparedMessage.img1.feature.name
        let startT = arr1[ 1 ] + '_' + arr1[ 2 ] + '_' + arr1[ 3 ]
        let arr2 = comparedMessage.img2.imgName.split('_')
        let endT = arr2[ 1 ] + '_' + arr2[ 2 ] + '_' + arr2[ 3 ]
        let endChannel = arr2[ 0 ]
        let endFeature = comparedMessage.img2.feature.name
        let event = {}
        event.comments = $('#commentsText').val()
        event.type = $('#eventSelect').val()
        event.start = { 'time': startT, 'channel': startChannel, 'feature': startFeature }
        event.end = { 'time': endT, 'channel': endChannel, 'feature': endFeature }
        event.channel = this.currentCmpChannel
        this.eventSubmit(event)
      }
    },
    ready () {
      this.initGraphAll()
      if (process.SkyEye.ENV !== 'dev') {
        for (let key in DATA) {
          DATA[key] = config.prefix + DATA[key]
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .image-tagged-view-main {
    box-sizing: border-box;
    margin: 0;
    #image_canvas1 {
      position: absolute;
      left: 0;
      z-index: 1;
    }
    #region_canvas1 {
      position: absolute;
      left: 0;
      z-index: 2;
    }
    #image_canvas2 {
      position: absolute;
      left: 0;
      z-index: 1;
    }
    #region_canvas2 {
      position: absolute;
      left: 0;
      z-index: 2;
    }
    .del-padding {
      padding: 0;
    }
  }
  #imageCompare {
    position: absolute;
    width: 80%;
    height: 100%;
  }
  #statistics {
    position: absolute;
    left: 80%;
    width: 20%;
    height: 100%;
    border: 1px grey;
  }
  .image_canvas {
    position: absolute;
    left: 0;
    padding: 5px;
    z-index: 1;
  }
  .region_canvas {
    position: absolute;
    left: 0;
    padding: 5px;
    z-index: 2;
  }
  #graph1 {
    position: absolute;
    width: 50%;
    height: 100%;
  }
  #graph2 {
    position: absolute;
    left: 50%;
    width: 50%;
    height: 100%;
  }
  #tagChannel {
    width: 100%;
    height: 50%;
  }
  #submmit {
    position: absolute;
    width: 100%;
    height: 50%;
    top: 50%;
    font-size: 1em;
  }
  #submitButton {
    position: absolute;
    bottom: 7%;
    width: 100%;
    /*margin-top: 8%;*/
  }
  textarea {
    width: 95%;
    height: 100%;
  }
  .option-text {
    font-size: 1em;
  }
  textarea input[type=text] {
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    outline: none;
    padding: 3px 0 3px 3px;
    margin: 5px 1px 3px 0;
    border: 1px solid #ddd;
    width: 95%;
  }
  input[type=text]:focus textarea:focus {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    padding: 3px 0 3px 3px;
    margin: 5px 1px 3px 0;
    border: 1px solid rgba(81, 203, 238, 1);
  }

</style>