<template>
    <div id = 'imageCompare' style = 'padding-left: 0; padding-right: 0'>
        <div v-el:graph1 id="graph1">
            <!--<img class="uk-thumbnail" src="../../../resource/3B/B1B5B6_2014_03_17.png" alt="">-->
            <canvas id="image_canvas1" class="image_canvas"></canvas>
            <canvas id="region_canvas1" class="region_canvas"></canvas>
        </div>
        <div v-el:graph2 id="graph2">
            <!--<img class="uk-thumbnail" src="../../../resource/3B/B1B5B6_2014_03_17.png" alt="">-->
            <canvas id="image_canvas2" class="image_canvas"></canvas>
            <canvas id="region_canvas2" class="region_canvas"></canvas>
        </div>
    </div>
    <div id = 'statistics'>
        <div id = 'tagChannel'></div>
        <div id = 'submmit'>
            <div>
                Type
                <select style="margin-left: 20px" id = 'eventSelect'>
                    <option value="Flood">Flood</option>
                    <option value="Burnt">Burnt</option>
                    <option value="Shrink">Shrink</option>
                    <option value="Expand">Expand</option>
                </select>
            </div>
            <div style="margin-top: 20px">
                Description
            </div>
            <div style="height: 50%">
                <textarea id = 'commentsText' name = 'textarea'></textarea>
            </div>
            <div style="text-align: center;" id="submitButton">
                <button type="button" id="sbutton"> Submit </button>
            </div>
        </div>
    </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize, comparedMessage} from '../../vuex/getters'
  import {eventSubmit} from '../../vuex/actions'
  import EG from 'ENGINES'
  export default {
    vuex: {
      actions: {
        eventSubmit
      },
      getters: { pageSize, comparedMessage }
    },
    data () {
      return {
        divName: 'image-comparison',
        load: false,
        channelTagNum: {
          'B3B2B1': 3,
          'B5B4B2': 2,
          'B4B3B2': 0,
          'B1B5B6': 0,
          'NDVI': 0,
          'B1': 0,
          'B2': 0,
          'B3': 0,
          'B4': 0,
          'B5': 0,
          'B6': 0
        }
      }
    },
    watch: {
      pageSize: {
        handler (curVal, oldVal) {
          if (!this.load) {
            this.init()
          }
          this.load = true
        },
        deep: true
      },
      comparedMessage: {
        handler (curVal, oldVal) {
          this.loadComparisonImages()
        },
        deep: true
      }
    },
    methods: {
      init () {
        let self = this
        $('#sbutton').click(function () {
          let event = {}
          event.comments = $('#commentsText').val()
          event.type = $('#eventSelect').val()
          self.eventSubmit(event)
          self.updatePanel('B5')
        })
        this.drawTagPannel()
//        this.loadComparisonImages()
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
        let cellWidth = width / 10
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
        let textWidth = 60
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
      loadComparisonImages () {
//        let imgObj1 = imgs[0]
//        let imgObj2 = imgs[1]
//        let d3 = window.d3
//        let width = $('#imageCompare').width()
//        let height = $('#imageCompare').height()
//        let svg = d3.select('#imageCompare').append('svg').attr('width', width).attr('height', height)
//        let g1 = svg.append('g')
//        g1.append('image')
//          .attr('xlink:href', '../../../resource/3B/B1B5B6_2014_03_17.png')
//          .attr('width', width / 2)
//          .attr('height', height)
        if (this.comparedMessage.type === 'originalImgs') {
          let img1 = this.comparedMessage.img1name
          let img2 = this.comparedMessage.img2name
//          no png
          this.renderIns = new EG.renders.GraphTag({ selector: this.$els.graph1 })
          this.renderIns.init({
            image_canvas_id: 'image_canvas1',
            region_canvas_id: 'region_canvas1'
          })
          let prefix = img1.split('_')[ 0 ]
//          this.renderIns.loadStoreLocalImg('../../../resource/3B/B1B5B6_2014_03_17.png', 'B1B5B6_2014_03_17')
          this.renderIns.loadStoreLocalImg('../../../data/' + prefix + '/' + img1 + '.png', img1)
          this.renderIns.showImage(0)
          this.renderIns = new EG.renders.GraphTag({ selector: this.$els.graph2 })
          this.renderIns.init({
            image_canvas_id: 'image_canvas2',
            region_canvas_id: 'region_canvas2'
          })
          if (img2 !== null) {
            prefix = img2.split('_')[ 0 ]
            this.renderIns.loadStoreLocalImg('../../../data/' + prefix + '/' + img2 + '.png', img2)
            this.renderIns.showImage(0)
          } else {
            this.renderIns.clearRegCanvas()
          }
        }
      }
    },
    ready () {
//      this.init()
    }
  }
</script>
<style lang="less" scoped>
  #imageCompare {
    position: absolute;
    width: 80%;
    height: 100%;
  }
  #statistics {
    position: absolute;
    left: 81%;
    width: 19%;
    height: 100%;
    border: 1px solid grey;
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
  }
  #submitButton {
    margin-top: 8%;
  }
  textarea {
    width: 95%;
    height: 100%;
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