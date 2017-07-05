/**
 * Created by liqiusheng@b.360.cn on 2017/7/5.
 */
import _ from 'lodash'

// selector dom 实例
// options  选项配置
// data     数据
// events   事件

class Render {
  constructor ({ selector = null } = {}) {
    if (selector) {
      this.selector = selector
    } else {
      throw new Error(`${this.constructor.NAME}未设置selector`)
    }
    this.events = {}
    this.options = {}
    return this
  }
  // 初始化
  init (opts) {
    _.assign(this.options, opts)
    return this
  }
  // 绘制数据
  draw (data) {
    this.data = data
  }
  // 销毁
  destroy () {
    return null
  }
  // 绑定事件
  on (...args) {
    if (args.length === 2) {
      const [name, callback] = args
      this.$addEvent(name, callback)
    } else if (args.length === 1) {
      if (args[0] instanceof Object) {
        for (let name in args[0]) {
          const callback = args[0][name]
          this.$addEvent(name, callback)
        }
      }
    }
    return this
  }
  // 取消事件
  off (...args) {
    if (args.length === 2) {
      const [name, callback] = args
      this.$removeEvent(name, callback)
    } else if (args.length === 1) {
      const name = args[0]
      this.$removeEvent(name)
    }
    return this
  }

  // 触发事件
  $trigger (name, ...args) {
    if (this.events.hasOwnProperty(name)) {
      this.events[name].forEach((callback) => {
        setTimeout(callback, 1, ...args)
      })
    }
    return this
  }

  // 增加事件
  $addEvent (name, callback) {
    if (!this.events.hasOwnProperty(name)) {
      this.events[ name ] = []
    }
    if (callback instanceof Function) {
      this.events[ name ].push(callback)
    } else {
      console.log(`Event ${name} callback is not a function`)
    }
    return this
  }

  // 移除事件
  $removeEvent (name, callback) {
    if (this.events.hasOwnProperty(name)) {
      if (callback) {
        let index = this.events[ name ].indexOf(callback)
        this.events[ name ].splice(index, 1)
      } else {
        this.events[ name ] = []
      }
    }
    return this
  }
}

export default Render
