<template>
<div id="App" 
    class="animated"
    namespace="App"
    transition="fadeUD"
    v-show="show">
    <h1>{{ message }}</h1>
    <ul>
        <li v-for="item in links"
            class="animated"
            transition="zoomDU"
            stagger="1000">
            <a href="{{ item.url }}" target="_blank">
                {{ item.text }}
            </a>
        </li>
    </ul>
    <label>Input</label>
    <input type="text"
      v-model="keyword"
      v-check="keyword"
      check-method="isRangeLen"
      check-result="keywordCk"
      :check-params="[8, 20]"
      >
    {{ keywordCk }}
</div>
</template>
<script>
import '../commons/base.less'

export default{
  data () {
    return {
      message: 'Hello World :)',
      show: false,
      links: [],
      keyword: null,
      keywordCk: null
    }
  },
  methods: {
    transitionAppBeforeEnter () {
      this.$fLogs.log('[App]transitionBeforeEnter')
    }
  },
  ready () {
    this.show = true
    this.links = [ {
      url: 'https://confluence.b.360.cn/pages/viewpage.action?pageId=10092607',
      text: '教程'
    }, {
      url: 'http://10.95.24.22:5011/package/@qnpm/skyfenv',
      text: 'skyfenv'
    }, {
      url: '/mochatest/index',
      text: 'Mocha单元测试'
    } ]
    this.$fLogs.info('[APP]HelloWorld is ready !!!')
  }
}
</script>
<style lang="less" scoped>
@import "../commons/base.vars.less";
#App {
  margin: 0 auto;
  padding: 100px 200px;
  a {
    color: orange;
  }
}
</style>