<template>
  <div class="image-matrix-view" id="image-matrix-div">
  </div>
</template>
<script>
  import ImageRow from '../ImageRow/ImageRow.vue'
  import $ from 'jquery'
  let d3 = require('../../../plugins/d3v3.min.js')
  import {imgCompare, imageToTaggedView} from '../../vuex/actions'
  import {pageSize, event, addedFeatures} from '../../vuex/getters'
  import config from '../../commons/config'
  export default {
    vuex: {
      getters: { pageSize, event, addedFeatures },
      actions: {
        imgCompare,
        imageToTaggedView
      }
    },
    components: {
      ImageRow
    },
    data () {
      return {
        processedImageObjArray: [],
        channelInfoObj: {},
        imageObjArray2: [],
        selectionArray: [],
        selectionFeaturesArray: [],
        selectionImage: null,
        imageMatrixViewHeight: 0,
        imageHeight: 0,
        channelArray: [],
        dateArray: [],
        featureSelectionIndex: 0,
        eventArray: [],
        categoryColor: config.defaultFeaturesObj
      }
    },
    watch: {
      event: {
        handler (curVal, oldVal) { // object
          this.dealWithEvent()
        },
        deep: true
      },
      addedFeatures: {
        handler (curVal, oldVal) { // object
          console.log('addedFeatures', this.addedFeatures)
          this.handleWithFeatures()
        },
        deep: true
      },
      pageSize: {
        handler (curVal, oldVal) {
          this.initSize()
          this.getImageOriginalData()
          this.init()
          this.render()
          this.renderBgRect()
          this.renderOriginalImage()
          this.renderFeaturesControl()
          this.renderFeaturesImage()
          this.renderEvents()
        },
        deep: true
      }
    },
    ready () {
    },
    methods: {
      /**
       *  初始化所有的尺寸大小
       **/
      initSize () {
        let globalWidth = +$('#image-matrix').width() / (79.2 / 100)
        let globalHeight = +this.pageSize.pageHeight / 3 - 15
        let globalYInterval = globalHeight / 11
        let paddingY = globalYInterval * 0.1
        let originalImageWidth = globalYInterval * 0.9
        let globalXInterval = 6.25 / 100 * globalWidth
        let featureImagesInterval = globalXInterval - originalImageWidth
        let featureImageEachInterval = featureImagesInterval / 8
        let featureImageWidth = featureImageEachInterval * 0.9
        let paddingFeatureX = featureImageEachInterval * 0.1
        let imageHeight = originalImageWidth + paddingY
        let paddingX = 4.2 / 100 * globalWidth
        this.globalWidth = globalWidth
        this.padding = paddingY
        this.paddingTop = 0
        this.originalImageWidth = originalImageWidth
        this.featureImageEachInterval = featureImageEachInterval
        this.featureImageWidth = featureImageWidth
        this.paddingFeatureX = paddingFeatureX
        this.imageHeight = imageHeight
        this.globalXInterval = globalXInterval
        this.globalYInterval = globalYInterval
        this.paddingX = paddingX
      },
      /**
       * 在视图中初始化svg
       */
      init () {
        let width = $('#image-matrix-div').width()
        let height = $('#image-matrix-div').height()
        d3.select('#image-matrix-div')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('id', 'image-matrix-svg')
      },
      /**
       *  获取图片数据的对象数组
       *  每一个对象中包括原始的图片的名称(ImageData), 名称是由通道channel和日期组成
       *    - channel_date.png
       *  图片位置(locationX, locationY)
       *  检测得到的特征数组(FeaturesArray)
       *  在这个图片中检测得到的事件数组(EventsArray)
       */
      getImageOriginalData () {
        let padding = this.padding
        let paddingTop = this.paddingTop
        let originalImageWidth = this.originalImageWidth
        let featureImageWidth = this.featureImageWidth
        let imageHeight = this.imageHeight
        let globalXInterval = this.globalXInterval
        let globalYInterval = this.globalYInterval
        let paddingX = this.paddingX
        let paddingFeatureX = this.paddingFeatureX
        let channelArray = [ 'B1B5B6', 'B3B2B1', 'B4B3B2', 'B5B4B2', 'NDVI', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6' ]
        let dateArray = [ '2014_03_17', '2014_08_24', '2014_11_28', '2014_12_30',
          '2015_02_15', '2015_06_24', '2015_09_12', '2015_11_15',
          '2016_03_06', '2016_06_26', '2016_09_06', '2016_12_19' ]
        this.channelArray = channelArray
        this.dateArray = dateArray
        let imageMatrixViewHeight = imageHeight * channelArray.length + paddingTop
        $('#image-matrix-div').height(imageMatrixViewHeight)
        let imageObjArray2 = []
        for (let i = 0; i < channelArray.length; i++) {
          let imageObjArray = []
          let locationY = i * globalYInterval + paddingTop
          let channelName = channelArray[ i ]
          for (let j = 0; j < dateArray.length; j++) {
            let imageObj = {}
            let date = dateArray[ j ]
            let locationX = paddingX + globalXInterval * j
            imageObj = {}
            imageObj.channelName = channelName
            imageObj.date = date
            imageObj.imageName = channelName + '_' + date
            imageObj.imageHeight = imageHeight
            imageObj.originalImageWidth = originalImageWidth
            imageObj.featureImageWidth = featureImageWidth
            imageObj.globalXInterval = globalXInterval
            imageObj.locationX = locationX
            imageObj.locationY = locationY
            imageObj.padding = padding
            imageObj.paddingFeatureX = paddingFeatureX
            imageObj.iIndex = i
            imageObj.jIndex = j
            imageObj.featuresArray = []
            imageObj.displayRange = [ 0, 5 ]
            imageObj.eventsArray = []
            imageObjArray.push(imageObj)
          }
          imageObjArray2.push(imageObjArray)
          this.imageObjArray2 = imageObjArray2
        }
      },
      /**
       * 渲染视图
       */
      render () {
        let originalImageWidth = this.originalImageWidth
        this.imgCompare({
          'type': 'originalImgs', 'img1': {
            'feature': { 'name': 'B1', 'path': [] }, 'imgName': 'B1_2014_08_24'
          }, 'img2': { 'feature': { 'name': 'B1', 'path': [] }, 'imgName': 'B1_2014_03_17' }
        })
        var imageObjArray2 = this.imageObjArray2
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        var imageRowObj = imageMatrixSvg.selectAll('.image-row')
          .data(imageObjArray2)
        imageRowObj.enter()
          .append('g')
          .attr('class', 'image-row')
          .attr('id', function (d, i) {
            return d[ 0 ].channelName
          })
          .attr('transform', function (d, i) {
            return 'translate(' + 0 + ',' + d[ 0 ].locationY + ')'
          })
        imageRowObj.attr('transform', function (d, i) {
          return 'translate(' + 0 + ',' + d[ 0 ].locationY + ')'
        })
        imageRowObj.exit().remove()
        //  增加横向的组件
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          let imageRowObj = imageObjArray2[ iI ]
          let channelName = imageRowObj[ 0 ].channelName
          let imageComponentsObj = d3.select('#image-matrix-svg')
            .select('#' + channelName)
            .selectAll('.image-components')
            .data(imageRowObj)
          imageComponentsObj.enter()
            .append('g')
            .attr('class', 'image-components')
            .attr('id', function (d, i) {
              return d.imageName
            })
            .attr('transform', function (d, i) {
              return 'translate(' + d.locationX + ',' + 0 + ')'
            })
          imageComponentsObj.exit().remove()
          //  在components中增加每个图片的名称标记
          d3.select('#image-matrix-svg')
            .select('#' + channelName)
            .append('text')
            .attr('class', 'channel-name')
            .attr('id', channelName)
            .text(function (d, i) {
              return channelName
            })
            .attr('transform', function (d, i) {
              return 'translate(' + 2 + ',' + (originalImageWidth / 2) + ')'
            })
            .attr('text-anchor', 'start')
            .attr('cursor', 'pointer')
            .attr('dominant-baseline', 'middle')
            .on('mouseover', function (d, i) {
              d3.select(this).classed('mouseover-highlight', true)
            })
            .on('mouseout', function (d, i) {
              d3.select(this).classed('mouseover-highlight', false)
            })
        }
//        var imageName = imageMatrixSvg.selectAll('.image-name')
//          .data(imageObjArray2)
//        imageName.enter()
//          .append('text')
//          .attr('class', 'channel-name')
//          .text(function (d, i) {
//            return d[ 0 ].channelName
//          })
//          .attr('transform', function (d, i) {
//            return 'translate(' + 2 + ',' + (d[ 0 ].locationY + d[ 0 ].imageHeight / 2) + ')'
//          })
//          .attr('text-anchor', 'middle')
//        imageName.text(function (d, i) {
//          return d[ 0 ].channelName
//        })
//        imageName.exit().remove()
      },
      /**
       * 向components的g中增加background rect
       */
      renderBgRect () {
        var self = this
        var imageObjArray2 = this.imageObjArray2
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
            let imageName = imageObjArray2[ iI ][ jI ].imageName
            let originalImageWidth = imageObjArray2[ iI ][ jI ].originalImageWidth
            let globalXInterval = imageObjArray2[ iI ][ jI ].globalXInterval
            imageMatrixSvg.select('.image-components#' + imageName)
              .append('rect')
              .attr('id', imageName)
              .attr('class', 'background-image')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', globalXInterval)
              .attr('height', originalImageWidth)
              .attr('fill', 'white')
              .on('mouseover', function (d, i) {
                let imageNameId = d3.select(this).attr('id')
                self.mouseover_handler(imageNameId)
              })
              .on('mouseout', function (d, i) {
                let imageNameId = d3.select(this).attr('id')
                self.mouseout_handler(imageNameId)
              })
          }
        }
      },
      /**
       *  向每一个components中增加图片
       */
      renderOriginalImage () {
        let self = this
        var imageObjArray2 = this.imageObjArray2
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
            let imageName = imageObjArray2[ iI ][ jI ].imageName
            let channelName = imageObjArray2[ iI ][ jI ].channelName
            let originalImageWidth = imageObjArray2[ iI ][ jI ].originalImageWidth
            imageMatrixSvg.select('#' + imageName)
              .append('rect')
              .attr('class', 'original-image-bg')
              .attr('id', imageName)
              .attr('width', originalImageWidth)
              .attr('height', originalImageWidth)
            imageMatrixSvg.select('#' + imageName)
              .append('svg:image')
              .attr('class', 'original-image')
              .attr('id', imageName)
              .attr('xlink:href', '../../../data/' + channelName + '/' + imageName + '.png')
              .attr('cursor', 'pointer')
              .attr('width', function (d, i) {
                return originalImageWidth
              })
              .attr('height', function (d, i) {
                return originalImageWidth
              })
              .on('mouseover', function (d, i) {
                let imageNameId = d3.select(this).attr('id')
                d3.select(this).classed('mouseover-highlight', true)
                d3.select('.original-image-bg#' + imageName).classed('mouseover-highlight', true)
                self.mouseover_handler(imageNameId)
              })
              .on('mouseout', function (d, i) {
                let imageNameId = d3.select(this).attr('id')
                d3.select(this).classed('mouseover-highlight', false)
                d3.select('.original-image-bg#' + imageName).classed('mouseover-highlight', false)
                self.mouseout_handler(imageNameId)
              })
              .on('click', function (d, i) {
                let imageNameId = d3.select(this).attr('id')
                self.unhighlightChannelText()
                if (d3.select('.original-image-bg#' + imageName).classed('click-highlight')) {
                  d3.select('.original-image-bg#' + imageName).classed('click-highlight', false)
                  imageMatrixSvg.selectAll('.edit-icon').remove()
                } else {
                  d3.select('.original-image-bg#' + imageName).classed('click-highlight', true)
                  self.renderEditIcon(imageName)
                  self.highlightChannelText(imageName)
                }
                self.click_handler(imageNameId)
              })
          }
        }
      },
      highlightChannelText (imageName) {
        let channelName = imageName.split('_')[ 0 ]
        d3.select('#image-matrix-svg')
          .selectAll('.channel-name')
          .classed('selection-unhighlight', true)
        d3.select('#image-matrix-svg')
          .select('.channel-name#' + channelName)
          .classed('selection-unhighlight', false)
        d3.select('#image-matrix-svg')
          .select('.channel-name#' + channelName)
          .classed('selection-highlight', true)
      },
      unhighlightChannelText () {
        d3.select('#image-matrix-svg')
          .selectAll('.selection-highlight')
          .classed('selection-highlight', false)
        d3.select('#image-matrix-svg')
          .selectAll('.channel-name')
          .classed('selection-unhighlight', false)
      },
      /**
       * 在这个位置增加edit图标
       **/
      renderEditIcon (imageName) {
        var self = this
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        imageMatrixSvg.selectAll('.edit-icon').remove()
        imageMatrixSvg.selectAll('.edit-icon-bg').remove()
        let imageRectWidth = +imageMatrixSvg.select('#' + imageName).select('.original-image-bg').attr('width')
        let imageRectHeight = +imageMatrixSvg.select('#' + imageName).select('.original-image-bg').attr('height')
        let imageRectX = +imageMatrixSvg.select('#' + imageName).select('.original-image-bg').attr('x')
        let imageRectY = +imageMatrixSvg.select('#' + imageName).select('.original-image-bg').attr('y')
        let imageTextX = imageRectX + imageRectWidth / 2
        let imageTextY = imageRectY + imageRectHeight / 2
        imageMatrixSvg.select('#' + imageName).append('rect')
          .attr('id', 'edit-icon-bg-' + imageName)
          .attr('class', 'edit-icon-bg')
          .attr('x', imageRectX)
          .attr('y', imageRectY)
          .attr('width', imageRectWidth)
          .attr('height', imageRectHeight)
        imageMatrixSvg.select('#' + imageName).append('text')
          .attr('x', imageTextX)
          .attr('y', imageTextY)
          .attr('class', 'edit-icon')
          .attr('id', 'edit-icon-' + imageName)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-family', 'FontAwesome')
          .attr('cursor', 'pointer')
          .text('\uf040')
          .on('mouseover', function (d, i) {
            let imageNameId = d3.select(this).attr('id').split('-')[ 2 ]
            d3.select('.original-image-bg#' + imageName).classed('mouseover-highlight', false)
            self.mouseout_handler(imageNameId)
          })
          .on('mouseout', function (d, i) {
            let imageNameId = d3.select(this).attr('id').split('-')[ 2 ]
            d3.select('.original-image-bg#' + imageName).classed('mouseover-highlight', false)
            self.mouseout_handler(imageNameId)
          })
          .on('click', function (d, i) {
            d3.select('.original-image-bg#' + imageName).classed('click-highlight', false)
            imageMatrixSvg.selectAll('.edit-icon-bg').remove()
            imageMatrixSvg.selectAll('.edit-icon').remove()
            self.sendSelectImage()
            self.unhighlightChannelText()
          })
          .style('fill', 'black')
      },
      /**
       *  增加控制features的左右按键
       *
       **/
      renderFeaturesControl () {
        var self = this
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        var imageObjArray2 = this.imageObjArray2
        var paddingFeatureX = this.paddingFeatureX
        var featureImageEachInterval = this.featureImageEachInterval
        let featureImageWidth = this.featureImageWidth
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
            let imageName = imageObjArray2[ iI ][ jI ].imageName
            let originalImageWidth = imageObjArray2[ iI ][ jI ].originalImageWidth
            imageMatrixSvg.select('#' + imageName)
              .append('g')
              .attr('class', 'feature-control')
              .attr('id', 'feature-control-' + imageName)
              .attr('transform', 'translate(' + originalImageWidth + ',' + (originalImageWidth - featureImageEachInterval) + ')')
            imageMatrixSvg.select('#feature-control-' + imageName)
              .append('text')
              .attr('x', function (d, i) {
                return paddingFeatureX + featureImageWidth / 2
              })
              .attr('y', function (d, i) {
                return featureImageWidth / 2
              })
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'middle')
              .attr('cursor', 'pointer')
              .attr('id', 'left-' + iI + '-' + jI)
              .attr('class', 'control left-control control-hidden')
              .attr('font-family', 'FontAwesome')
              .text('\uf053')
              .on('click', function (d, i) {
                let imageId = d3.select(this).attr('id')
                let imageIdArray = imageId.split('-')
                let iI = imageIdArray[ 1 ]
                for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
                  self.featureRightClickHandler(iI, jI)
                }
              })
              .on('mouseover', function (d, i) {
                let imageId = d3.select(this).attr('id')
                let imageIdArray = imageId.split('-')
                let iI = imageIdArray[ 1 ]
                let jI = imageIdArray[ 2 ]
                let imageName = imageObjArray2[ iI ][ jI ].imageName
                self.mouseover_handler(imageName)
              })
              .on('mouseout', function (d, i) {
                let imageId = d3.select(this).attr('id')
                let imageIdArray = imageId.split('-')
                let iI = imageIdArray[ 1 ]
                let jI = imageIdArray[ 2 ]
                let imageName = imageObjArray2[ iI ][ jI ].imageName
                self.mouseout_handler(imageName)
              })
            imageMatrixSvg.select('#feature-control-' + imageName)
              .append('text')
              .attr('x', function (d, i) {
                return featureImageEachInterval * 7 + featureImageWidth / 2
              })
              .attr('y', function (d, i) {
                return featureImageWidth / 2
              })
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'middle')
              .attr('cursor', 'pointer')
              .attr('id', 'right-' + iI + '-' + jI)
              .attr('class', 'control right-control control-hidden')
              .attr('font-family', 'FontAwesome')
              .text('\uf054')
              .on('click', function (d, i) {
                let imageId = d3.select(this).attr('id')
                let imageIdArray = imageId.split('-')
                let iI = imageIdArray[ 1 ]
                for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
                  self.featureLeftClickHandler(iI, jI)
                }
              })
              .on('mouseover', function (d, i) {
                let imageId = d3.select(this).attr('id')
                let imageIdArray = imageId.split('-')
                let iI = imageIdArray[ 1 ]
                let jI = imageIdArray[ 2 ]
                let imageName = imageObjArray2[ iI ][ jI ].imageName
                self.mouseover_handler(imageName)
              })
              .on('mouseout', function (d, i) {
                let imageId = d3.select(this).attr('id')
                let imageIdArray = imageId.split('-')
                let iI = imageIdArray[ 1 ]
                let jI = imageIdArray[ 2 ]
                let imageName = imageObjArray2[ iI ][ jI ].imageName
                self.mouseout_handler(imageName)
              })
          }
        }
      },
      /**
       *  点击向左的按键
       **/
      featureLeftClickHandler (iI, jI) {
        var imageObjArray2 = this.imageObjArray2
        let displayRange = imageObjArray2[ iI ][ jI ].displayRange
        if (displayRange[ 0 ] > 0) {
          displayRange[ 0 ] = displayRange[ 0 ] - 1
          displayRange[ 1 ] = displayRange[ 1 ] - 1
        }
        this.render_each_features_image(iI, jI)
        this.render_each_events(iI, jI)
        this.highlight_features_image()
        this.render_each_component_belong_line(iI, jI)
      },
      /**
       *  点击向右的按键
       **/
      featureRightClickHandler (iI, jI) {
        var imageObjArray2 = this.imageObjArray2
        let displayRange = imageObjArray2[ iI ][ jI ].displayRange
        let featuresArray = imageObjArray2[ iI ][ jI ].featuresArray
        if (displayRange[ 1 ] < (featuresArray.length - 1)) {
          displayRange[ 0 ] = displayRange[ 0 ] + 1
          displayRange[ 1 ] = displayRange[ 1 ] + 1
        }
        this.render_each_features_image(iI, jI)
        this.render_each_events(iI, jI)
        this.highlight_features_image()
        this.render_each_component_belong_line(iI, jI)
      },
      /**
       *  向每一个components中增加features图片
       */
      renderFeaturesImage () {
        var imageObjArray2 = this.imageObjArray2
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
            this.render_each_features_image(iI, jI)
          }
        }
      },
      /**
       * 在components中的每一个feature上增加是否属于的下划线
       **/
      renderBelongLine () {
        var imageObjArray2 = this.imageObjArray2
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
            let imageObj = imageObjArray2[ iI ][ jI ]
            let featuresArray = imageObj.featuresArray
            for (let fI = 0; fI < featuresArray.length; fI++) {
              if (featuresArray[ fI ].belongThisImage) {
                let featureName = featuresArray[ fI ].featureName
                this.render_each_feature_belonged_line(iI, jI, featureName)
              }
            }
          }
        }
      },
      /**
       * 在每一个components中渲染属于的下划线
       **/
      render_each_component_belong_line (iI, jI) {
        let imageObjArray2 = this.imageObjArray2
        let imageObj = imageObjArray2[ iI ][ jI ]
        let featuresArray = imageObj.featuresArray
        let imageName = imageObjArray2[ iI ][ jI ].imageName
        d3.select('#' + imageName).selectAll('.belong-line').remove()
        for (let fI = 0; fI < featuresArray.length; fI++) {
          if (featuresArray[ fI ].belongThisImage) {
            let featureName = featuresArray[ fI ].featureName
            this.render_each_feature_belonged_line(iI, jI, featureName)
          }
        }
      },
      /**
       *  渲染在图片上的事件
       **/
      renderEvents () {
        var imageObjArray2 = this.imageObjArray2
        for (let iI = 0; iI < imageObjArray2.length; iI++) {
          for (let jI = 0; jI < imageObjArray2[ iI ].length; jI++) {
            this.render_each_events(iI, jI)
          }
        }
      },
      highlight_features_image () {
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        let selectionFeaturesArray = this.selectionFeaturesArray
        for (let sI = 0; sI < selectionFeaturesArray.length; sI++) {
          let featuresName = selectionFeaturesArray[ sI ]
          let featuresNameArray = featuresName.split('-')
          let imageName = featuresNameArray[ 0 ]
          if (sI === 0) {
            imageMatrixSvg.selectAll('.first-click-selection')
              .classed('first-click-selection', false)
            imageMatrixSvg.select('#feature-image-' + imageName)
              .select('#' + featuresName)
              .classed('first-click-selection', true)
          } else {
            imageMatrixSvg.selectAll('.second-click-selection')
              .classed('second-click-selection', false)
            imageMatrixSvg.select('#feature-image-' + imageName)
              .select('#' + featuresName)
              .classed('second-click-selection', true)
          }
        }
      },
      /**
       * 更新在每一个components中增加事件
       **/
      render_each_events (iI, jI) {
        var self = this
        var imageObjArray2 = this.imageObjArray2
        let featureImageEachInterval = this.featureImageEachInterval
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        let imageName = imageObjArray2[ iI ][ jI ].imageName
        let featuresArray = imageObjArray2[ iI ][ jI ].featuresArray
        var displayRange = imageObjArray2[ iI ][ jI ].displayRange
        let originalImageWidth = imageObjArray2[ iI ][ jI ].originalImageWidth
        let featureImageWidth = imageObjArray2[ iI ][ jI ].featureImageWidth
        let categoryColor = this.categoryColor
        if (imageMatrixSvg
            .select('#' + imageName)
            .select('#feature-events-' + imageName)
            .empty()) {
          imageMatrixSvg.select('#' + imageName)
            .append('g')
            .attr('class', 'feature-events')
            .attr('id', 'feature-events-' + imageName)
            .attr('transform', 'translate(' + originalImageWidth + ',' + (originalImageWidth - featureImageWidth * 2) + ')')
        }
        let eventsObj = imageMatrixSvg.select('#feature-events-' + imageName)
          .selectAll('.feature-event')
          .data(featuresArray.filter(function (d, i) {
            return ((i >= displayRange[ 0 ]) && (i <= displayRange[ 1 ]))
          }), function (d, i) {
            if (typeof (d.eventObj) !== 'undefined') {
              return d.eventObj.eventName
            } else {
              return 'non-exist'
            }
          })
        eventsObj.enter()
          .append('text')
          .attr('cursor', 'pointer')
          .attr('class', function (d, i) {
            if (typeof (d.eventObj) !== 'undefined') {
              return 'feature-event ' + d.eventObj.eventName + ' ' + d.eventObj.eventType
            } else {
              return 'feature-event non-exist'
            }
          })
          .attr('id', function (d, i) {
            if (typeof (d.eventObj) !== 'undefined') {
              return imageName + '-' + d.eventObj.eventName
            } else {
              return imageName + '-' + 'nonexist'
            }
          })
          .attr('x', function (d, i) {
            return featureImageEachInterval + featureImageEachInterval * i + featureImageEachInterval / 2
          })
          .attr('y', featureImageWidth / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .text(function (d, i) {
            if (typeof (d.eventObj) !== 'undefined') {
              if (d.eventObj.eventType === 'start') {
                return '\uf0d9'
              } else if (d.eventObj.eventType === 'end') {
                return '\uf0da'
              }
            } else {
              return ''
            }
          })
          .on('mouseover', function (d, i) {
            //  高亮显示
            d3.select(this).classed('event-highlight', true)
            let imageNameId = d3.select(this).attr('id').split('-')[ 0 ]
            self.mouseover_handler(imageNameId)
            let className = d3.select(this).attr('class')
            let classNameArray = className.split(' ')
            let eventName = classNameArray[ 1 ]
            if (d.eventObj.eventType === 'start') {
              d3.selectAll('.end.' + eventName).classed('event-highlight', true)
            } else {
              d3.selectAll('.start.' + eventName).classed('event-highlight', true)
            }
          })
          .on('mouseout', function (d, i) {
            //  取消高亮显示event的结束
            d3.select(this).classed('event-highlight', false)
            let imageNameId = d3.select(this).attr('id').split('-')[ 0 ]
            self.mouseout_handler(imageNameId)
            let className = d3.select(this).attr('class')
            let classNameArray = className.split(' ')
            let eventName = classNameArray[ 1 ]
            if (d.eventObj.eventType === 'start') {
              d3.selectAll('.end.' + eventName).classed('event-highlight', false)
            } else {
              d3.selectAll('.start.' + eventName).classed('event-highlight', false)
            }
          })
          .style('fill', function (d, i) {
            if (typeof (d.eventObj) === 'undefined') {
              return 'black'
            } else {
              let eventCategory = d.eventObj.eventCategory
              if (typeof (categoryColor) !== 'undefined') {
                return categoryColor[ eventCategory ]
              } else {
                return 'black'
              }
            }
          })
          .on('click', function (d, i) {
            //  传递到imageComparisonView
          })
        eventsObj.attr('id', function (d, i) {
          if (typeof (d.eventObj) !== 'undefined') {
            return imageName + '-' + d.eventObj.eventName
          } else {
            return imageName + '-' + 'nonexist'
          }
        })
        //          .transition()
        //          .duration(1000)
          .attr('x', function (d, i) {
            return featureImageEachInterval + featureImageEachInterval * i + featureImageEachInterval / 2
          })
          .attr('y', featureImageWidth / 2)
        eventsObj.exit().remove()
      },
      render_each_feature_belonged_line (iI, jI, featureName) {
        let imageObjArray2 = this.imageObjArray2
        let imageMatrixSvg = d3.select('#image-matrix-svg')
        let imageName = imageObjArray2[ iI ][ jI ].imageName
        if (!imageMatrixSvg.select('#' + imageName + '-' + featureName).empty()) {
          let featuresObjX = +imageMatrixSvg.select('#' + imageName + '-' + featureName).attr('x')
          let featuresObjY = +imageMatrixSvg.select('#' + imageName + '-' + featureName).attr('y')
          let featuresObjHeight = +imageMatrixSvg.select('#' + imageName + '-' + featureName).attr('height')
          let featuresObjWidth = +imageMatrixSvg.select('#' + imageName + '-' + featureName).attr('width')
          let paddingY = 2
          if (imageMatrixSvg.select('#feature-image-' + imageName).select('#belong-line-' + imageName + '-' + featureName).empty()) {
            imageMatrixSvg.select('#feature-image-' + imageName)
              .append('line')
              .attr('class', 'belong-line')
              .attr('id', 'belong-line-' + imageName + '-' + featureName)
              .attr('x1', featuresObjX)
              .attr('y1', featuresObjY + featuresObjHeight + paddingY)
              .attr('x2', featuresObjX + featuresObjWidth)
              .attr('y2', featuresObjY + featuresObjHeight + paddingY)
          }
        }
      },
      /**
       *  更新单个component的feature图像的方法
       **/
      render_each_features_image (iI, jI) {
        var self = this
        var imageObjArray2 = this.imageObjArray2
        let featureImageEachInterval = this.featureImageEachInterval
        var imageMatrixSvg = d3.select('#image-matrix-svg')
        let imageName = imageObjArray2[ iI ][ jI ].imageName
        let originalImageWidth = imageObjArray2[ iI ][ jI ].originalImageWidth
        let featureImageWidth = imageObjArray2[ iI ][ jI ].featureImageWidth
        var featuresArray = imageObjArray2[ iI ][ jI ].featuresArray
        var displayRange = imageObjArray2[ iI ][ jI ].displayRange
        let selectionFeaturesArray = this.selectionFeaturesArray
        if (imageMatrixSvg.select('#' + imageName).select('#feature-image-' + imageName).empty()) {
          imageMatrixSvg.select('#' + imageName)
            .append('g')
            .attr('class', 'feature-images')
            .attr('id', 'feature-image-' + imageName)
            .attr('transform', 'translate(' + originalImageWidth + ',' + (originalImageWidth - featureImageWidth) + ')')
        }
        let featuresObj = imageMatrixSvg.select('#feature-image-' + imageName)
          .selectAll('.feature-image')
          .data(featuresArray.filter(function (d, i) {
            return ((i >= displayRange[ 0 ]) && (i <= displayRange[ 1 ]))
          }), function (d, i) {
            return d.featureName
          })
        featuresObj.enter()
          .append('rect')
          .attr('class', function (d, i) {
            return 'feature-image ' + d.featureName
          })
          .attr('id', function (d, i) {
            return imageName + '-' + d.featureName
          })
          .attr('cursor', 'pointer')
          .attr('x', function (d, i) {
            return featureImageEachInterval + featureImageEachInterval * i
          })
          .attr('y', 0)
          .attr('width', featureImageWidth)
          .attr('height', featureImageWidth)
          .on('mouseover', function (d, i) {
            let imageNameId = d3.select(this).attr('id').split('-')[ 0 ]
            self.mouseover_handler(imageNameId)
            self.mouseover_feature_handler(d.featureName, imageNameId)
            if (self.featureSelectionIndex % 2 === 0) {
              d3.select(this).classed('same-feature-highlight', false)
              d3.select(this).classed('first-hovering-selection', true)
            } else {
              d3.select(this).classed('same-feature-highlight', false)
              d3.select(this).classed('second-hovering-selection', true)
            }
          })
          .on('mouseout', function (d, i) {
            d3.select(this).classed('first-hovering-selection', false)
            d3.select(this).classed('second-hovering-selection', false)
            let imageNameId = d3.select(this).attr('id').split('-')[ 0 ]
            self.mouseout_handler(imageNameId)
            self.mouseout_feature_handler(imageNameId)
          })
          .on('click', function (d, i) {
            let featureId = d3.select(this).attr('id')
            self.feature_click_handler(featureId)
          })
        featuresObj
        //          .transition()
        //          .duration(1000)
          .attr('x', function (d, i) {
            return featureImageEachInterval + featureImageEachInterval * i
          })
          .attr('y', 0)
          .attr('width', featureImageWidth)
          .attr('height', featureImageWidth)
        for (let sI = 0; sI < selectionFeaturesArray.length; sI++) {
          let featuresName = selectionFeaturesArray[ sI ]
          imageMatrixSvg.select('#feature-image-' + imageName)
            .select('#' + featuresName)
            .classed('click-selection', true)
        }
        featuresObj.exit().remove()
      },
      /**
       *  点击feature的handler
       **/
      feature_click_handler (featureId) {
        let selectionFeaturesArray = this.selectionFeaturesArray
        let originalImageWidth = this.originalImageWidth + this.padding
        let globalXInterval = this.globalXInterval - this.padding
        if ((d3.select('#' + featureId).classed('first-click-selection')) || (d3.select('#' + featureId).classed('second-click-selection'))) {
          selectionFeaturesArray.splice(selectionFeaturesArray.indexOf(featureId), 1)
        } else {
          if (selectionFeaturesArray.length === 2) {
            selectionFeaturesArray.splice(this.featureSelectionIndex % 2, 1, featureId)
          } else if (selectionFeaturesArray.length < 2) {
            selectionFeaturesArray.push(featureId)
          }
        }
        this.featureSelectionIndex = this.featureSelectionIndex + 1
        d3.selectAll('.click-selection')
          .classed('click-selection', false)
        d3.selectAll('.click-feature-highlight')
          .classed('click-feature-highlight', false)
        d3.selectAll('.first-click-selection')
          .classed('first-click-selection', false)
        d3.selectAll('.first-feature-selection-line')
          .remove()
        d3.selectAll('.second-click-selection')
          .classed('second-click-selection', false)
        d3.selectAll('.second-feature-selection-line')
          .remove()
        let comparisonFeaturesArray = []
        for (let sI = 0; sI < selectionFeaturesArray.length; sI++) {
          if (sI === 0) {
            d3.select('#' + selectionFeaturesArray[ sI ])
              .classed('first-click-selection', true)
          } else {
            d3.select('#' + selectionFeaturesArray[ sI ])
              .classed('second-click-selection', true)
          }
          let featureId = selectionFeaturesArray[ sI ]
          let imageNameId = featureId.split('-')[ 0 ]
          comparisonFeaturesArray.push(featureId)
//          d3.select('.image-components#' + imageNameId)
//            .select('.background-image')
//            .classed('click-feature-highlight', true)
//          if (sI === 0) {
//            d3.selectAll('.first-feature-selection-line')
//              .remove()
//          } else {
//            d3.selectAll('.second-feature-selection-line')
//              .remove()
//          }
          d3.select('.image-components#' + imageNameId)
            .append('line')
            .attr('class', function (d, i) {
              if (sI === 0) {
                return 'feature-selection-line first-feature-selection-line'
              } else {
                return 'feature-selection-line second-feature-selection-line'
              }
            })
            .attr('x1', originalImageWidth)
            .attr('y1', 1.5)
            .attr('x2', globalXInterval)
            .attr('y2', 1.5)
        }
        this.update_comparison_features(comparisonFeaturesArray)
        //  对于features Image的高亮操作
        if (d3.select('.click-feature-highlight').empty()) {
          d3.selectAll('.image-components')
            .classed('mouseover-unhighlight', false)
        }
      },
      /**
       *  鼠标hover在某一个feature上时, 相同的feature会被高亮
       **/
      mouseover_feature_handler (featureName, imageNameId) {
        let channelName = imageNameId.split('_')[ 0 ]
        d3.select('#image-matrix-svg')
          .select('.image-row#' + channelName)
          .selectAll('.' + featureName)
          .classed('same-feature-highlight', true)
      },
      /**
       * 鼠标离开在某一个feature上时, 高亮的feature会被取消
       **/
      mouseout_feature_handler (imageNameId) {
        let channelName = imageNameId.split('_')[ 0 ]
        d3.select('#image-matrix-svg')
          .select('.image-row#' + channelName)
          .selectAll('.same-feature-highlight')
          .classed('same-feature-highlight', false)
      },
      /**
       * 鼠标悬浮在component的事件
       */
      mouseover_handler (imageNameId) {
        d3.select('.image-components#' + imageNameId)
          .select('.background-image')
          .classed('mouseover-highlight', true)
        let indexObj = this.getIndex(imageNameId)
        let imageObjArray2 = this.imageObjArray2
        let imageObj = imageObjArray2[ indexObj.i ][ indexObj.j ]
        let displayRange = imageObj.displayRange
        let featuresArray = imageObj.featuresArray
        d3.select('#' + imageNameId)
          .select('.feature-control')
          .select('.right-control')
          .classed('control-hidden', false)
        d3.select('#' + imageNameId)
          .select('.feature-control')
          .select('.left-control')
          .classed('control-hidden', false)
        if (displayRange[ 0 ] === 0) {
          d3.select('#' + imageNameId)
            .select('.feature-control')
            .select('.right-control')
            .classed('control-hidden', true)
        } else {
          d3.select('#' + imageNameId)
            .select('.feature-control')
            .select('.right-control')
            .classed('control-hidden', false)
        }
        if (displayRange[ 1 ] >= (featuresArray.length - 1)) {
          d3.select('#' + imageNameId)
            .select('.feature-control')
            .select('.left-control')
            .classed('control-hidden', true)
        } else {
          d3.select('#' + imageNameId)
            .select('.feature-control')
            .select('.left-control')
            .classed('control-hidden', false)
        }
      },
      /**
       * 鼠标移开component上的事件
       */
      mouseout_handler (imageNameId) {
        d3.select('.image-components#' + imageNameId)
          .select('.background-image')
          .classed('mouseover-highlight', false)
        if ((d3.select('.image-components.click-highlight').empty()) && (d3.select('.image-components.click-feature-highlight').empty())) {
          d3.selectAll('.image-components')
            .classed('mouseover-unhighlight', false)
        }
        d3.selectAll('.feature-control')
          .select('.right-control')
          .classed('control-hidden', true)
        d3.selectAll('.feature-control')
          .select('.left-control')
          .classed('control-hidden', true)
      },
      /**
       * 鼠标点击component的事件
       */
      click_handler (imageNameId) {
        if (!d3.select('.image-components#' + imageNameId).select('.background-image').classed('click-highlight')) {
          d3.selectAll('.background-image.click-highlight')
            .classed('click-highlight', false)
//          d3.select('.image-components#' + imageNameId)
//            .select('.background-image')
//            .classed('click-highlight', true)
          d3.selectAll('.original-image-bg.click-highlight')
            .classed('click-highlight', false)
          d3.select('.image-components#' + imageNameId)
            .select('.original-image-bg')
            .classed('click-highlight', true)
          this.sendSelectImage(imageNameId)
        } else {
          d3.selectAll('.background-image.click-highlight')
            .classed('click-highlight', false)
          d3.selectAll('.original-image-bg.click-highlight')
            .classed('click-highlight', false)
          this.sendSelectImage()
        }
      },
      /**
       *  根据nameId得到横向与纵向的坐标值
       */
      getIndex (imageNameId) {
        let imageNameArray = imageNameId.split('_')
        let channelName = imageNameArray[ 0 ]
        let date = imageNameArray[ 1 ] + '_' + imageNameArray[ 2 ] + '_' + imageNameArray[ 3 ]
        let channelArray = this.channelArray
        let dateArray = this.dateArray
        let indexObj = {
          i: channelArray.indexOf(channelName),
          j: dateArray.indexOf(date)
        }
        return indexObj
      },
      /**
       * 更新下方比较的feature
       */
      update_comparison_features (featuresArray) {
        if (featuresArray.length === 1) {
          let imageFeature1Name = featuresArray[ 0 ]
          let feature1NameArray = imageFeature1Name.split('-')
          let image1Name = feature1NameArray[ 0 ]
          let feature1Name = feature1NameArray[ 1 ]
          this.imgCompare({
            'type': 'originalImgs', 'img1': {
              'feature': { 'name': feature1Name, 'path': [] }, 'imgName': image1Name, 'color': '#ff7f00'
            }, 'img2': null
          })
        } else if (featuresArray.length === 2) {
          let imageFeature1Name = featuresArray[ 0 ]
          let feature1NameArray = imageFeature1Name.split('-')
          let image1Name = feature1NameArray[ 0 ]
          let feature1Name = feature1NameArray[ 1 ]
          let imageFeature2Name = featuresArray[ 1 ]
          let feature2NameArray = imageFeature2Name.split('-')
          let image2Name = feature2NameArray[ 0 ]
          let feature2Name = feature2NameArray[ 1 ]
          this.imgCompare({
            'type': 'originalImgs', 'img1': {
              'feature': { 'name': feature1Name, 'path': [] }, 'imgName': image1Name, 'color': '#ff7f00'
            }, 'img2': { 'feature': { 'name': feature2Name, 'path': [] }, 'imgName': image2Name, 'color': '#1b9e77' }
          })
        }
      },
      dealWithEvent () {
        //  event format
        let eventArray = this.eventArray
        let endObj = this.event.end
        let startObj = this.event.start
        let eventCategory = this.event.type
        eventArray.push(this.event)
        let eventIndex = eventArray.length - 1
        if (typeof (startObj) !== 'undefined') {
          this.addEventStart(startObj, eventCategory, eventIndex, 'start')
        }
        if (typeof (endObj) !== 'undefined') {
          this.addEventEnd(endObj, eventCategory, eventIndex, 'end')
        }
      },
      handleWithFeatures () {
        var addedFeatures = {}
        for (var item in this.addedFeatures) {
          addedFeatures[ item ] = this.addedFeatures[ item ]
        }
        let imageName = addedFeatures.imageName
        let addedFeaturesArray = imageName.split('_')
        let channelName = addedFeaturesArray[ 0 ]
        let dateName = addedFeaturesArray[ 1 ] + '_' + addedFeaturesArray[ 2 ] + '_' + addedFeaturesArray[ 3 ]
        let dateArray = this.dateArray
        let channelArray = this.channelArray
        let channelIndex = channelArray.indexOf(channelName)
        let timeIndex = dateArray.indexOf(dateName)
        var imageObjArray = this.imageObjArray2[ channelIndex ]
        for (let iI = 0; iI < imageObjArray.length; iI++) {
          var imageObj = imageObjArray[ iI ]
          var featuresArray = imageObj.featuresArray
          if (iI === timeIndex) {
            addedFeatures.belongThisImage = true
          } else {
            addedFeatures.belongThisImage = false
          }
          featuresArray.push($.extend(true, {}, addedFeatures))
          this.render_each_features_image(channelIndex, iI)
          for (let fI = 0; fI < featuresArray.length; fI++) {
            if (featuresArray[ fI ].belongThisImage) {
              let featureName = featuresArray[ fI ].featureName
              this.render_each_feature_belonged_line(channelIndex, iI, featureName)
            }
          }
        }
        console.log('imageObjArray2[ channelIndex ]', this.imageObjArray2[ channelIndex ])
      },
      addEventStart (startObj, eventCategory, eventIndex, eventType) {
        let channel = startObj.channel
        let time = startObj.time
        let feature = startObj.feature
        let dateArray = this.dateArray
        let channelArray = this.channelArray
        let imageObjArray2 = this.imageObjArray2
        let channelIndex = channelArray.indexOf(channel)
        let timeIndex = dateArray.indexOf(time)
        let imageObj = imageObjArray2[ channelIndex ][ timeIndex ]
        let featuresArray = imageObj.featuresArray
        let eventName = 'event' + eventIndex
        for (let fI = 0; fI < featuresArray.length; fI++) {
          if (featuresArray[ fI ].featureName === feature) {
            featuresArray[ fI ].eventObj = {}
            featuresArray[ fI ].eventObj.eventName = eventName
            featuresArray[ fI ].eventObj.eventCategory = eventCategory
            featuresArray[ fI ].eventObj.eventType = eventType
          }
        }
        this.render_each_events(channelIndex, timeIndex)
        console.log('start imageObj', imageObj)
      },
      addEventEnd (endObj, eventCategory, eventIndex, eventType) {
        let channel = endObj.channel
        let time = endObj.time
        let feature = endObj.feature
        let dateArray = this.dateArray
        let channelArray = this.channelArray
        let imageObjArray2 = this.imageObjArray2
        let channelIndex = channelArray.indexOf(channel)
        let timeIndex = dateArray.indexOf(time)
        let imageObj = imageObjArray2[ channelIndex ][ timeIndex ]
        let featuresArray = imageObj.featuresArray
        let eventName = 'event' + eventIndex
        for (let fI = 0; fI < featuresArray.length; fI++) {
          if (featuresArray[ fI ].featureName === feature) {
            featuresArray[ fI ].eventObj = {}
            featuresArray[ fI ].eventObj.eventName = eventName
            featuresArray[ fI ].eventObj.eventCategory = eventCategory
            featuresArray[ fI ].eventObj.eventType = eventType
          }
        }
        this.render_each_events(channelIndex, timeIndex)
      },
      //  传递点击的图片的数据
      sendSelectImage (imageNameId) {
        if (typeof (imageNameId) !== 'undefined') {
          //  传递给imageTaggedView
          this.imageToTaggedView(imageNameId)
        } else {
          //  传递空图片
          this.imageToTaggedView(null)
        }
      }
    }
  }
