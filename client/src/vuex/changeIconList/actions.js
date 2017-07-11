/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  changeIconList (store, featureColors) {
    store.dispatch(types.Change_Icon_List, featureColors)
  }
}