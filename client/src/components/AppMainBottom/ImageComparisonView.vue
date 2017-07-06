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
    border: 1px solid #faa732;
  }
  #imageCompare {
    width: 66.7%;
    height: 90%;
    border: 1px solid #faa732;
  }
  #statistics {
    position: absolute;
    top: 10%;
    left: 66.7%;
    width: 33.3%;
    height: 90%;
    border: 1px solid #faa732;
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
    border: 1px solid #faa732;
  }
</style>