# Frame 运行框架

## 引入
```
import frame from 'FRAME'
```
---
## 使用
1. Vue.use：可以使用自定义指令，过滤器，过渡器；在Vue实例中可以通过this.$fxxx直接访问对应的Api
```
Vue.use(frame, options)
```
2. 直接使用：无法使用自定义指令，过滤器，过渡器；无法在Vue实例中可以通过this.$fxxx直接访问对应的Api
```
frame.xxx
```
* 无论上述哪种方法，都可以直接通过frame.xxx访问对应的Api
---
## Vue.use使用时的选项（options）
* directives（自定义指令配置选项）对象型
    * check （值检查指令配置选项）对象型
        * name （指令名称）字符型，默认值`check`
        * functions（自定义校验函数字典）对象型，默认值`{}`
---
## Api说明
通过frame.xxx 或者 this.$fxxx 访问对应Api，以下说明均采用接口名，请根据使用方式进行相应的转换
### async 异步运行构造函数
* frame.async 或 this.$fAsync
* 参数
    * name（名称）字符型
    * callback（回调函数），参数
        * resolve（成功回调函数）
        * reject（错误回调函数）
    * done（异步完成时的回调函数），参数
        * type（回调类型）字符型，`resolve` 或 `reject`
        * data（回调的数据）
* 示例
```
async('请求登录', (resolve, reject) => {
    // do something ...
    // if success 
    resolve(data)
    // if error
    reject(err)
}, (type, data) => {
    // when complete
})
.then((res) => {}) // when success
.catch((err) => {}) // when error
.finally(() => {}) // when complete
```
### checkFunctions 值检查函数集合
* frame.checkFunctions.xxx 或 this.$fCheckFunctions.xxx
* 返回都是布尔型
* 支持的方法
    * isNumber
        * v（被检查的值）
        ```
        /* 直接使用（js）*/
        let v = 123
        isNumber(v) // => true
        /* 在值检查指令中使用 */
        // js中
        ...
        data () {
            return {
                v: 123,
                checkRs: null,
                ...
            }
        }
        ...
        // html中
        v-check="v"
        check-method="isNumber"
        check-result="checkRs"
        ```
    * isString
        * v（被检查的值）
    * isArray
        * v（被检查的值）
    * isObject
        * v（被检查的值）
    * isFunction
        * v（被检查的值）
    * isNotEmpty
        * v（被检查的值）
    * isId（中国身份证）
        * v（被检查的值）
    * isEmail
        * v（被检查的值）
    * isMobile（中国手机号码）
        * v（被检查的值）
    * isTel
        * v（被检查的值）
    * isIpv4
        * v（被检查的值）
    * isIpv6
        * v（被检查的值）
    * isIp
        * v（被检查的值）
    * isMd5
        * v（被检查的值）
    * isUrl
        * v（被检查的值）
    * isMinLen
        * v（被检查的值）
        * len（长度）
    * isMaxLen
        * v（被检查的值）
        * len（长度）
    * isRangeLen
        * v（被检查的值）
        * min（长度下限）
        * max（长度上限）
         ```
        /* 直接使用（js）*/
        let arr = [1, 2, 3]
        let str = '123'
        isRangeLen(arr, 2, 5) // => true
        isRangeLen(str, 8, 20) // => false
        /* 在值检查指令中使用 */
        // js中
        ...
        data () {
            return {
                v: [1, 2, 3],
                checkRs: null,
                ...
            }
        }
        ...
        // html中
        v-check="v"
        check-method="isRangeLen"
        check-result="checkRs"
        :check-params="[2, 5]"
        ```
    * isJson
        * v（被检查的值）
    * isBase64
        * v（被检查的值）
    * isLt
        * v（被检查的值）
        * d（参考值）
    * isLte
        * v（被检查的值）
        * d（参考值）
    * isGt
        * v（被检查的值）
        * d（参考值）
    * isGte
        * v（被检查的值）
        * d（参考值）
    * isIn
        * v（被检查的值）
        * d（参考值）
    * isNotIn
        * v（被检查的值）
        * d（参考值）
* 示例
```    
```
### logs 控制台输出
* frame.logs.xxx 或 this.$fLogs.xxx
* 支持的方法（使用方法同console.log）
    * log
    * info
    * warn
    * error
