import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/logger'
import * as types from './mutations'
import frame from 'FRAME'

// module mutations
import pageLayoutMutations from './pageLayout/mutations'

Vue.use(Vuex)
// 在Vue实例中通过this.vxMutations进行使用
frame.vueInstall({ module: 'vx', name: 'mutations' }, types)

const state = {
  pageWidth: 0,
  pageHeight: 0,
  pageSize: {
    pageWidth: 0,
    pageHeight: 0
  }
}

const mutations = Object.assign(
  {},
  pageLayoutMutations)

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  plugins: [createLogger()]
})
