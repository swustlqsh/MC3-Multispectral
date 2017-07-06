<template>
    <div id="App">
        <app-header></app-header>
        <app-main></app-main>
    </div>
</template>
<script>
import {getPageSize} from './commons/utils'
import AppHeader from './components/AppHeader.vue'
import AppMain from './components/AppMain.vue'
import {updatePageSize} from 'VUEX/actions'
import {pageWidth} from 'VUEX/getters'
export default {
  vuex: {
    actions: {updatePageSize},
    getters: {pageWidth}
  },
  data () {
    return {
      timer: false
    }
  },
  watch: {
    pageWidth (now) {
      console.log('now', now)
    }
  },
  components: {AppHeader, AppMain},
  ready () {
    const that = this
    let pageSize = getPageSize()
    that.updatePageSize(pageSize.width, pageSize.height)
    window.onresize = () => {
      return (() => {
        if (!that.timer) {
          that.timer = true
          setTimeout(() => {
            let pageSize = getPageSize()
            that.updatePageSize(pageSize.width, pageSize.height)
            console.log(that.pageWidth, 'that')
            that.timer = false
          }, 400)
        }
      })()
    }
  }
}
</script>
<style lang="less" scoped>
    @import "./App.less";
</style>