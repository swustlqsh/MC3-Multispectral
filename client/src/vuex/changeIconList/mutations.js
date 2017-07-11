/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  [types.CHANGE_ICON_LIST] (state, featureColors) {
    state.featureColors = featureColors
  }
}
