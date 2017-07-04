/* 动画效果请参见 https://github.com/daneden/animate.css */
/**
 * How to use
 * 组件模板设置
 *    class="animated ..."
 *    设置v-show 或者 v-if 控制显示和隐藏
 *    stagger="100" // 用于列表中
 *    transition="transition name" // name为效果名称
 *    namespace="your namespace string" // 可选属性，当一个组件有多处使用才需设置
 * 组件JS在methods配置中设置钩子函数
 *    transitionBeforeEnter
 *    transitionEnter
 *    transitionAfterEnter
 *    transitionEnterCancelled
 *    transitionBeforeLeave
 *    transitionLeave
 *    transitionAfterLeave
 *    transitionLeaveCancelled
 * 当设置了namespace选项时，钩子函数名称为
 *    transition[Namespace]BeforeEnter
 *    transition[Namespace]Enter
 *    transition[Namespace]AfterEnter
 *    transition[Namespace]EnterCancelled
 *    transition[Namespace]BeforeLeave
 *    transition[Namespace]Leave
 *    transition[Namespace]AfterLeave
 *    transition[Namespace]LeaveCancelled
 */
import './animate.css'
import { info } from '../modules/logs'

let factory = function (enterClass, leaveClass) {
  let triggerCallback = function (eventName) {
    return function (el) {
      let vueObj = el.__vue__ || el.__v_trans && el.__v_trans.vm || null
      let namespace = el.getAttribute('namespace')
      if (vueObj) {
        let callbackName = 'transition'
        if (namespace) {
          callbackName += namespace.charAt(0).toUpperCase() + namespace.substring(1, namespace.length)
        }
        callbackName += eventName.charAt(0).toUpperCase() + eventName.substring(1, eventName.length)
        vueObj[ callbackName ] instanceof Function && vueObj[ callbackName ]()
      }
    }
  }

  return {
    enterClass,
    leaveClass,
    beforeEnter: triggerCallback('beforeEnter'),
    enter: triggerCallback('enter'),
    afterEnter: triggerCallback('afterEnter'),
    enterCancelled: triggerCallback('enterCancelled'),
    beforeLeave: triggerCallback('beforeLeave'),
    leave: triggerCallback('leave'),
    afterLeave: triggerCallback('afterLeave'),
    leaveCancelled: triggerCallback('leaveCancelled')
  }
}

let configs = [ {
  name: 'bounce', types: [ [ '', '' ], [ 'U', 'Up' ], [ 'D', 'Down' ], [ 'L', 'Left' ], [ 'R', 'Right' ] ]
}, {
  name: 'fade', types: [ [ '', '' ], [ 'U', 'Up' ], [ 'D', 'Down' ], [ 'L', 'Left' ], [ 'R', 'Right' ] ]
}, {
  name: 'slide', types: [ [ 'U', 'Up' ], [ 'D', 'Down' ], [ 'L', 'Left' ], [ 'R', 'Right' ] ]
}, {
  name: 'zoom', types: [ [ '', '' ], [ 'U', 'Up' ], [ 'D', 'Down' ], [ 'L', 'Left' ], [ 'R', 'Right' ] ]
}, {
  name: 'flip', types: [ [ 'X', 'X' ], [ 'Y', 'Y' ] ]
}, {
  name: 'lightSpeed', types: [ [ '', '' ] ]
}, {
  name: 'roll', types: [ [ '', '' ] ]
}, {
  name: 'rotate',
  types: [ [ '', '' ], [ 'DL', 'DownLeft' ], [ 'DR', 'DownRight' ], [ 'UL', 'UpLeft' ], [ 'UR', 'UpRight' ] ]
} ]

export default {
  install (Vue) {
    let dict = {}
    let names = []
    configs.forEach((item) => {
      item.types.forEach((i) => {
        let [ik, iv] = i
        item.types.forEach((o) => {
          let [ok, ov] = o
          let name = item.name + ik + ok
          let inCss = item.name + 'In' + iv
          let outCss = item.name + 'Out' + ov
          if (!dict[name]) {
            dict[ name ] = [ inCss, outCss ]
            names.push(name)
            Vue.transition(name, factory(inCss, outCss))
          }
        })
      })
    })
    info('自定义过渡器安装成功', `支持的效果有：${names.toString()}`)
  }
}
