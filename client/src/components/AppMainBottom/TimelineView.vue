<template>
    <div id = 'timeLine'></div>
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
            this.init()
          }
          this.load = true
        },
        deep: true
      }
    },
    methods: {
      init () {
        this.drawTimelineView()
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
          .attr('y1', padding.top + height / 3)
          .attr('x2', width - padding.right)
          .attr('y2', padding.top + height / 3)
          .style('stroke', 'grey')
          .style('stroke-width', '2px')
          .attr('marker-end', 'url(#arrow)')
        let years = [2014, 2015, 2016]
        let sw = (width - padding.left - padding.right) / 3
        years.forEach(function (d, i) {
          svg.append('text')
            .attr('y', padding.top + height / 3 + height / 2.2)
            .attr('x', sw * i + sw / 2 + padding.left)
            .text(d)
            .attr('font-size', '1em')
        })
      }
    },
    ready () {
//      this.init()
    }
  }
</script>
<style lang="less" scoped>
  #timeLine {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>