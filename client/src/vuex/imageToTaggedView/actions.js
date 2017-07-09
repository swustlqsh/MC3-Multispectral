/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  imageToTaggedView (store, selectedImage) {
    store.dispatch(types.IMAGE_TO_TAGGED_VIEW, selectedImage)
  }
}