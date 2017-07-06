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
  import {pageSize} from '../../vuex/getters'
  export default {
    vuex: {
      getters: {pageSize}
    },
    data () {
      return {
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
              this.init('#timeline' + j, data)
            }
            this.updateLine('#timelineRight')
          }
          this.load = true
        },
        deep: true
      }
    },
    methods: {
      init (panelSelector, data) {
        let self = this
        let d3 = require('../../../plugins/d3v3.min.js')
        self.width = $(panelSelector).width()
        self.height = $(panelSelector).height()
        self.margin = { 'left': 10, 'right': 10, 'top': 10, 'bottom': 10 }
        self.width = self.width - self.margin.left - self.margin.right
        self.height = self.height - self.margin.top - self.margin.bottom
        self.xScale = d3.scale.linear().range([0, self.width])
        self.yScale = d3.scale.linear().range([self.height, 0])
        self.xAxis = d3.svg.axis()
                       .scale(self.xScale)
                       .orient('bottom')
                       .tickFormat(function (d, i) {
                         return ''
                       })
        self.yAxis = d3.svg.axis()
                       .scale(self.yScale)
                       .orient('left')
                       .tickFormat(function (d, i) {
                         return ''
                       })
                       .ticks(2)
        self.svg = d3.select(panelSelector)
            .append('svg')
            .attr('width', self.width + self.margin.left + self.margin.right)
            .attr('height', self.height + self.margin.top + self.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')')
        let timeMin = d3.min(data, function (d) { return d.time })
        let timeMax = d3.max(data, function (d) { return d.time }) + 1
        self.xScale.domain([timeMin, timeMax])
        self.yScale.domain([0, d3.max(data, function (d) { return d.num })])
        self.svg.append('g')
          .attr('class', 'curveAxis')
          .attr('transform', 'translate(0,' + self.height + ')')
          .call(self.xAxis)
        self.svg.append('g')
          .attr('class', 'curveAxis')
          .call(self.yAxis)
          .append('text')
        d3.selectAll('.curveAxis')
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', '0.5px')
        self.barWidth = self.width / data.length
        self.svg.selectAll('.arrbar')
          .data(data)
          .enter().append('rect')
          .attr('class', 'arrbarbot')
          .attr('x', function (d) { return self.xScale(d.time) })
          .attr('y', function (d) { return self.yScale(d.num) })
          .attr('width', self.barWidth * 0.95)
          .attr('height', function (d) { return self.height - self.yScale(d.num) })
          .style('fill', 'steelblue')
      },
      updateLine (panelSelector) {
        let d3 = require('../../../plugins/d3v3.min.js')
        let width = $(panelSelector).width()
        let height = $(panelSelector).height()
        let minHeight = height / 24
        let singleHeight = height / 12
        let minWidth = width / 5
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