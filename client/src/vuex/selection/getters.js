/**
 * Created by liqiusheng@b.360.cn on 2017/7/8.
 */
export default {
  activeRegion: (state) => state.selections.activeRegion,
  activeRegionByIds: (state) => state.selections.activeRegionByIds,
  activeImages: (state) => state.selections.activeImages,
  allRegions: (state) => state.selections.regions,
  // activeRegions: (state) => state.selections.activeRegions,
  activeRegionsImages: (state) => state.selections.activeRegionsImages
}
