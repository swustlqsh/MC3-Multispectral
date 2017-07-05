<template>
    <div class="event-view-main" id="eventList">
    </div>
</template>
<script>
  //  import d3 from 'd3'
  import $ from 'jquery'
  export default {
    props: [ 'detectedEvent' ],
    data () {
      return {
        eventList: [],
        eventNum: 0
      }
    },
    watch: {
      detectedEvent () {
        this.addEvent()
      }
    },
    methods: {
      init () {
        let width = $('#eventList').width()
        let height = $('#eventList').height()
        let d3 = window.d3
        let ratio = 0.8
        let padding = {top: 2, left: 2, right: 2, bottom: 2}
        let svgL = d3.select('#eventList').append('svg').attr('width', width * ratio).attr('height', height)
          .attr('id', 'eSvg')
        let svgP = d3.select('#eventList').append('svg').attr('width', width * (1 - ratio)).attr('height', height)
          .attr('id', 'pSvg')
//          .attr('transform', 'translate(' + (width * ratio) + ',0)') // parameter
        this.width = width
        this.height = height
        this.svgL = svgL
        this.svgP = svgP
        this.rectValue = (width * ratio - padding.left - padding.right) / 12
        this.svgLWidth = width * ratio
        this.padding = padding
        this.svgL.append('line')
          .attr('x1', padding.left)
          .attr('y1', padding.top)
          .attr('x2', this.svgLWidth - padding.right)
          .attr('y2', padding.top)
          .style('stroke', 'grey')
          .attr('class', 'listLine')
          .attr('stroke-width', '1px')
      },
      addEvent () {
//        let detectedEvent = this.detectedEvent
        let eventNum = this.eventNum
        let rectValue = this.rectValue
        let padding = this.padding
        let svg = this.svgL
        svg.append('line')
          .attr('x1', padding.left)
          .attr('y1', (eventNum + 1) * rectValue + padding.top)
          .attr('x2', this.svgLWidth - padding.right)
          .attr('y2', (eventNum + 1) * rectValue + padding.top)
          .attr('class', 'listLine')
          .style('stroke', 'grey')
          .attr('stroke-width', '1px')
        for (let i = 0; i < 13; i++) {
          svg.append('line')
            .attr('x1', i * rectValue + padding.left)
            .attr('x2', i * rectValue + padding.left)
            .attr('y1', eventNum * rectValue + padding.top)
            .attr('y2', (eventNum + 1) * rectValue + padding.top)
            .style('stroke', 'grey')
            .attr('stroke-width', '1px')
        }
        this.eventNum += 1
      }
    },
    ready () {
      this.init()
      this.addEvent()
      this.addEvent()
    }
  }
</script>
<style lang="less" scoped>
  .event-view-main {
    border: 1px solid gray;
    padding: 2px 1px;
    height: 500px;
}
  .listLine {
    stroke: gray;
    stroke-width: 1px;
}
</style>