// process.SkyEye 可以访问
import lessVars from './base.vars.less'

console.log(lessVars)

let config = {
  debug: process.SkyEye.ENV === 'dev'
}

export default config
