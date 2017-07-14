<template>
  <div class="event-view-main" id="eventList">
  </div>
</template>
<script>
  //  import d3 from 'd3'
  import $ from 'jquery'
  import {pageSize, event} from '../../vuex/getters'
  import {highlightEvent} from '../../vuex/actions'
  import config from '../../commons/config'
  export default {
    vuex: {
      getters: { pageSize, event },
      actions: {
        highlightEvent
      }
    },
    props: [ 'detectedEvent' ],
    data () {
      return {
        eventList: [],
        eventNum: 0,
        colors: { 'Burnt': 'red', 'Flood': '#2b8cbe' }
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
        let padding = { top: 5, left: 20, right: 5, bottom: 2 }
        this.eventNum = 0
        padding.left = config.emSize * 1.2
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
        let years = [ 2014, 2015, 2016 ]
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
          .attr('y', padding.top)
          .attr('font-size', config.emSize)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'hanging')
        this.svgL.append('line')
          .attr('x1', padding.left)
          .attr('y1', padding.top + config.emSize)
          .attr('x2', this.svgLWidth - padding.right)
          .attr('y2', padding.top + config.emSize)
          .style('stroke', 'grey')
          .attr('class', 'listLine')
          .attr('stroke-width', '1px')
      },
      highlightEventLinkHandler (eventId) {
        let self = this
        console.log('highlightEventLinkHandler')
        self.highlightEvent({ 'eventId': eventId, 'type': 'hover' })
      },
      selectEventLinkHandler (eventId) {
        let self = this
        self.highlightEvent({ 'eventId': eventId, 'type': 'click' })
      },
      addEvent (event) {
//        let detectedEvent = this.detectedEvent
//        console.log(event.comments, event.type)
        let self = this
        let d3 = window.d3
        let eventNum = this.eventNum
        let rectValue = this.rectValue
        let padding = this.padding
        let svg = this.svgL
        let height = this.height
        let top = padding.top + config.emSize
        let colors = this.colors
        if (eventNum * rectValue > height - padding.top * 2) {
          let height = $('#eSvg').height()
          d3.select('#eSvg').attr('height', height + rectValue)
        }
        svg.append('line')
          .attr('x1', padding.left)
          .attr('y1', (eventNum + 1) * rectValue + top)
          .attr('x2', this.svgLWidth - padding.right)
          .attr('y2', (eventNum + 1) * rectValue + top)
          .attr('class', 'listLine')
          .style('stroke', 'grey')
          .attr('stroke-width', '1px')
        let eventIndex = this.eventNum + 1
        svg.append('text')
          .text(eventIndex)
          .attr('id', 'event-' + eventIndex)
          .attr('class', 'event-label')
          .attr('x', padding.left - 2)
          .attr('y', top + eventNum * rectValue + rectValue / 2)
          .attr('alignment-baseline', 'middle')
          .attr('text-anchor', 'end')
          .attr('font-size', config.emSize)
          .attr('cursor', 'pointer')
          .attr('fill', colors[ event.type ])
          .on('mouseover', function (d, i) {
            let eventId = d3.select(this).attr('id')
            let encodeColor = d3.select('.event-rect#' + eventId).attr('fill')
            let rectHeight = d3.select('.event-rect#' + eventId).attr('height')
            let strokeWidth = rectHeight / 7
            d3.select(this).classed('mouseover-highlight', true)
            d3.select('.event-rect#' + eventId).style('stroke', encodeColor).attr('stroke-width', strokeWidth + 'px')
            self.highlightEventLinkHandler(eventId)
          })
          .on('mouseout', function (d, i) {
            let eventId = d3.select(this).attr('id')
            if (!d3.select(this).classed('selection-highlight')) {
              d3.select('.event-rect#' + eventId).attr('stroke-width', '0px')
              d3.select(this).classed('mouseover-highlight', false)
              self.highlightEventLinkHandler('null')
            }
          })
          .on('click', function (d, i) {
            let eventId = d3.select(this).attr('id')
            let encodeColor = d3.select('.event-rect#' + eventId).attr('fill')
            let rectHeight = d3.select('.event-rect#' + eventId).attr('height')
            let strokeWidth = rectHeight / 7
            if (d3.select(this).classed('selection-highlight')) {
              d3.select('.event-rect#' + eventId).attr('stroke-width', '0px')
              d3.select(this).classed('selection-highlight', false)
              self.selectEventLinkHandler('null')
            } else {
              d3.selectAll('.event-rect').attr('stroke-width', '0px')
              d3.selectAll('selection-highlight').classed('selection-highlight', false)
              d3.select(this).classed('selection-highlight', true)
              d3.select('.event-rect#' + eventId).style('stroke', encodeColor).attr('stroke-width', strokeWidth + 'px')
              self.selectEventLinkHandler(eventId)
            }
          })
        for (let i = 0; i < 13; i++) {
          svg.append('line')
            .attr('x1', i * rectValue + padding.left)
            .attr('x2', i * rectValue + padding.left)
            .attr('y1', eventNum * rectValue + top)
            .attr('y2', (eventNum + 1) * rectValue + top)
            .style('stroke', 'grey')
            .attr('stroke-width', '1px')
        }
        let startT = 3
        let endT = 5
        svg.append('rect')
          .attr('class', 'event-rect')
          .attr('id', 'event-' + eventIndex)
          .attr('x', startT * rectValue + padding.left)
          .attr('y', eventNum * rectValue + top)
          .attr('width', rectValue * (endT - startT))
          .attr('height', rectValue)
          .attr('fill', colors[ event.type ])
          .on('mouseover', function (d, i) {
            let eventId = d3.select(this).attr('id')
            let encodeColor = d3.select(this).attr('fill')
            let rectHeight = d3.select(this).attr('height')
            let strokeWidth = rectHeight / 7
            d3.select('.event-label#' + eventId).classed('mouseover-highlight', true)
            d3.select(this).style('stroke', encodeColor).attr('stroke-width', strokeWidth + 'px')
            self.highlightEventLinkHandler(eventId)
          })
          .on('mouseout', function (d, i) {
            let eventId = d3.select(this).attr('id')
            if (!d3.select(this).classed('selection-highlight')) {
              d3.select('.event-label#' + eventId).classed('mouseover-highlight', false)
              d3.select(this).attr('stroke-width', '0px')
              self.highlightEventLinkHandler('null')
            }
          })
          .on('click', function (d, i) {
            let eventId = d3.select(this).attr('id')
            let encodeColor = d3.select('.event-rect#' + eventId).attr('fill')
            let rectHeight = d3.select('.event-rect#' + eventId).attr('height')
            let strokeWidth = rectHeight / 7
            if (d3.select(this).classed('selection-highlight')) {
              d3.select('.event-rect#' + eventId).attr('stroke-width', '0px')
              d3.select(this).classed('selection-highlight', false)
              self.selectEventLinkHandler('null')
            } else {
              d3.selectAll('.event-rect').attr('stroke-width', '0px')
              d3.selectAll('selection-highlight').classed('selection-highlight', false)
              d3.select(this).classed('selection-highlight', true)
              d3.select('.event-rect#' + eventId).style('stroke', encodeColor).attr('stroke-width', strokeWidth + 'px')
              self.selectEventLinkHandler(eventId)
            }
          })
          .append('title')
          .text(event.comments)
        this.eventNum += 1
      }
    },
    ready () {
    }
  }
</script>
<style>
  .event-view-main {
    /*border: 1px solid gray;*/
    padding: 2px 1px;
  }
  .listLine {
    stroke: gray;
    stroke-width: 1px;
  }
  .event-label[class~=mouseover-highlight] {
    font-size: 1.2em;
  }
  .event-label[class~=selection-highlight] {
    font-size: 1.2em;
  }
</style>