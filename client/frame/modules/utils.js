import { info } from './logs'
import skyfutils from '@qnpm/skyfutils/dist/skyfutils.js'

const utils = skyfutils.install({ env: 'browser', globalInstall: false, prefix: 'u' })

utils.isStatusEqual = function (a, b) {
  if (a && b) {
    a = '' + a
    b = '' + b
    let v1 = a.split('@Time:')[ 0 ]
    let v2 = b.split('@Time:')[ 0 ]
    return v1 === v2
  }
  return false
}

utils.setStatus = function (value) {
  return value + '@Time:' + (new Date().toLocaleString()) + '@Random: ' + (~~(Math.random() * Math.pow(10, 8)))
}

utils.setArrayItem = (arr, newItem, pKey) => {
  if (!arr || !newItem || !pKey) return arr
  let arr2 = []
  if (newItem instanceof Array) {
    arr2 = newItem
  } else {
    arr2 = [ newItem ]
  }
  arr2.forEach((item2) => {
    let tmp = arr
      .filter((item) => {
        return item.hasOwnProperty(pKey) && item2.hasOwnProperty(pKey) && item[ pKey ] === item2[ pKey ]
      })
      .map((item) => {
        Object.assign(item, item2)
        return true
      })
    if (!tmp.length) arr.push(item2)
  })
  return arr
}

utils.removeArrayItem = (arr, pKey, value) => {
  arr.filter((d) => {
    return d[ pKey ] === value
  }).map((d) => {
    const index = arr.indexOf(d)
    if (index !== -1) arr.splice(index, 1)
  })
  return arr
}

info('utils函数列表', Object.keys(utils).toString())

export default utils
