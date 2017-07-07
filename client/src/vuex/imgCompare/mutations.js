/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
    [types.IMG_COMPARE] (state, comparedMessage) {
        state.comparedMessage = comparedMessage
    }
}