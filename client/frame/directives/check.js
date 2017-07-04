/**
 * 值校验
 *
 * modifiers    force（第一次强制校验）
 *
 * 返回值
 *              false  校验失败
 *              true   校验成功
 *
 * 在模板中使用
 *              v-check="需要被检查的变量"
 *              check-method="校验函数"
 *              check-result="校验结果"
 *              check-params="[参数2, 参数3, ..., 参数n]" 校验函数的参数（参数1就是校验的值即check指令绑定的变量））
 */
import {info} from '../modules/logs'
import checkFunctions from '../modules/checkFunctions'

export default {
  install (Vue, { name = 'check', functions = {} } = {}) {
    const prefix = `自定义指令"${name}"`
    Object.assign(checkFunctions, functions)
    const check = {
      params: [ 'check-method', 'check-result', 'check-params' ],
      bind: function () {
        // 准备工作
        // console.log(this.descriptor)
        // console.log(this.params)
        // console.log(this.vm)
        // console.log(this.el)
        this.checkMethod = this.params.checkMethod
        this.checkResult = this.params.checkResult
        this.checkParams = this.params.checkParams
        if (!(this.checkParams instanceof Array)) {
          this.checkParams = []
        }
        this.checkFunction = checkFunctions[ this.checkMethod ]
      },
      update: function (now) {
        // 值更新时的工作
        // 也会以初始值为参数调用一次
        if (this.modifiers.force || now !== null) {
          let result = true
          if (this.checkFunction instanceof Function) {
            result = this.checkFunction.apply(checkFunctions, [ now ].concat(this.checkParams))
          } else {
            console.error(`${prefix}不支持方法${this.checkMethod}`)
          }
          this.vm.$set(this.checkResult, result)
        }
      }
    }
    Vue.directive(name, check)
    info(`${prefix}安装成功`, `支持的方法有：${Object.keys(checkFunctions).toString()}`)
  }
}
