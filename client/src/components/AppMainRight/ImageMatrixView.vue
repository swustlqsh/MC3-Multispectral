<template>
  <div class="image-matrix-view">
  </div>
</template>
<script>
  import $ from 'jquery'
  //  d3v3 使用方式
//  let d3 = require('../../../plugins/d3v3.min.js')
  export default {
    data () {
      return {}
    },
    ready () {
      this.getImageOriginalData()
    },
    methods: {
      /**
       *  获取图片数据的对象数组
       *  每一个对象中包括原始的图片的名称(ImageData), 名称是由通道channel和日期组成
       *    - channel_date.png
       *  图片位置(locationX, locationY)
       *  检测得到的特征数组(FeaturesArray)
       *  在这个图片中检测得到的事件数组(EventsArray)
       */
      getImageOriginalData () {
        let imageMatrixWidth = $('#image-matrix').width()
        let padding = 0.25 / 100 * imageMatrixWidth
        let originalImageWidth = 3.5 / 100 * imageMatrixWidth
        let imageHeight = originalImageWidth + padding
        let channelArray = [ 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B1B5B6', 'B3B2B1', 'B4B3B2', 'B5B4B2', 'NVDI' ]
        let imageMatrixViewHeight = imageHeight * channelArray.length
        $('#image-matrix-view').height(imageMatrixViewHeight)
        let channelInfoObj = {}
        for (let i = 0; i < channelArray.length; i++) {
          let channelName = channelArray[ i ]
          channelInfoObj[ channelName ] = {}
          channelInfoObj[ channelName ].channelName = channelArray[ i ]
          channelInfoObj[ channelName ].imageHeight = imageHeight
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .image-matrix-view {
    border: 1px solid gray;
  }
</style>