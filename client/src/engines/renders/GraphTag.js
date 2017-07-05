/**
 * Created by liqiusheng@b.360.cn on 2017/7/5.
 */
import Render from './Render'
import _ from 'lodash'

class GraphTag extends Render {
  constructor (opts) {
    super(opts)
    this.el = window.d3.select(this.selector)
    return this
  }
  init (opts) {
    super.init(opts)
    // this.el.html('')
    this.width = this.el.node().offsetWidth
    this.height = this.el.node().offsetHeight
    console.log(this.width, this.height)
    return this
  }
}
export default GraphTag
