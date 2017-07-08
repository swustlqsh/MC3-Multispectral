<template>
    <div class="event-view-main" id="eventList">
    </div>
</template>
<script>
  //  import d3 from 'd3'
  import $ from 'jquery'
  import {pageSize, event} from '../../vuex/getters'
  import config from '../../commons/config'
  export default {
    vuex: {
      getters: {pageSize, event}
    },
    props: [ 'detectedEvent' ],
    data () {
      return {
        eventList: [],
        eventNum: 0,
        colors: { 'Burnt': '#ef8a62', 'Flood': '#2b8cbe' }
      }
    },
    watch: {
      detectedEvent () {
        this.addEvent()
      },
      pageSize: {
        handler (curVal, oldVal) {
          this.init()
        },
        deep: true
      },
      event: {
        handler (curVal, oldVal) { // object
          this.addEvent(this.event)
        },
        deep: true
      }
    },
    methods: {
      init () {
        let width = $('#event-list').width()
        let height = $('#event-list').height()
        let d3 = window.d3
        let ratio = 1
        let padding = { top: 20, left: 20, right: 5, bottom: 2 }
        padding.top = config.emSize + 10
        this.eventNum = 0
        d3.select('#eventList').html('')
        let svgL = d3.select('#eventList').append('svg').attr('width', width * ratio).attr('height', height)
          .attr('id', 'eSvg')
        this.width = width
        this.height = height
        this.svgL = svgL
        let rectValue = this.rectValue = (width * ratio - padding.left - padding.right) / 12
        this.fontSize = this.rectValue / 2
        this.svgLWidth = width * ratio
        this.padding = padding
        let years = [2014, 2015, 2016]
        this.svgL.selectAll('text')
          .data(years)
          .enter()
          .append('text')
          .text(function (d) {
            return d
          })
          .attr('x', function (d, i) {
            return padding.left + rectValue * 2 + i * 4 * rectValue
          })
          .attr('y', padding.top / 2)
          .attr('font-size', config.emSize)
          .attr('text-anchor', 'middle')
        this.svgL.append('line')
          .attr('x1', padding.left)
          .attr('y1', padding.top)
          .attr('x2', this.svgLWidth - padding.right)
          .attr('y2', padding.top)
          .style('stroke', 'grey')
          .attr('class', 'listLine')
          .attr('stroke-width', '1px')
      },
      addEvent (event) {
//        let detectedEvent = this.detectedEvent
//        console.log(event.comments, event.type)
        let d3 = window.d3
        let eventNum = this.eventNum
        let rectValue = this.rectValue
        let padding = this.padding
        let svg = this.svgL
        let height = this.height
        if (eventNum * rectValue > height - padding.top * 2) {
          let height = $('#eSvg').height()
          d3.select('#eSvg').attr('height', height + rectValue)
        }
        svg.append('line')
          .attr('x1', padding.left)
          .attr('y1', (eventNum + 1) * rectValue + padding.top)
          .attr('x2', this.svgLWidth - padding.right)
          .attr('y2', (eventNum + 1) * rectValue + padding.top)
          .attr('class', 'listLine')
          .style('stroke', 'grey')
          .attr('stroke-width', '1px')
        svg.append('text')
          .text(this.eventNum + 1)
          .attr('x', padding.left / 2)
          .attr('y', padding.top + eventNum * rectValue + rectValue / 2 + config.emSize / 2)
          .attr('text-anchor', 'middle')
          .attr('font-size', config.emSize)
//          .attr('alignment-baseline', 'middle')
        for (let i = 0; i < 13; i++) {
          svg.append('line')
            .attr('x1', i * rectValue + padding.left)
            .attr('x2', i * rectValue + padding.left)
            .attr('y1', eventNum * rectValue + padding.top)
            .attr('y2', (eventNum + 1) * rectValue + padding.top)
            .style('stroke', 'grey')
            .attr('stroke-width', '1px')
        }
        let startT = 3
        let endT = 5
        let colors = this.colors
        svg.append('rect')
          .attr('x', startT * rectValue + padding.left)
          .attr('y', eventNum * rectValue + padding.top)
          .attr('width', rectValue * (endT - startT))
          .attr('height', rectValue)
          .style('fill', colors[ event.type ])
          .append('title')
          .text(event.comments)
        this.eventNum += 1
      }
    },
    ready () {
    }
  }
</script>
<style lang="less" scoped>
  .event-view-main {
    /*border: 1px solid gray;*/
    padding: 2px 1px;
  }
  .listLine {
    stroke: gray;
    stroke-width: 1px;
  }
</style>