import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutations'
import frame from 'FRAME'

Vue.use(Vuex)
// 在Vue实例中通过this.vxMutations进行使用
frame.vueInstall({ module: 'vx', name: 'mutations' }, types)

const state = {}

const mutations = {}

export default new Vuex.Store({
  strict: true,
  state,
  mutations
})
