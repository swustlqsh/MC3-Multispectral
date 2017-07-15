/**
 * Created by liqiusheng@b.360.cn on 2017/6/23.
 * 后端请求
 */
import Vue from 'vue'
import _ from 'lodash'
import Promise from 'bluebird'
// 启动server api服务的 url
const HOST = 'http://127.0.0.1:5011'
// TODO 标记视图
// ----------------------------------------------------------------------
//                             TODO 增加
// ----------------------------------------------------------------------
// channelId: B1, B2, B3,...
// taggerId:  id-1500094495121-922905965 (id-时间-随机数)
// taggerValue:
//     "shape_attributes": {
//       "name":'rect',
//         "x": 259,
//         "y": 60,
//         "width": 175,
//         "height": 65
//     },
//     "region_attributes":{
//     }
export function initMatrixData (originalData) {
  let getUrl = HOST + '/api/init'
  let collectionName = 'matrixData'
  let params = {
    'databaseName': collectionName,
    'originalData': originalData
  }
  let strParams = JSON.stringify(params)
  return Vue.vHttp.get(getUrl, strParams)
}

export function addTaggerAttrInfo (channelId, taggerId, taggerValue) {
  let getUrl = HOST + '/tagger/api/addtagger/'
  let curDate = +new Date()
  let params = {
    'channel_id': channelId,
    'tagger_id': taggerId,
    'tagger_value': taggerValue,
    'create_time': curDate,
    'update_time': curDate
  }
  return Vue.vHttp.post(getUrl, params)
}
export function editTaggerAttrInfo (channelId, taggerId, taggerValue) {
  let getUrl = HOST + '/tagger/api/edittagger/'
  let params = {
    'channel_id': channelId,
    'tagger_id': taggerId,
    'tagger_value': taggerValue,
    'update_time': +new Date()
  }
  return Vue.vHttp.post(getUrl, params)
}
// 根据通道ID获取所有的标记
export function getAllTaggerInfoForChannel (channelId) {
  let getUrl = HOST + '/label/api/gettaggers/'
  return Vue.vHttp.get(getUrl, {
    params: {
      'channel_id': channelId,
      limit: 10 // 可以不设置
    }
  })
}
// 根据通道ID、taggerId获取标记
export function getTaggerInfoForOne (channelId, taggerId) {
  let getUrl = HOST + '/label/api/gettaggers/'
  return Vue.vHttp.get(getUrl, {
    params: {
      'channel_id': channelId,
      'tagger_id': taggerId
    }
  })
}
// 根据所有通道、 所有标记
export function getTaggersInfoForAll () {
  let getUrl = HOST + '/label/api/gettaggers/'
  return Vue.vHttp.get(getUrl).then((res) => {
    let data = _(res).groupBy('channel_id')
    return Promise.resolve(data)
  })
}
// TODO 通道信息视图
// ----------------------------------------------------------------------
//                          TODO 增加
// ----------------------------------------------------------------------
// channelId: B1, B2, B3,...
// channelValue:
//   "fileref":"",
//   "size":0,
//   "filename":"B1.2014.3.8.png",
//   "base64_img_data":"",
//   "file_attributes":{
//     "caption":"B1"
//    }

export function addChannelAttrInfo (channelId, channelValue) {
  let getUrl = HOST + '/channel/api/addchannel/'
  let curDate = +new Date()
  let params = {
    'channel_id': channelId,
    'channel_value': channelValue,
    'create_time': curDate,
    'update_time': curDate
  }
  return Vue.vHttp.post(getUrl, params)
}

export function editChannelAttrInfo (channelId, channelValue) {
  let getUrl = HOST + '/channel/api/editchannel/'
  let params = {
    'channel_id': channelId,
    'channel_value': channelValue,
    'update_time': +new Date()
  }
  return Vue.vHttp.post(getUrl, params)
}
export function getChannelAttrInfoForOne (channelId) {
  let getUrl = HOST + '/channel/api/getchannel/'
  let params = {
    'channel_id': channelId
  }
  return Vue.vHttp.get(getUrl, params)
}
export function getChannelAttrInfoForAll () {
  let getUrl = HOST + '/channel/api/getchannel/'
  return Vue.vHttp.get(getUrl)
}
// TODO Matrix视图