</script>
<style>
  .image-matrix-view {
    border: 1px solid gray;
    width: 100%;
    margin-left: 0%;
  }
  .background-image {
    fill: white;
  }
  .feature-image {
    fill: white;
    stroke: gray;
    stroke-width: 1px;
  }
  .right-control[class~=control-hidden] {
    visibility: hidden;
  }
  .left-control[class~=control-hidden] {
    visibility: hidden;
  }
  .feature-image[class~=first-click-selection] {
    stroke: #ff7f00 !important;
    stroke-width: 2px;
  }
  .feature-image[class~=second-click-selection] {
    stroke: #1b9e77 !important;
    stroke-width: 2px;
  }
  .feature-image[class~=first-hovering-selection] {
    stroke: #ff7f00;
    stroke-width: 2px;
  }
  .feature-image[class~=second-hovering-selection] {
    stroke: #1b9e77;
    stroke-width: 2px;
  }
  .image-components[class~=click-highlight] {
    opacity: 1 !important;
  }
  .background-image[class~=click-feature-highlight] {
    fill: #c7e6c0;
  }
  .image-components[class~=mouseover-unhighlight] {
    opacity: 0.3;
  }
  .background-image[class~=mouseover-highlight] {
    fill: #999;
  }
  .background-image[class~=click-highlight] {
    fill: #999;
  }
  .channel-name[class~=mouseover-highlight] {
    font-size: 0.9em;
    fill: black !important;
  }
  .channel-name[class~=selection-highlight] {
    font-size: 0.9em;
    fill: black;
  }
  .channel-name[class~=selection-unhighlight] {
    fill: #ddd;
  }
  .feature-image[class~=same-feature-highlight] {
    stroke: gray;
    stroke-width: 2px;
  }
  .edit-icon-bg {
    fill: white;
    opacity: 0.7;
  }
  .edit-icon {
    font-size: 1em;
  }
  .control {
    font-size: 0.6em;
  }
  .original-image-bg[class~=mouseover-highlight] {
    stroke: white;
    stroke-width: 4px;
    animation-name: original-highlight-animation;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .original-image-bg[class~=click-highlight] {
    /*stroke: #2c7bb6;*/
    stroke: white;
    stroke-width: 4px;
  }
  .first-feature-selection-line {
    stroke: #ff7f00;
    stroke-width: 1px;
  }
  .second-feature-selection-line {
    stroke: #1b9e77;
    stroke-width: 1px;
  }
  .feature-event {
    font-size: 0.5em;
  }
  .feature-event[class~=event-highlight] {
    font-size: 0.7em;
  }
  .feature-image[class~=feature-highlight] {
    stroke: #fc8d59;
    stroke-width: 2px;
    animation-name: feature-highlight-animation;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .channel-name {
    font-size: 0.7em;
  }
  .belong-line {
    stroke: gray;
    stroke-width: 2px;
  }
  
  @keyframes original-highlight-animation {
    0% {
    }
    50% {
      stroke-width: 6px;
    }
    100% {
    }
  }
  @keyframes feature-highlight-animation {
    0% {
    }
    50% {
      stroke-width: 3px;
    }
    100% {
    }
  }
</style>