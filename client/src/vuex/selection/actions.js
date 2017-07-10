/**
 * Created by liqiusheng@b.360.cn on 2017/7/8.
 */
import * as types from '../mutations'

export default {
  createSelection (store, imgId, data) {
    store.dispatch(types.CREATE_SELECTION, imgId, data)
  },
  updateSelection (store, imgId, data) {
    store.dispatch(types.UPDATE_SELECTION, imgId, data)
  },
  activeImagesSelection (store, imgId) {
    store.dispatch(types.ACTIVE_IMAGE_SELECTION, imgId)
  },
  activeRegionSelection (store, imgId, regionId) {
    store.dispatch(types.ACTIVE_REGION_SELECTION, imgId, regionId)
  },
  activeRegionSelectionIds (store, imgId, ids) {
    store.dispatch(types.ACTIVE_REGION_SELECTION, imgId, ids)
  }
}
