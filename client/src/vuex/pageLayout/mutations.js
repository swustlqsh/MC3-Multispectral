/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
    [types.UPDATE_PAGE_WIDTH] (state, pageWidth) {
        state.pageWidth = pageWidth
    },
    [types.UPDATE_PAGE_HEIGHT] (state, pageHeight) {
        state.pageHeight = pageHeight
    },
    [types.UPDATE_PAGE_SIZE] (state, pageWidth, pageHeight) {
        state.pageSize.pageWidth = pageWidth
        state.pageSize.pageHeight = pageHeight
    }
}