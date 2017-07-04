import {info, warn} from './logs'

export default (name, conf) => {
  if (name) {
    let NAME = `skyfenv${name.charAt(0).toUpperCase() + name.slice(1, name.length)}`
    if (window.hasOwnProperty(NAME)) {
      warn(`windowInstall：window已经有"${NAME}"属性`)
    } else {
      window[ NAME ] = conf
      info(`windowInstall：window.${NAME}安装成功`)
    }
  } else {
    warn('windowInstall：参数设置错误', name, conf)
    throw new Error('windowInstall：参数设置错误')
  }
}
