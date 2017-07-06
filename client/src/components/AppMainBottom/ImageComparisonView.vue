<template>
    <div id = 'timeLine'></div>
    <div id = 'imageCompare'></div>
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
            <div>
                <textarea id = 'commentsText' name = 'textarea' rows="7" cols="30"></textarea>
            </div>
            <div style="text-align: center; margin-top: 20">
                <button type="button" id="sbutton"> Submit </button>
            </div>
        </div>
    </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize} from '../../vuex/getters'
  import {eventSubmit} from '../../vuex/actions'
  export default {
    vuex: {
      actions: {
        eventSubmit
      },
      getters: {pageSize}
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
        this.drawTimelineView()
        this.drawTagPannel()
      },
      drawTimelineView () {
        let d3 = window.d3
        let width = $('#timeLine').width()
        let height = $('#timeLine').height()
        console.log(width, height)
        let svg = d3.select('#timeLine').append('svg').attr('width', width).attr('height', height)
        let padding = {left: 2, right: 20, top: 2, bottom: 2}
        let defs = svg.append('defs')
        let arrowMarker = defs.append('marker')
          .attr('id', 'arrow')
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '12')
          .attr('markerHeight', '12')
          .attr('viewBox', '0 0 12 12')
          .attr('refX', '6')
          .attr('refY', '6')
          .attr('orient', 'auto')
        let arrowPath = 'M2,2 L10,6 L2,10 L6,6 L2,2'
        arrowMarker.append('path')
          .attr('d', arrowPath)
          .attr('fill', '#000')
        svg.append('line')
          .attr('x1', padding.left)
          .attr('y1', padding.top + height / 2)
          .attr('x2', width - padding.right)
          .attr('y2', padding.top + height / 2)
          .style('stroke', 'grey')
          .style('stroke-width', '2px')
          .attr('marker-end', 'url(#arrow)')
        let years = [2014, 2015, 2016]
        let sw = (width - padding.left - padding.right) / 3
        years.forEach(function (d, i) {
          svg.append('text')
            .attr('y', padding.top + height / 2 + 20)
            .attr('x', sw * i + sw / 2 + padding.left)
            .text(d)
            .attr('font-size', '1em')
        })
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
      submmitComments () {
      }
    },
    ready () {
//      this.init()
    }
  }
</script>
<style lang="less" scoped>
  #timeLine {
    width: 100%;
    height: 10%;
  }
  #imageCompare {
    width: 66.7%;
    height: 90%;
  }
  #statistics {
    position: absolute;
    top: 10%;
    left: 66.7%;
    width: 33.3% - 12.5%;
    height: 90%;
    border: 1px solid grey;
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
  textarea {
    width: 95%;
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