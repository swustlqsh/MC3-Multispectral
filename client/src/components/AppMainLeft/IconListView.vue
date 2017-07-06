<template>
    <div class="list-view-main" id="iconList">
    </div>
</template>
<script>
  import $ from 'jquery'
  export default {
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
      }
    },
    methods: {
      init () {
        let width = $('#iconList').width()
        let height = $('#iconList').height()
        let d3 = window.d3
        let padding = { top: 20, left: 20, right: 2, bottom: 2 }
        let svg = d3.select('#iconList').append('svg').attr('width', width).attr('height', height)
          .attr('id', 'iconSvg')
        let r = width * 0.1
        this.width = width
        this.height = height
        this.svg = svg
        this.padding = padding
        padding.top += r
        let vRatio = 0.15
        let leftR = 0.2
        let fontSize = '0.8em'
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', padding.top)
          .attr('r', r)
          .style('fill', this.burnt)
        svg.append('text')
          .text('Burnt')
          .attr('font-size', fontSize)
          .attr('x', width * leftR)
          .attr('y', 20 + padding.top)
          .attr('text-anchor', 'middle')
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', height * vRatio + padding.top)
          .attr('r', r)
          .style('fill', this.flood)
        svg.append('text')
          .text('Flood')
          .attr('font-size', fontSize)
          .attr('x', width * leftR)
          .attr('y', height * vRatio + 20 + padding.top)
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
            return height * vRatio * i + padding.top
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
            return height * vRatio * i + 20 + padding.top
          })
          .attr('font-size', fontSize)
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
    height: 100%;
    width: 100%;
  }
</style>