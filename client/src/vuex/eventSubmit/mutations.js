/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
    [types.EVENT_SUBMIT] (state, event) {
        state.event = event
    }
}