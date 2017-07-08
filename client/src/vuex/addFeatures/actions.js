/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  addFeatures (store, addedFeatures) {
    store.dispatch(types.ADD_FEATURES, addedFeatures)
  }
}