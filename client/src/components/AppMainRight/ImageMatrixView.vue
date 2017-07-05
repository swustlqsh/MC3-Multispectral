<template>
  <div class="uk-grid image-matrix-view">
    <div class="uk-width-1-1">
      <nav class="tm-navbar uk-navbar uk-navbar-attached">
        <div class="uk-container uk-container-center">
        </div>
      </nav>
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
  .image-matrix-view {
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