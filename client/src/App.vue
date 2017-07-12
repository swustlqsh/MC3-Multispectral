<template>
  <div id="App">
    <!--<app-header></app-header>-->
    <app-main></app-main>
  </div>
  <canvas id="source-canvas" width="651" height="651" style="border:1px solid #d3d3d3; display: none">
    Your browser does not support the HTML5 canvas tag.
  </canvas>

  <canvas id="cut-canvas" style="border:1px solid #d3d3d3; display: none">
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>
<script>
  import {getPageSize} from './commons/utils'
  import AppHeader from './components/AppHeader.vue'
  import AppMain from './components/AppMain.vue'
  import {updatePageSize} from './vuex/actions'
  import {pageWidth} from './vuex/getters'
  import UTIF from './commons/utif'
  import config from './commons/config'
  import $ from 'jquery'
  // import Promise from 'bluebird'
  // var fs = Promise.promisifyAll(require('.／commons/fs.js'))
  export default {
    vuex: {
      actions: { updatePageSize },
      getters: { pageWidth }
    },
    data () {
      return {
        timer: false
      }
    },
    watch: {
      pageWidth (now) {
        console.log('now', now)
      }
    },
    components: { AppHeader, AppMain },
    ready () {
      const that = this
      let pageSize = getPageSize()
      pageSize.height = 1080 * 3 / 1920 / 4 * pageSize.width
      that.updatePageSize(pageSize.width, pageSize.height)
      window.onresize = () => {
        return (() => {
          if (!that.timer) {
            that.timer = true
            setTimeout(() => {
              let pageSize = getPageSize()
              pageSize.height = 1080 * 3 / 1920 / 4 * pageSize.width
              that.updatePageSize(pageSize.width, pageSize.height)
              console.log(that.pageWidth, 'that')
              that.timer = false
            }, 400)
          }
        })()
      }
      let date = config.date
      let dataArr = []
      let num = 0
      date.forEach(function (d, i) {
        dataLoad(i, function (response) {
          dataArr.push(response)
        })
      })
//    Promise.map(date, function (dt, i) {
//      let tag = '' + (i + 1)
//      if (i + 1 < 10) tag = '0' + tag
//      let fileName = '../data/tiffile/image' + tag + '_' + date[ i ] + '.tif'
//      return fs.readFileAsync(fileName)
//        .then(UTIF.decode)
//        .catch(SyntaxError, function (e) {
//          throw e
//        })
//    }, { concurrency: Infinity }).then(function (parsedUTF) {
//      console.log(parsedUTF)
//    }).catch(SyntaxError, function (e) {
//      console.log('Invalid CSV in file ' + e.fileName + ': ' + e.message)
//    })

      function dataLoad (i, done) {
        console.log(i)
        let tag = '' + (i + 1)
        let xhr = new XMLHttpRequest()
        if (i + 1 < 10) tag = '0' + tag
        xhr.open('GET', '../data/tiffile/image' + tag + '_' + date[ i ] + '.tif', true)
        xhr.responseType = 'arraybuffer'
        xhr.onload = function (e) {
          let pages = UTIF.decode(e.target.response)
//        console.log(pages)
          let arr = []
          for (let i = 0; i < 651; i++) {
            arr.push([])
            for (let j = 0; j < 651; j++) {
              arr[ i ].push(0)
            }
          }
          let data = pages[ 0 ].data
          for (let y = 0; y < 651; y++) {
            for (let x = 0; x < 651; x++) {
              let index = (y * 651 + x) * 6
              arr[ x ][ y ] = [ data[ index ], data[ index + 1 ], data[ index + 2 ], data[ index + 3 ], data[ index + 4 ], data[ index + 5 ] ]
            }
          }
          num += 1
          if (num === 12) {
            $('.loading').hide()
            $('.main-top').css('visibility', 'visible')
            $('.main-bottom').css('visibility', 'visible')
          }
          return done(arr)
        }
        xhr.send()
      }

      window.dataArr = dataArr
    }
  }
</script>
<style lang="less" scoped>
  @import "./App.less";
</style>