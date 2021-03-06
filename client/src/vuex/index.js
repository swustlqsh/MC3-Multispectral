import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/logger'
import * as types from './mutations'
import frame from 'FRAME'

// module mutations
import pageLayoutMutations from './pageLayout/mutations'
import eventSubmitMutations from './eventSubmit/mutations'
import imgCompareMutations from './imgCompare/mutations'
import colorDistributionMutations from './colorDistribution/mutations'
import selectionMutations from './selection/mutations'
import imageToTaggedMutations from './imageToTaggedView/mutations'
import addFeaturesMutations from './addFeatures/mutations'
import transFeaturesMutations from './transFeatures/mutations'
import changeIconListMutations from './changeIconList/mutations'
import highlightEventMutations from './highlightEvent/mutations'
Vue.use(Vuex)
// 在Vue实例中通过this.vxMutations进行使用
frame.vueInstall({ module: 'vx', name: 'mutations' }, types)

const state = {
  pageWidth: 0,
  pageHeight: 0,
  event: {},
  comparedMessage: {},
  selections: {},
  lassoArea: [],
  featureColors: [],
  pageSize: {
    pageWidth: 0,
    pageHeight: 0
  },
  selectedImage: {},
  addedFeatures: {},
  transedFeatures: {},
  hoveringEvent: {}
}

const mutations = Object.assign(
  {},
  pageLayoutMutations, eventSubmitMutations, imgCompareMutations, colorDistributionMutations, selectionMutations,
  changeIconListMutations, addFeaturesMutations, transFeaturesMutations, imageToTaggedMutations, highlightEventMutations)

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  plugins: [createLogger()]
})
