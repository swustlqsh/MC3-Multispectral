/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  transFeatures (store, transedFeatures) {
    store.dispatch(types.TRANS_FEATURES, transedFeatures)
  }
}