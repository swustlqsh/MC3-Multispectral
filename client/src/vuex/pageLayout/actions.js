/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
    updatePageWidth (store, width) {
        store.dispatch(types.UPDATE_PAGE_WIDTH, width)
    },
    updatePageHeight (store, height) {
        store.dispatch(types.UPDATE_PAGE_HEIGHT, height)
    },
    updatePageSize (store, width, height) {
        store.dispatch(types.UPDATE_PAGE_SIZE, width, height)
    }
}