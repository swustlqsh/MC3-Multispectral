/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  eventSubmit (store, event) {
    store.dispatch(types.EVENT_SUBMIT, event)
  }
}