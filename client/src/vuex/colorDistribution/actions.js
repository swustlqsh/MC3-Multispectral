/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  exportArea (store, rectArea) {
    store.dispatch(types.EXPORT_AREA, rectArea)
  }
}