/**
 * Created by liqiusheng@b.360.cn on 2017/7/8.
 */
import * as types from '../mutations'
import _ from 'lodash'
export default {
  [types.CREATE_SELECTION] (state, imgId, data) {
    if (!state.selections.regions) {
      state.selections.regions = {}
    }
    if (state.selections.regions.hasOwnProperty(imgId)) {
      let sData = state.selections.regions[imgId]
      // let currentIndex = Object.keys(data.regions).length
      for (let k in data.regions) {
        sData.regions[k] = data.regions[k]
      }
      // for (let tag in data.regions) {
      //   let newIndex = currentIndex + parseInt(tag)
      //   state.selections.regions[imgId].regions[newIndex] = data.regions[tag]
      // }
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
  [types.ACTIVE_REGION_SELECTION] (state, imgId, regionId) {
    state.selections.activeRegion = {imgId: imgId, id: regionId}
  },
  [types.ACTIVE_REGION_SELECTION_IDS] (state, imgId, ids) {
    state.selections.activeRegionByIds = {}
    let imageMeta = state.selections.regions[imgId]
    let newRegions = {}
    let newMeta = {}
    let regions = imageMeta.regions
    newMeta = _.cloneDeep(imageMeta)
    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        if (regions.hasOwnProperty(id)) {
          newRegions[id] = regions[id]
        }
      })
      newMeta.regions = newRegions
    } else {
      if (regions.hasOwnProperty(ids)) {
        newRegions[ids] = regions[ids]
      }
      newMeta.regions = newRegions
    }
    let resMeta = {}
    resMeta[imgId] = newMeta
    state.selections.activeRegionByIds = resMeta
    return state.selections.activeRegionByIds
  },
  // [types.ACTIVE_REGION_SELECTION_IDS] (state, imgId, ids) {
  //   state.selections.activeRegions = {}
  //   let imageMeta = state.selections.regions[imgId]
  //   let newRegions = {}
  //   let newMeta = {imgId: {}}
  //   let regions = imageMeta.regions
  //   newMeta = _.cloneDeep(imageMeta)
  //   if (Array.isArray(ids)) {
  //     ids.forEach((id) => {
  //       if (regions.hasOwnProperty(id)) {
  //         newRegions = regions[id]
  //       }
  //     })
  //     newMeta.regions = newRegions
  //   } else {
  //     if (regions.hasOwnProperty(ids)) {
  //       newRegions = regions[ids]
  //     }
  //     newMeta.regions = newRegions
  //   }
  //   state.selections.activeRegions = newMeta
  // },
  [types.ACTIVE_REGION_SELECTION_IMAGES] (state, imgId, Images) {
    state.selections.activeRegionsImages = {}
    state.selections.activeRegionsImages[imgId] = Images
  }
}
