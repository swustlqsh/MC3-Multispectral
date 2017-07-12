/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  [types.TRANS_FEATURES] (state, transedFeatures) {
    state.transedFeatures = transedFeatures
  }
}
