import config from '../config'

const regs = config.regs

let dict = {}
/**
 * 函数命名规则 isYourFunctionName（必须是驼峰式）
 */

dict.isNumber = function (v) {
  return typeof v === 'number'
}

dict.isString = function (v) {
  return typeof v === 'string'
}

dict.isArray = function (v) {
  return v instanceof Array
}

dict.isObject = function (v) {
  return v instanceof Object
}

dict.isFunction = function (v) {
  return v instanceof Function
}

// 非空
dict.isNotEmpty = function (v) {
  if (v) {
    if (v instanceof Object) {
      return Object.keys(v).length > 0
    }
    if (v instanceof Array) {
      return v.length > 0
    }
    return true
  }
  return false
}

// 身份证（中国）
dict.isId = function (v) {
  v = '' + v
  return regs.id.test(v)
}

dict.isEmail = function (v) {
  v = '' + v
  return regs.email.test(v)
}

// 移动电话（中国）
dict.isMobile = function (v) {
  v = '' + v
  return regs.mobile.test(v)
}

// 电话（包括移动电话和固话）
dict.isTel = function (v) {
  v = '' + v
  return regs.tel.test(v)
}

dict.isIpv4 = function (v) {
  v = '' + v
  return regs.ipv4.test(v)
}

dict.isIpv6 = function (v) {
  v = '' + v
  var s = v.match(/:/g)
  if (s) {
    return s.length <= 7 && /::/.test(v) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(v) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(v)
  }
  return false
}

dict.isIp = function (v) {
  v = '' + v
  return dict.isIpv4(v) || dict.isIpv6(v)
}

dict.isMd5 = function (v) {
  v = '' + v
  return regs.md5.test(v)
}

dict.isUrl = function (v) {
  v = '' + v
  return regs.url.test(v)
}

dict.isMinLen = function (v, l) {
  if (!dict.isArray(v)) v = '' + v
  return v.length >= l
}

dict.isMaxLen = function (v, l) {
  if (!dict.isArray(v)) v = '' + v
  return v.length <= l
}

dict.isRangeLen = function (v, min, max) {
  if (!dict.isArray(v)) v = '' + v
  return dict.isMinLen(v, min) && dict.isMaxLen(v, max)
}

dict.isJson = function (v) {
  try {
    JSON.parse(v)
    return true
  } catch (err) {
    return false
  }
}

dict.isBase64 = function (v) {
  v = '' + v
  return regs.base64.test(v)
}

// 小于
dict.isLt = function (v, d) {
  return v < d
}

dict.isLte = function (v, d) {
  return v <= d
}

// 大于
dict.isGt = function (v, d) {
  return v > d
}

dict.isGte = function (v, d) {
  return v >= d
}

dict.isIn = function (v, d) {
  return d.indexOf(v) !== -1
}

dict.isNotIn = function (...args) {
  return !dict.isIn(...args)
}

export default dict
