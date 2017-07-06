/**
 * Created by liqiusheng on 17/7/5.
 */
// module getters

import pageLayoutGetters from './pageLayout/getters'
import eventGetters from './eventSubmit/getters'

/**
 * |————————————————————————————————|
 * |            PageLayout         |
 * |————————————————————————————————|
 */

export const pageSize = pageLayoutGetters.pageSize
export const pageWidth = pageLayoutGetters.pageWidth
export const pageHeight = pageLayoutGetters.pageHeight
export const event = eventGetters.event