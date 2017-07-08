/**
 * Created by liqiusheng on 17/7/5.
 */
// module getters

import pageLayoutGetters from './pageLayout/getters'
import eventGetters from './eventSubmit/getters'
import imgCompareGetters from './imgCompare/getters'
import colorDistributionGetters from './colorDistribution/getters'
import selectionGetters from './selection/getters'
import imageToTaggedViewGetters from './imageToTaggedView/getters'
import addFeaturesGetters from './addFeatures/getters'
/**
 * |————————————————————————————————|
 * |            PageLayout         |
 * |————————————————————————————————|
 */

export const pageSize = pageLayoutGetters.pageSize
export const pageWidth = pageLayoutGetters.pageWidth
export const pageHeight = pageLayoutGetters.pageHeight
export const event = eventGetters.event
export const comparedMessage = imgCompareGetters.comparedMessage
export const rectArea = colorDistributionGetters.rectArea
export const selectedImage = imageToTaggedViewGetters.selectedImage
export const activeRegion = selectionGetters.activeRegion
export const activeImages = selectionGetters.activeImages
export const allRegions = selectionGetters.allRegions
export const addedFeatures = addFeaturesGetters.addedFeatures

