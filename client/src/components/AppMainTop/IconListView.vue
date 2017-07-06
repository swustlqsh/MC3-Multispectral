<template>
    <div class="list-view-main" id="iconList">
    </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize} from '../../vuex/getters'
  export default {
    vuex: {
      getters: {pageSize}
    },
    props: [ 'features' ],
    data () {
      return {
        burnt: '#ef8a62',
        flood: '#2b8cbe',
        defaultFeatures: [
          ['Moun', 'orange'],
          ['Rode', '#D6E2D7'],
          ['Lake', 'blue'],
          ['City', 'gray']
        ]
      }
    },
    watch: {
      iconUpdate () {
        let svg = this.svg
        this.features.forEach(function (d, i) {
          svg.select('#' + d[0])
            .style('fill', d[1])
        })
      },
      pageSize: {
        handler (curVal, oldVal) {
          this.init()
        },
        deep: true
      }
    },
    methods: {
      init () {
        let width = $('#icon-list').width()
        let height = $('#icon-list').height()
        let d3 = window.d3
        let padding = { top: 2, left: 20, right: 2, bottom: 2 }
        d3.select('#iconList').html('')
        let svg = d3.select('#iconList').append('svg').attr('width', width).attr('height', height)
          .attr('id', 'iconSvg')
        let r = width * 0.12
        this.width = width
        this.height = height
        this.svg = svg
        this.padding = padding
        let vRatio = 0.08
        let leftR = 0.2
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', height * vRatio)
          .attr('r', r)
          .style('fill', this.burnt)
        svg.append('text')
          .text('Burnt')
          .attr('font-size', '10')
          .attr('x', width * leftR)
          .attr('y', height * vRatio + 20)
          .attr('text-anchor', 'middle')
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', height * vRatio * 3)
          .attr('r', r)
          .style('fill', this.flood)
        svg.append('text')
          .text('Flood')
          .attr('font-size', '10')
          .attr('x', width * leftR)
          .attr('y', height * vRatio * 3 + 20)
          .attr('text-anchor', 'middle')
        let g = svg.append('g')
        let features = this.defaultFeatures
        let leftR2 = 0.8
        g.selectAll('circle')
          .data(features)
          .enter()
          .append('circle')
          .attr('cx', width * leftR2)
          .attr('cy', function (d, i) {
            return height * vRatio * (i * 2 + 1)
          })
          .attr('r', r)
          .style('fill', function (d, i) {
            return d[1]
          })
          .attr('id', function (d, i) {
            return d[0]
          })
        g.selectAll('text')
          .data(features)
          .enter()
          .append('text')
          .attr('x', width * leftR2)
          .attr('y', function (d, i) {
            return height * vRatio * (i * 2 + 1) + 20
          })
          .attr('font-size', '10')
          .text(function (d, i) {
            return d[0]
          })
          .attr('text-anchor', 'middle')
      },
      add () {
        console.log('sxxx')
      }
    },
    ready () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .list-view-main {
    color: gray;
  }
</style>