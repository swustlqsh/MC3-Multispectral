/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  imgCompare (store, comparedMessage) {
    store.dispatch(types.IMG_COMPARE, comparedMessage)
  }
}