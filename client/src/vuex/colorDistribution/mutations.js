/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
    [types.EXPORT_AREA] (state, rectArea) {
        state.rectArea = rectArea
    }
}