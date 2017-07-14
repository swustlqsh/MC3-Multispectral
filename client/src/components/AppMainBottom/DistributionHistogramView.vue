<template>
  <div id = 'distribution'>
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
    <div id='timelineRight' style='text-align: center;'>
    </div>
  </div>
  <div id = 'pannel' style = 'text-align: center'>
    <select id = 'compareSelect'>
      <option value="Near" class="option-text">Near</option>
      <option value="Year" class="option-text">Year</option>
      <option value="Random" class="option-text">Random</option>
    </select>
  </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize, lassoArea} from '../../vuex/getters'
  import {transFeatures} from '../../vuex/actions'
  import {getPointsOfArea} from '../../commons/utils'
  import config from '../../commons/config'
  let d3 = require('../../../plugins/d3v3.min.js')
  export default {
    vuex: {
      getters: {pageSize, lassoArea},
      actions: {transFeatures}
    },
    data () {
      return {
        isNDVI: false,
        selectedCmp: 'Near'
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
          let addedFeatures = this.lassoArea[2]
          this.features = {}
          this.features[ 'featureName' ] = addedFeatures[ 'featureName' ]
          let imgName = addedFeatures[ 'imageName' ]
          this.features[ 'featureChannel' ] = imgName.split('_')[ 0 ]
          this.updateDistribution(getPointsOfArea(area))
        },
        deep: true
      }
    },
    methods: {
      init (panelSelector, data, index) {
//        console.log(data)
        let self = this
        let fill = '#242020'
        let d3 = require('../../../plugins/d3v3.min.js')
        self.width = $(panelSelector).width()
        self.height = $(panelSelector).height()
        let fontSize = config.emSize * 0.8
        let textWidth = fontSize * 4
        self.margin = { 'left': 2, 'right': 2, 'top': 1, 'bottom': 3 }
        self.w = (self.width - textWidth) / data.length
        let W = self.w
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
        let date = config.date[ index ].split('_')
        date = date[ 0 ] + '_' + date[ 1 ]
        let svg = d3.select(panelSelector)
          .append('svg')
          .attr('width', self.width)
          .attr('height', self.height + self.margin.top + self.margin.bottom)
        svg.append('text')
          .attr('x', textWidth)
          .attr('y', (self.height + self.margin.top + self.margin.bottom) / 2)
          .attr('alignment-baseline', 'middle')
          .attr('text-anchor', 'end')
          .attr('font-size', fontSize)
          .text(date)
        self.svg = svg.selectAll('g')
          .data(data)
          .enter()
          .append('g')
          .attr('transform', function (d, i) {
            return 'translate(' + (self.margin.left + i * W + textWidth) + ',' + self.margin.top + ')'
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
          .attr('width', self.barWidth)
          .attr('height', function (d) { return self.height - self.yScale(self.barHeight(d.num)) })
          .style('fill', fill)

        if (index === 0) {
          for (let i = 0; i < self.currentChannels.length; i++) {
            d3.select('#g' + i)
              .append('text')
              .attr('x', self.w / 2)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .text(self.currentChannels[ i ])
              .attr('font-size', fontSize)
          }
        }
//        self.svg.selectAll('.curveAxis')
//          .selectAll('text')
//          .style('font-size', '0.5em')
      },
      updateDistribution (points) {
        let self = this
        self.points = points
        self.xScale = d3.scale.linear()
        self.yScale = d3.scale.linear()
        let channels = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'NDVI']
        this.allChannels = channels
        let dataArr = window.dataArr
        let calNum = {}
        let tmp = window.currentSelectionChannel
        if (tmp === 'NDVI' && !self.NDVI) {
          let max = -1
          let min = 1000
          self.NDVI = true
          for (let i = 0; i < dataArr.length; i++) {
            for (let r = 0; r < 651; r++) {
              for (let c = 0; c < 651; c++) {
                let b4 = dataArr[ i ][ r ][ c ][ 3 ]
                let b3 = dataArr[ i ][ r ][ c ][ 2 ]
                let v = 0
                if (b4 + b3 !== 0) {
                  v = (b4 - b3) / (b4 + b3)
                }
                dataArr[ i ][ r ][ c ].push(v)
                max = Math.max(v, max)
                min = Math.min(v, min)
              }
            }
          }
          console.log(max, min)
          for (let i = 0; i < dataArr.length; i++) {
            for (let r = 0; r < 651; r++) {
              for (let c = 0; c < 651; c++) {
                let v = dataArr[ i ][ r ][ c ][ 6 ]
                dataArr[ i ][ r ][ c ][ 6 ] = parseInt((v - min) / (max - min) * 255)
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
        self.xScale.domain([ 0, 256 ])
        self.yScale.domain([ 0, d3.max(allData, function (data1) {
          return d3.max(data1, function (data2) {
            return d3.max(data2, function (d) {
              return self.barHeight(d.num)
            })
          })
        }) ])
        for (let i = 0; i < allData.length; i++) {
          self.init('#timeline' + (i + 1), allData[ i ], i)
        }
        this.allData = allData
        this.updateLine('#timelineRight')
      },
      barHeight (num) {
        return Math.sqrt(num)
      },
      updateLine (panelSelector) {
        let type = this.selectedCmp
        let allData = this.allData
        let diffs = []
        let len = allData.length
//        if (type === 'Near') {
//          for (let i = 0; i < len - 1; i++) {
//            diffs.push({ 'start': i, 'end': i + 1, 'value': this.calDiff(allData[ i ], allData[ i + 1 ]) })
//          }
//        } else if (type === 'Year') {
//          for (let i = 0; i + 4 < len; i++) {
//            diffs.push({ 'start': i, 'end': i + 4, 'value': this.calDiff(allData[ i ], allData[ i + 4 ]) })
//          }
//        } else if (type === 'Random') {
//          for (let i = 0; i < len; i++) {
//            for (let j = i + 1; j < len; j++) {
//              diffs.push({ 'start': i, 'end': j, 'value': this.calDiff(allData[ i ], allData[ j ]) })
//            }
//          }
//        }
        let channels = this.currentChannels
        let allChannels = this.allChannels
        let points = this.points
        if (type === 'Near') {
          for (let i = 0; i < len - 1; i++) {
            let v = 0
            for (let k = 0; k < channels.length; k++) {
              v += this.calImageDifferenceByAbs(i, i + 1, allChannels.indexOf(channels[ k ]), points)
            }
            diffs.push({ 'start': i, 'end': i + 1, 'value': v })
          }
        } else if (type === 'Year') {
          for (let i = 0; i + 4 < len; i++) {
            let v = 0
            for (let k = 0; k < channels.length; k++) {
              v += this.calImageDifferenceByAbs(i, i + 4, allChannels.indexOf(channels[ k ]), points)
            }
            diffs.push({ 'start': i, 'end': i + 4, 'value': v })
          }
        } else if (type === 'Random') {
          for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
              let v = 0
              for (let k = 0; k < channels.length; k++) {
                v += this.calImageDifferenceByAbs(i, j, allChannels.indexOf(channels[ k ]), points)
              }
              diffs.push({ 'start': i, 'end': j, 'value': v })
            }
          }
        }
        diffs.sort(function (a, b) {
          return b.value - a.value
        })
        console.log(diffs)
        this.updateLink(diffs, panelSelector)
      },
      updateLink (diffs, panelSelector) {
        let self = this
        $(panelSelector).empty()
        let d3 = require('../../../plugins/d3v3.min.js')
        let width = $(panelSelector).width()
        let height = $(panelSelector).height()
        let H = height / 12
        let svg = d3.select('#timelineRight')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
        let barW = width * 0.2
        let ratio = 0.6
        let barH = H * ratio
        let xc = width / 1.5
        let lineFunction = d3.svg.line()
          .x(function (d) { return d[0] })
          .y(function (d) { return d[1] })
          .interpolate('linear')
//        for (let i = 0; i < diffs.length; i++) {
//          svg.append('rect')
//            .attr('x', xc - barW / 2)
//            .attr('width', barW)
//            .attr('y', H / 2 + i * H + (1 - ratio) / 2 * H)
//            .attr('height', barH)
//            .style('fill', 'gray')
//            .attr('id', 'rect' + i)
//            .on('mouseover', function () {
//              $('.linkline').css('display', 'none')
//              let id = $(this).attr('id')[ 4 ]
//              $('#pathu' + id).css('display', 'block')
//              $('#pathd' + id).css('display', 'block')
//            })
//            .on('mouseout', function () {
//              $('.linkline').css('display', 'block')
//            })
//          let points = []
//          let x0 = 0
//          let x1 = xc
//          let y0 = i * H + H / 2
//          let y1 = i * H + H / 2 + (1 - ratio) / 2 * H
//          points.push([ x0, y0 ], [ x1, y0 ], [ x1, y1 ])
//          svg.append('path')
//            .style('fill', 'none')
//            .style('stroke-width', '1px')
//            .style('stroke', 'gray')
//            .attr('d', lineFunction(points))
//            .attr('class', 'linkline')
//            .attr('id', 'pathu' + i)
//          y0 = (i + 1) * H + H / 2
//          y1 = (i + 1) * H + H / 2 - (1 - ratio) / 2 * H
//          points = []
//          points.push([ x0, y0 ], [ x1, y0 ], [ x1, y1 ])
//          svg.append('path')
//            .style('fill', 'none')
//            .style('stroke-width', '1px')
//            .style('stroke', 'gray')
//            .attr('d', lineFunction(points))
//            .attr('class', 'linkline')
//            .attr('id', 'pathd' + i)
//        }
        let dmax = d3.max(diffs, function (d) {
          return d.value
        })
        let opacity = 0.8
        for (let i = 0; i < diffs.length && i < 12; i++) {
          let h = diffs[ i ].value / dmax
          svg.append('rect')
            .attr('x', xc - barW / 2)
            .attr('width', barW)
            .attr('y', H / 2 - barH / 2 + i * H)
            .attr('height', barH * (1 - h))
            .style('fill', 'white')
            .attr('id', 'wrect' + i)
            .attr('class', 'rectBar' + ' rect' + i)
            .on('mouseover', function () {
              $('.linkline').css('display', 'none')
              let id = $(this).attr('id').split('ect')[ 1 ]
              $('#pathu' + id).css('display', 'block')
              $('#pathd' + id).css('display', 'block')
              let start = diffs[ id ].start
              let end = diffs[ id ].end
              if (self.features) { // 防止为空
                let imageName1 = self.features[ 'featureChannel' ] + '_' + config.date[ start ]
                let imageName2 = self.features[ 'featureChannel' ] + '_' + config.date[ end ]
                self.transFeatures({'featureName': self.features[ 'featureName' ], 'imageName1': imageName1, 'imageName2': imageName2, 'type': 'mouseover'})
              }
            })
            .on('mouseout', function () {
              $('.linkline').css('display', 'none')
              let id = self.id
              $('#pathu' + id).css('display', 'block')
              $('#pathd' + id).css('display', 'block')
            })
            .style('stroke', 'gray')
            .style('stroke-opacity', opacity)
            .on('click', function () {
              let id = +$(this).attr('id').split('ect')[ 1 ]
              self.id = id
              let start = diffs[ id ].start
              let end = diffs[ id ].end
              let imageName1 = self.features[ 'featureChannel' ] + '_' + config.date[ start ]
              let imageName2 = self.features[ 'featureChannel' ] + '_' + config.date[ end ]
              $('.mask').css('display', 'none')
              $('#mask' + id).css('display', 'block')
              self.transFeatures({
                'featureName': self.features[ 'featureName' ], 'imageName1': imageName1, 'imageName2': imageName2, 'type': 'click'
              })
            })
          svg.append('rect')
            .attr('x', xc - barW / 2)
            .attr('width', barW)
            .attr('y', H / 2 - barH / 2 + i * H + barH * (1 - h))
            .attr('height', barH * h)
            .style('fill', 'gray')
            .attr('id', 'brect' + i)
            .style('opacity', opacity)
            .attr('class', 'rectBar' + ' rect' + i)
            .on('mouseout', function () {
              $('.linkline').css('display', 'none')
              let id = self.id
              $('#pathu' + id).css('display', 'block')
              $('#pathd' + id).css('display', 'block')
            })
            .on('mouseover', function () {
              $('.linkline').css('display', 'none')
              let id = $(this).attr('id').split('ect')[ 1 ]
              $('#pathu' + id).css('display', 'block')
              $('#pathd' + id).css('display', 'block')
              let start = diffs[ id ].start
              let end = diffs[ id ].end
              let imageName1 = self.features[ 'featureChannel' ] + '_' + config.date[ start ]
              let imageName2 = self.features[ 'featureChannel' ] + '_' + config.date[ end ]
              self.transFeatures({
                'featureName': self.features[ 'featureName' ], 'imageName1': imageName1, 'imageName2': imageName2, 'type': 'mouseover'
              })
            })
            .style('stroke', 'gray')
            .on('click', function () {
              let id = +$(this).attr('id').split('ect')[ 1 ]
              self.id = id
              let start = diffs[ id ].start
              let end = diffs[ id ].end
              let imageName1 = self.features[ 'featureChannel' ] + '_' + config.date[ start ]
              let imageName2 = self.features[ 'featureChannel' ] + '_' + config.date[ end ]
              $('.mask').css('display', 'none')
              $('#mask' + id).css('display', 'block')
//              d3.selectAll('.rectBar').style('stroke', 'gray')
//              d3.selectAll('.rect' + id).style('stroke', 'black')
              self.transFeatures({
                'featureName': self.features[ 'featureName' ], 'imageName1': imageName1, 'imageName2': imageName2, 'type': 'click'
              })
            })
          svg.append('rect')
            .attr('x', xc - barW / 2)
            .attr('width', barW)
            .attr('y', H / 2 - barH / 2 + i * H)
            .attr('height', barH)
            .attr('id', 'mask' + i)
            .attr('class', 'mask')
            .style('fill', 'none')
            .style('stroke-width', '2')
            .style('stroke', 'black')
            .attr('display', 'none')
          let start = +diffs[ i ].start
          let points = []
          let x0 = 0
          let x2 = xc
          let x1 = (x0 + x2) / 2
          let y0 = start * H + H / 2
          let y1 = i * H + (1 - ratio) / 2 / 2 * H
          let y2 = i * H + (1 - ratio) / 2 * H
          points.push([ x0, y0 ], [ x1, y0 ], [ x1, y1 ], [ x2, y1 ], [ x2, y2 ])
          svg.append('path')
            .style('fill', 'none')
            .style('stroke-width', '1px')
            .style('stroke', 'gray')
            .attr('d', lineFunction(points))
            .attr('class', 'linkline')
            .attr('id', 'pathu' + i)
          let end = +diffs[ i ].end
          x1 = (x0 + x2) / 1.5
          y0 = end * H + H / 2
          y1 = (i + 1) * H - (1 - ratio) / 2 / 2 * H
          y2 = (i + 1) * H - (1 - ratio) / 2 * H
          points = []
          points.push([ x0, y0 ], [ x1, y0 ], [ x1, y1 ], [ x2, y1 ], [ x2, y2 ])
          svg.append('path')
            .style('fill', 'none')
            .style('stroke-width', '1px')
            .style('stroke', 'gray')
            .attr('d', lineFunction(points))
            .attr('class', 'linkline')
            .attr('id', 'pathd' + i)
          if (i === 0) {
            self.id = 0
            $('#pathu' + i).css('display', 'block')
            $('#pathd' + i).css('display', 'block')
            $('#mask' + i).css('display', 'block')
            let start = diffs[ 0 ].start
            let end = diffs[ 0 ].end
            console.log('features', self.features)
            if (self.features) {
              let imageName1 = self.features[ 'featureChannel' ] + '_' + config.date[ start ]
              let imageName2 = self.features[ 'featureChannel' ] + '_' + config.date[ end ]
              self.transFeatures({
                'featureName': self.features[ 'featureName' ], 'imageName1': imageName1, 'imageName2': imageName2, 'type': 'click'
              })
            }
          } else {
            $('#pathu' + i).css('display', 'none')
            $('#pathd' + i).css('display', 'none')
          }
        }
      },
      calDiff (data1, data2) {
        let diff = 0
        for (let i = 0; i < data1.length; i++) {
          let d1 = data1[ i ]
          let d2 = data2[ i ]
          let len = d1.length
          for (let j = 0; j < len; j++) {
            diff += Math.abs((d1[ j ][ 'num' ] - d2[ j ][ 'num' ]))
          }
        }
        return diff
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
        return diff / pLen
      }
    },
    ready () {
      let self = this
      $('#compareSelect').change(function () {
        var p1 = $(this).children('option:selected').val()
        console.log(p1)
        if (p1 !== self.selectedCmp) {
          self.selectedCmp = p1
          self.updateLine('#timelineRight')
        }
      })
    }
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
  #distribution {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 90%;
  }
  #pannel {
    position: absolute;
    bottom: 3.5%;
    height: 20px;
    left: 0;
    width: 70%;
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