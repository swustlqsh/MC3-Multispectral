<template>
  <!-- header main -->
  <div class="header-wraper">
    <header class="header">
      <div class="container">
        <h1>{{messages}}</h1>
      </div>
    </header>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        messages: 'VAST Challenge 2017 MC3 Visualization Analysis System'
      }
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  .header-wraper {
    height: 30px;
    .header {
      position: relative;
      height: 30px;
      line-height: 30px;
      top: 0;
      left: 0;
      background-color: #324057;
      z-index: 100;
      h1 {
        color: #a4aebd;
        margin: 0;
        float: left;
        font-size: 15px;
        font-weight: 400;
        line-height: 30px;
      }
      .container {
        height: 100%;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 0 25px;
      }
    }
  }

</style>