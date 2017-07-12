<template>
  <div class="list-view-main" id="iconList">
  </div>
</template>
<script>
  import $ from 'jquery'
  import {pageSize, selectedImage} from '../../vuex/getters'
  import config from '../../commons/config'
  let d3 = window.d3
  export default {
    vuex: {
      getters: { pageSize, selectedImage }
    },
    props: [ 'features' ],
    data () {
      return {}
    },
    watch: {
      iconUpdate () {
        let svg = this.svg
        this.features.forEach(function (d, i) {
          svg.select('#' + d[ 0 ])
            .style('fill', d[ 1 ])
        })
      },
      pageSize: {
        handler (curVal, oldVal) {
          this.init()
        },
        deep: true
      },
      selectedImage: {
        handler (curVal, oldVal) { // object
          //  接收到select image提取通道然后更新icon List
          console.log('iconListView selectedImage', this.selectedImage)
          let channels = this.selectedImage.split('_')[ 0 ]
          if (channels.length > 4) {
            this.updateFeaturesList(config.featureColors[channels])
          }
        },
        deep: true
      }
    },
    methods: {
      init () {
        console.log(config)
        let width = $('#icon-list').width()
        let height = $('#icon-list').height()
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
        this.vRatio = vRatio
        this.r = r
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', height * vRatio)
          .attr('r', r)
          .style('fill', config.burnt)
        svg.append('text')
          .text('Burnt')
          .attr('x', width * leftR)
          .attr('class', 'feature-name')
          .attr('y', height * vRatio + config.emSize * 1.5)
          .attr('text-anchor', 'middle')
        svg.append('circle')
          .attr('cx', width * leftR)
          .attr('cy', height * vRatio * 3)
          .attr('r', r)
          .style('fill', config.flood)
        svg.append('text')
          .text('Flood')
          .attr('x', width * leftR)
          .attr('class', 'feature-name')
          .attr('y', height * vRatio * 3 + config.emSize * 1.5)
          .attr('text-anchor', 'middle')
        let g = svg.append('g').attr('id', 'featureList')
        let features = config.defaultFeatures
        let leftR2 = 0.8
        this.leftR2 = leftR2
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
            return height * vRatio * (i * 2 + 1) + config.emSize * 1.5
          })
          .attr('class', 'feature-name')
          .text(function (d, i) {
            return d[0]
          })
          .attr('text-anchor', 'middle')
      },
      updateFeaturesList (colors) {
        let width = this.width
        let height = this.height
        let vRatio = this.vRatio
        let features = Object.keys(colors)
        let leftR2 = this.leftR2
        let r = this.r
        $('#featureList').empty()
        let g = d3.select('#featureList')
        console.log(features)
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
            return colors[ d ]
          })
          .attr('id', function (d, i) {
            return d
          })
        g.selectAll('text')
          .data(features)
          .enter()
          .append('text')
          .attr('x', width * leftR2)
          .attr('y', function (d, i) {
            return height * vRatio * (i * 2 + 1) + config.emSize * 1.5
          })
          .attr('class', 'feature-name')
          .text(function (d, i) {
            return d
          })
          .attr('text-anchor', 'middle')
      }
    },
    ready () {
      this.init()
    }
  }
</script>
<style>
  .list-view-main {
    color: gray;
  }
  .feature-name {
      font-size: 0.7em
  }
</style>