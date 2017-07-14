/**
 * Created by guozhengli on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  [types.HIGHLIGHT_EVENT] (state, event) {
    state.hoveringEvent = event
  }
}
