<template>
    <div id = 'timeLine'></div>
    <div id = 'imageCompare'></div>
    <div id = 'statistics'>
        <div id = 'tagChannel'></div>
        <div id = 'submmit'>
            <div>
                Type
                <select style="margin-left: 20px" id = 'eventSelect'>
                    <option value="Flood">Flood</option>
                    <option value="Burnt">Burnt</option>
                    <option value="Shrink">Shrink</option>
                    <option value="Expand">Expand</option>
                </select>
            </div>
            <div style="margin-top: 20px">
                Description
            </div>
            <div>
                <textarea id = 'commentsText' rows="7" cols="30">
                </textarea>
            </div>
            <div style="text-align: center; margin-top: 20px">
                <button type="button" id="sbutton"> Submit </button>
            </div>
        </div>
    </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    data () {
      return {
        divName: 'image-comparison'
      }
    },
    watch: {},
    methods: {
      init () {
        $('#sbutton').click(function () {
          console.log($('#commentsText').val(), $('#eventSelect').val())
        })
        this.drawTimelineView()
      },
      drawTimelineView () {
        let d3 = window.d3
        let width = $('#timeLine').width()
        let height = $('#timeLine').height()
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
          .attr('y1', padding.top + height / 2)
          .attr('x2', width - padding.right)
          .attr('y2', padding.top + height / 2)
          .style('stroke', 'grey')
          .style('stroke-width', '2px')
          .attr('marker-end', 'url(#arrow)')
        let years = [2014, 2015, 2016]
        let sw = (width - padding.left - padding.right) / 3
        years.forEach(function (d, i) {
          svg.append('text')
            .attr('y', padding.top + height / 2 + 20)
            .attr('x', sw * i + sw / 2 + padding.left)
            .text(d)
            .attr('font-size', '1em')
        })
      },
      submmitComments () {
      }
    },
    ready () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  #timeLine {
    width: 100%;
    height: 10%;
  }
  #imageCompare {
    width: 66.7%;
    height: 90%;
    background-color: #2d7091;
  }
  #statistics {
    position: absolute;
    top: 10%;
    left: 66.7%;
    width: 33.3%;
    height: 90%;
    background-color: #8a6343;
  }
  #tagChannel {
    width: 50%;
    height: 50%;
  }
  #submmit {
    position: absolute;
    width: 50%;
    height: 50%;
    top: 50%;
    background-color: #659f13;
  }
</style>