/**
 * Created by liqiusheng on 05/07/2017.
 */

import * as types from '../mutations'

export default {
  [types.IMAGE_TO_TAGGED_VIEW] (state, selectedImage) {
    state.selectedImage = selectedImage
  }
}
