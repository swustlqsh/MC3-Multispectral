<template>
  <div class="image-row">
    <image-features></image-features>
  </div>
</template>
<script>
  import ImageFeatures from '../ImageFeatures/ImageFeatures.vue'

  export default {
    components: {
      ImageFeatures
    },
    data () {
      return {
//        locationX: null,
//        locationY: null,
//        originalImage: null,
//        FeaturesArray: [],
//        EventsArray: []
      }
    },
    watch: {},
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
//        let imageMatrixWidth = $('#image-matrix').width()
//        let padding = 0.25 / 100 * imageMatrixWidth
//        let originalImageWidth = 3.5 / 100 * imageMatrixWidth
//        let imageHeight = originalImageWidth + padding
//        let featuresImage = 0.5 / 100 * imageMatrixWidth
//        let globalXInterval = 6.25 / 100 * imageMatrixWidth
//        let dateArray = [ '2014_03_17', '2014_08_24', '2014_11_28', '2014_12_30',
//          '2015_02_15', '2015_06_24', '2015_09_12', '2015_11_15',
//          '2016_03_06', '2016_06_26', '2016_09_06', '2016_12_19' ]
//        let channelObjArray2 = []
//        console.log('47', this.channelName)
//        for (let i = 0; i < channelArray.length; i++) {
//          channelObjArray2[i] = {}
//          channelObjArray2[i].channelName = channelArray[i]
//          channelObjArray2[i].imageHeight = imageHeight
//          let channelName = channelArray[ i ]
//          let channelImageNameArray = []
//          for (let j = 0; j < dateArray.length; j++) {
//            let dateName = dateArray[ j ]
//            let channelImageObj = {}
//            let channelImageName = channelName + '_' + dateName + '.png'
//            channelImageObj.channelImageName = channelImageName
//            let locationX = globalXInterval * j
//            channelImageObj.locationX = locationX
//            channelImageObj.originalImageWidth = originalImageWidth
//            channelImageNameArray.push(channelImageObj)
//          }
//          channelImageNameArray2.push(channelImageNameArray)
//        }
      },
      render () {
      }
    }
  }
</script>
<style lang="less" scoped>
  .event-view-main {
    border: 1px solid gray;
    padding: 5px 10px;
  }
</style>