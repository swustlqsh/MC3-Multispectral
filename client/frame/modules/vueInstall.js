import Vue from 'vue'
import windowInstall from './windowInstall'
import {info, warn} from './logs'

let list = []

windowInstall('showVueInstalled', () => list)

export default ({ module = '', name = '' } = {}, conf) => {
  if (module && name && conf) {
    let NAME = `${module}${name.charAt(0).toUpperCase() + name.slice(1, name.length)}`
    if (Vue.hasOwnProperty(NAME)) {
      warn(`vueInstall：Vue已经有"${NAME}"属性`)
    } else {
      Vue[ NAME ] = conf
      list.push(NAME)
      info(`vueInstall：Vue.${NAME}安装成功`)
    }
    if (Vue.prototype.hasOwnProperty(NAME)) {
      warn(`vueInstall：Vue.prototype已经有"${NAME}"属性`)
    } else {
      Vue.prototype[ NAME ] = conf
      info(`vueInstall：Vue.prototype.${NAME}安装成功`)
    }
  } else {
    warn('vueInstall：参数设置错误', module, name, conf)
    throw new Error('vueInstall：参数设置错误')
  }
}
