<template>
    <div class="list-view-main" id="iconList">
    </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize, featureColors} from '../../vuex/getters'
  import config from '../../commons/config'
  let d3 = window.d3
  export default {
    vuex: {
      getters: {pageSize, featureColors}
    },
    props: [ 'features' ],
    data () {
      return {}
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
      },
      featureColors: {
        handler (curVal, oldVal) {
          this.update(this.featureColors)
        },
        deep: true
      }
    },
    methods: {
      init () {
        console.log(config)
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
          .style('fill', config.burnt)
        svg.append('text')
          .text('Burnt')
          .attr('font-size', config.emSize * 0.8)
          .attr('x', width * leftR)
          .attr('y', height * vRatio + 20)
          .attr('text-anchor', 'middle')
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', height * vRatio * 3)
          .attr('r', r)
          .style('fill', config.flood)
        svg.append('text')
          .text('Flood')
          .attr('font-size', config.emSize * 0.8)
          .attr('x', width * leftR)
          .attr('y', height * vRatio * 3 + 20)
          .attr('text-anchor', 'middle')
        let g = svg.append('g')
        let features = config.defaultFeatures
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
          .attr('font-size', config.emSize * 0.8)
          .text(function (d, i) {
            return d[0]
          })
          .attr('text-anchor', 'middle')
      },
      update (featureColors) {
        for (let feature in featureColors) {
          d3.select('#' + feature)
            .style('fill', featureColors[ feature ])
        }
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