/**
 * Created by guozhengli on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  highlightEvent (store, hoveringEvent) {
    store.dispatch(types.HIGHLIGHT_EVENT, hoveringEvent)
  }
}