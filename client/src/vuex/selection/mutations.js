/**
 * Created by liqiusheng@b.360.cn on 2017/7/8.
 */
import * as types from '../mutations'

export default {
  [types.CREATE_SELECTION] (state, imgId, data) {
    if (!state.selections.regions) {
      state.selections.regions = {}
    }
    if (state.selections.regions.hasOwnProperty(imgId)) {
      let data = state.selections.regions[imgId]
      let currentIndex = Object.keys(data.regions).length
      for (let tag in data.regions) {
        let newIndex = currentIndex + parseInt(tag)
        state.selections.regions[imgId].regions[newIndex] = data.regions[tag]
      }
    } else {
      state.selections.regions[imgId] = data
    }
  },
  [types.UPDATE_SELECTION] (state, imgId, data) {
    state.selections.regions[imgId] = data
  },
  [types.ACTIVE_IMAGE_SELECTION] (state, imgId) {
    if (state.selections.activeImages === undefined) {
      state.selections.activeImages = []
    }
    if (state.selections.activeImages.length === 2) {
      state.selections.activeImages = []
    }
    state.selections.activeImages.push(imgId)
  },
  [types.ACTIVE_REGION_SELECTION] (state, imgId) {
    state.selections.activeRegion = imgId
  }
}