### utils 函数工具集
* frame.utils.xxx 或 this.$fUtils.xxx
* 支持的方法
    * skyutils函数集 http://10.95.24.22:5025/page/home
        * uFileRead
        * uLocalStorage
        * uNotice
        * uBanner
        * uRandom
        * uStrBordered
        * uRegExp
    * isStatusEqual（判断两个状态字符串是否相等，主要用于vuex状态更新后的状态字符串对比）
        * 参数
            * a（字符型）
            * b（字符型）
        * 返回
            * 是否相等（布尔型）
    * setStatus（根据参数的值设置一个随机的且唯一的状态字符串，主要用于vuex状态更新时设置更新的标识）
        * 参数
            * value（字符型）
        * 返回
            * 构造后的字符串（字符型）
    * setArrayItem（给指定的数组修改或追加元素）
        * 参数
            * arr 被修改的数组（数组型）
            * newItem 修改或追加的元素（多个元素数组或单个元素对象） 
            * pKey 数组元素的主键名（字符型）
        * 返回
            * 修改后的数组（数组型）
    * removeArrayItem（从指定的数组中删除元素）
        * 参数
            * arr 被修改的数组（数组型）
            * pKey 数组元素的主键名（字符型）
            * value 数组元素的主键值（字符型或数字型）
        * 返回
            * 修改后的数组（数组型）
### vueInstall vue属性安装函数
* frame.vueInstall 或 this.$fVueInstall
* 参数
    * opts
        * module（模块名）字符型
        * name（名称）字符型
    * conf（被安装的配置）任意类型
* 示例
```
// 进行安装
vueInstall({ module: '$f', name: 'async' }, pms)
// 进行使用
Vue.$fAsync
Vue.prototype.$fAsync
this.$fAsync // Vue实例
```
### windowInstall window属性安装函数
* frame.windowInstall 或 this.$fWindowInstall
* 参数
    * name（名称）
    * conf（被安装的配置）任意类型
* 示例
```
// 进行安装
windowInstall('showVueInstalled', () => { console.log('已经安装的Vue属性列表') })
// 进行使用
window.skyfenvShowVueInstalled() // 可以在控制台直接使用
```
---
## 自定义指令
### 值检查指令：check，v-check
 * modifiers    force（第一次强制校验）
 * 返回值        true 或 false
 * 使用
 ```
 v-check="需要被检查的变量"
 check-method="校验函数名"
 check-result="校验结果存放的变量名"
 check-params="[参数2, 参数3, ..., 参数n]" 校验函数的参数（参数1就是校验的值即指令绑定的变量））
 ```
---
## 自定义过滤器
---
## 自定义过渡器
* 组件模板设置
    * class="animated ..."
    * 设置v-show 或者 v-if 控制显示和隐藏
    * stagger="100" // 用于列表循环时v-for
    * transition="transition name" // name为效果名称
    * namespace="your namespace string" // 可选属性，当一个组件有多处使用才需设置
* 组件JS在methods配置中设置钩子函数
    * transitionBeforeEnter
    * transitionEnter
    * transitionAfterEnter
    * transitionEnterCancelled
    * transitionBeforeLeave
    * transitionLeave
    * transitionAfterLeave
    * transitionLeaveCancelled
* 当设置了namespace选项时，钩子函数名称为
    * transition[Namespace]BeforeEnter
    * transition[Namespace]Enter
    * transition[Namespace]AfterEnter
    * transition[Namespace]EnterCancelled
    * transition[Namespace]BeforeLeave
    * transition[Namespace]Leave
    * transition[Namespace]AfterLeave
    * transition[Namespace]LeaveCancelled
* 支持的效果
    * bounce,bounceU,bounceD,bounceL,bounceR,bounceUU,bounceUD,bounceUL,bounceUR,bounceDU,bounceDD,bounceDL,bounceDR,bounceLU,bounceLD,bounceLL,bounceLR,bounceRU,bounceRD,bounceRL,bounceRR
    * fade,fadeU,fadeD,fadeL,fadeR,fadeUU,fadeUD,fadeUL,fadeUR,fadeDU,fadeDD,fadeDL,fadeDR,fadeLU,fadeLD,fadeLL,fadeLR,fadeRU,fadeRD,fadeRL,fadeRR
    * slideUU,slideUD,slideUL,slideUR,slideDU,slideDD,slideDL,slideDR,slideLU,slideLD,slideLL,slideLR,slideRU,slideRD,slideRL,slideRR
    * zoom,zoomU,zoomD,zoomL,zoomR,zoomUU,zoomUD,zoomUL,zoomUR,zoomDU,zoomDD,zoomDL,zoomDR,zoomLU,zoomLD,zoomLL,zoomLR,zoomRU,zoomRD,zoomRL,zoomRR
    * flipXX,flipXY,flipYX,flipYY
    * lightSpeed
    * roll
    * rotate,rotateDL,rotateDR,rotateUL,rotateUR,rotateDLDL,rotateDLDR,rotateDLUL,rotateDLUR,rotateDRDL,rotateDRDR,rotateDRUL,rotateDRUR,rotateULDL,rotateULDR,rotateULUL,rotateULUR,rotateURDL,rotateURDR,rotateURUL,rotateURUR
* 效果观看地址 https://daneden.github.io/animate.css/
---