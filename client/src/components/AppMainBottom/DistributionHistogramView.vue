<template>
    <div id='timelineLeft'>
        <div id='timeline1'>
        </div>
        <div id='timeline2'>
        </div>
        <div id='timeline3'>
        </div>
        <div id='timeline4'>
        </div>
        <div id='timeline5'>
        </div>
        <div id='timeline6'>
        </div>
        <div id='timeline7'>
        </div>
        <div id='timeline8'>
        </div>
        <div id='timeline9'>
        </div>
        <div id='timeline10'>
        </div>
        <div id='timeline11'>
        </div>
        <div id='timeline12'>
        </div>

    </div>
    <div id="timelineRight">
    </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize, lassoArea} from '../../vuex/getters'
  import {getPointsOfArea} from '../../commons/utils'
  import config from '../../commons/config'
  export default {
    vuex: {
      getters: {pageSize, lassoArea}
    },
    data () {
      return {
        isNDVI: false
      }
    },
    watch: {
      pageSize: {
        handler (curVal, oldVal) {
          if (!this.load) {
            for (var j = 1; j < 13; j++) {
              let data = []
              for (var i = 0; i < 20; i++) {
                data.push({'time': i, 'num': parseInt(Math.random() * 20)})
              }
//              this.init('#timeline' + j, data)
            }
//            this.updateLine('#timelineRight')
          }
          this.load = true
        },
        deep: true
      },
      lassoArea: {
        handler (curVal, oldVal) {
          let area = []
          let num = this.lassoArea[ 0 ].length
          for (let i = 0; i < num; i++) {
            area.push([ this.lassoArea[ 0 ][ i ], this.lassoArea[ 1 ][ i ] ])
          }
//          console.log(area)
//          console.log(getPointsOfArea)
          this.updateDistribution(getPointsOfArea(area))
        },
        deep: true
      }
    },
    methods: {
      init (panelSelector, data, index) {
//        console.log(data)
        let self = this
        let d3 = require('../../../plugins/d3v3.min.js')
        self.width = $(panelSelector).width()
        self.height = $(panelSelector).height()
        let emSize = config.emSize
        self.w = self.width / data.length
        let W = self.width / data.length
        self.margin = { 'left': 2, 'right': 2, 'top': 1, 'bottom': 3 }
        self.w = self.w - self.margin.left - self.margin.right
        self.height = self.height - self.margin.top - self.margin.bottom
        self.xScale.range([0, self.w])
        self.yScale.range([self.height, 0])
//        self.xAxis = d3.svg.axis()
//          .scale(self.xScale)
//          .orient('bottom')
//          .tickFormat(function (d, i) {
//            return ''
//          })
//          .tickSize(0, 0)
//        self.yAxis = d3.svg.axis()
//          .scale(self.yScale)
//          .orient('left')
//          .tickSize(2, 5)
//          .ticks(2)
//        console.log(data)
        $(panelSelector).empty()
        self.svg = d3.select(panelSelector)
          .append('svg')
          .attr('width', self.width + self.margin.left + self.margin.right)
          .attr('height', self.height + self.margin.top + self.margin.bottom)
          .selectAll('g')
          .data(data)
          .enter()
          .append('g')
          .attr('transform', function (d, i) {
            return 'translate(' + (self.margin.left + i * W) + ',' + self.margin.top + ')'
          })
          .attr('id', function (d, i) {
            return 'g' + i
          })
        d3.selectAll('.curveAxis')
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', '0.5px')
        self.barWidth = self.w / data[0].length
        self.svg.selectAll('.arrbar')
          .data(function (d) {
            return d
          })
          .enter().append('rect')
          .attr('class', 'arrbarbot')
          .attr('x', function (d) { return self.xScale(d.time) })
          .attr('y', function (d) { return self.yScale(self.barHeight(d.num)) })
          .attr('width', self.barWidth * 0.95)
          .attr('height', function (d) { return self.height - self.yScale(self.barHeight(d.num)) })
          .style('fill', 'grey')

        if (index === 0) {
          for (let i = 0; i < self.currentChannels.length; i++) {
            d3.select('#g' + i)
              .append('text')
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'left')
              .text(self.currentChannels[ i ])
              .attr('font-size', emSize * 0.8)
          }
        }
//        self.svg.selectAll('.curveAxis')
//          .selectAll('text')
//          .style('font-size', '0.5em')
      },
      updateDistribution (points) {
        let d3 = require('../../../plugins/d3v3.min.js')
        let self = this
        self.xScale = d3.scale.linear()
        self.yScale = d3.scale.linear()
        let channels = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'NDVI']
        let dataArr = window.dataArr
        let calNum = {}
        let tmp = window.currentSelectionChannel
        if (tmp === 'NDVI') {
          for (let i = 0; i < dataArr.length; i++) {
            for (let r = 0; r < 651; r++) {
              for (let c = 0; c < 651; c++) {
                let b4 = dataArr[ i ][ r ][ c ][ 3 ]
                let b3 = dataArr[ i ][ r ][ c ][ 2 ]
//                console.log(dataArr[i][r][c])
                dataArr[ i ][ r ][ c ].push((b4 - b3) / (b4 + b3))
              }
            }
          }
        }
        let currentChannels = []
        if (tmp.length === 6) {
          currentChannels = [ tmp[ 0 ] + tmp[ 1 ], tmp[ 2 ] + tmp[ 3 ], tmp[ 4 ] + tmp[ 5 ] ]
        } else {
          currentChannels = [ tmp ]
        }
        let cIndex = []
        for (let i = 0; i < currentChannels.length; i++) {
          cIndex.push(channels.indexOf(currentChannels[ i ]))
        }
        self.currentChannels = currentChannels
        let pLen = points.length
//        let cLen = cIndex.length
        let allData = []
        for (let i = 0; i < 12; i++) {
          let data = []
          for (let c = 0; c < cIndex.length; c++) {
            for (let p = 0; p < 256; p++) {
              calNum[ p ] = 0
            }
            for (let j = 0; j < pLen; j++) {
              let value = dataArr[ i ][ points[ j ][ 0 ] ][ points[ j ][ 1 ] ][ cIndex[ c ] ]
              let index = value
              calNum[ index ] += 1
            }
            let d = []
            for (let k in calNum) {
              d.push({ 'time': +k, 'num': calNum[ k ], 'channel': currentChannels })
            }
            data.push(d)
          }

          allData.push(data)
        }
//        console.log(allData)
        self.xScale.domain([ 0, 255 ])
        self.yScale.domain([ 0, d3.max(allData, function (data1) {
          return d3.max(data1, function (data2) {
            return d3.max(data2, function (d) {
              return self.barHeight(d.num)
            })
          })
        }) ])
        console.log(self.xScale.domain())
        console.log(self.yScale.domain())
        for (let i = 0; i < allData.length; i++) {
          self.init('#timeline' + (i + 1), allData[ i ], i)
        }
        this.updateLine('#timelineRight')
      },
      barHeight (num) {
        return Math.sqrt(num)
      },
      updateLine (panelSelector) {
        let d3 = require('../../../plugins/d3v3.min.js')
        let width = $(panelSelector).width()
        let height = $(panelSelector).height()
        let minHeight = height / 24
        let singleHeight = height / 12
        let minWidth = width / 5
        $(panelSelector).empty()
        let diffSVG = d3.select(panelSelector)
          .append('svg')
          .attr('class', 'timeline')
          .attr('width', width)
          .attr('height', height)
        let line = d3.svg.line()
          .x(function (d, i) {
            return d[0]
          })
          .y(function (d) {
            return d[1]
          })
//          .interpolate('linear')
//        线条1-5
        let data = []
        data = [[0, minHeight], [minWidth, minHeight], [minWidth, 4 * singleHeight + minHeight - 5], [0, 4 * singleHeight + minHeight - 5]]
        diffSVG.append('path')
               .attr('d', line(data))
               .attr('stroke-width', 1)
               .attr('stroke', 'black')
               .attr('fill', 'none')
//        线条2-6
        data = [[0, minHeight + singleHeight], [2 * minWidth, minHeight + singleHeight], [2 * minWidth, 5 * singleHeight + minHeight - 5], [0, 5 * singleHeight + minHeight - 5]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
//        线条3-7
        data = [[0, minHeight + 2 * singleHeight], [3 * minWidth, minHeight + 2 * singleHeight], [3 * minWidth, 6 * singleHeight + minHeight - 5], [0, 6 * singleHeight + minHeight - 5]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
//        线条4-8
        data = [[0, minHeight + 3 * singleHeight], [4 * minWidth, minHeight + 3 * singleHeight], [4 * minWidth, 7 * singleHeight + minHeight - 5], [0, 7 * singleHeight + minHeight - 5]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
//        线条5-9
        data = [[0, minHeight + 4 * singleHeight + 5], [minWidth, minHeight + 4 * singleHeight + 5], [minWidth, 8 * singleHeight + minHeight], [0, 8 * singleHeight + minHeight]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
//        线条6-10
        data = [[0, minHeight + 5 * singleHeight + 5], [2 * minWidth, minHeight + 5 * singleHeight + 5], [2 * minWidth, 9 * singleHeight + minHeight], [0, 9 * singleHeight + minHeight]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
//        线条7-11
        data = [[0, minHeight + 6 * singleHeight + 5], [3 * minWidth, minHeight + 6 * singleHeight + 5], [3 * minWidth, 10 * singleHeight + minHeight], [0, 10 * singleHeight + minHeight]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
//        线条=8-12
        data = [[0, minHeight + 7 * singleHeight + 5], [4 * minWidth, minHeight + 7 * singleHeight + 5], [4 * minWidth, 11 * singleHeight + minHeight], [0, 11 * singleHeight + minHeight]]
        diffSVG.append('path')
          .attr('d', line(data))
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('fill', 'none')
      },
      calImageDifferenceByAbs (t1, t2, channelIndex, points) {
        let diff = 0
        let dataArr = window.dataArr
        let pLen = points.length
        for (let j = 0; j < pLen; j++) {
          let dt1 = dataArr[ t1 ]
          let dt2 = dataArr[ t2 ]
          diff += Math.abs(dt1[ points[ j ][ 0 ] ][ points[ j ][ 1 ] ][ channelIndex ] - dt2[ points[ j ][ 0 ] ][ points[ j ][ 1 ] ][ channelIndex ])
        }
        return diff
      }
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  .curveAxis path,
  .curveAxis line {
    fill: red;
    stroke: #000;
    shape-rendering: crispEdges;
  }
  .line {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5px;
  }
  #timelineLeft {
    position: absolute;
    left: 0%;
    top: 0%;
    width: 70%;
    height: 100%;
    border: 1px solid grey;
    #timeline1 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline2 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline3 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline4 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline5 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline6 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline7 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline8 {
      height: 8%;
      border-bottom: 1px solid grey;
    }
    #timeline9 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline10 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline11 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
    #timeline12 {
      height: 8.1%;
      border-bottom: 1px solid grey;
    }
  }
  #timelineRight {
    position: absolute;
    left: 70%;
    top: 0%;
    width: 30%;
    height: 100%;
  }
</style>