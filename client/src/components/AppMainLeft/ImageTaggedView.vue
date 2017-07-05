<template>
  <div class="uk-grid image-tagged-view-main">
    <div class="uk-width-1-1">
      <nav class="tm-navbar uk-navbar uk-navbar-attached">
        <div class="uk-container uk-container-center">
          <ul class="uk-navbar-nav uk-hidden-small">
            <li><a href="#">点击</a></li>
            <li><a href="#">放大</a></li>
            <li><a href="#">缩小</a></li>
            <li><a href="#">平移</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="uk-width-1-1">
      <ul class="uk-list image-tagged-menu">
        <li>image-tagged-menu</li>
        <li>image-tagged-menu</li>
        <li>image-tagged-menu</li>
        <li>image-tagged-menu</li>
        <li>image-tagged-menu</li>
        <li>image-tagged-menu</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    ready () {}
  }
</script>
<style lang="less" scoped>
  .image-tagged-view-main {
    border: 1px solid gray;
    padding: 0 10px;
    .image-tagged-menu {
      background: gray;
      li {
        list-style: none;
        float: left;
      }
    }
  }
</style>