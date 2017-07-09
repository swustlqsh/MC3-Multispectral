/**
 * Created by liqiusheng on 09/07/2017.
 */
import Render from './Render'
let EGION_SHAPE = {
  RECT: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  POLYGON: 'polygon',
  POINT: 'point'
}

class PolylineCanvas extends Render {
  constructor(opts) {
    super(opts)
    // 画布信息
    this.canvasWidth = 0
    this.canvasHeight = 0

    // 图片信息
    this.selectImage = null
    this.imgWidth = 0
    this.imgHeight = 0
    // image canvas
    this.imgCanvas = null
    this.imgCtx = null
    this.regCanvas = null
    this.regCtx = null

    // 存贮原始图片的信息
    this.sourceImgCanvas = null
    this.sourceImgCtx = null

    // 缩放步进
    this.scaleStep = 0.1
    // 最小缩放比例
    this.minScale = 0.0008
    // 最大缩放比例
    this.maxScale = 32

    // 事件
    this.clickEvent = null
    this.mousedownEvent = null
    this.mousemouseUpEvent = null
    this.mouseoverEvent = null
    this.mousemoveEvent = null

    // 图片的画布位置信息
    this.xPosition = 0
    this.yPosition = 0
    this.preXPosition = 0
    this.preYPosition = 0

    // 缩放比例
    this.scale = 1
    this.appearSize = 100
    // 交互功能
    this.interaction = {
      select: true,
      zoomOn: false,
      zoomIn: false,
      rect: false,
      move: false
    }
    return this
  }

  init(opts) {
    super.init(opts)
    console.log('this.options.image_canvas_id', this.options.image_canvas_id)
    this.imgCanvas =  document.getElementById(this.options.image_canvas_id)
    this.imgCtx = this.imgCanvas.getContext('2d')

    this.canvasWidth = this.imgCanvas.clientWidth
    this.canvasHeight = this.imgCanvas.clientHeight

    this.regCanvas =  document.getElementById(this.options.region_canvas_id)
    this.regCtx = this.regCanvas.getContext('2d')

    return this
  }

  updateCanvas() {
    this.imgCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.imgCtx.drawImage(this.sourceImgCanvas,
      -this.xPosition / this.scale,
      -this.yPosition / this.scale,
      this.canvasWidth / this.scale,
      this.canvasHeight / this.scale,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight)
    console.log((this.scale * 100).toFixed(2) + '%', 'scale')
  }

  setShowImage(src) {
    this.selectImage = new Image()
    this.selectImage.src = src
    this.selectImage.onload = function () {
      this.imgWidth = this.selectImage.width
      this.imgHeight = this.selectImage.height

      this.sourceImgCanvas = document.createElement('canvas')
      this.sourceImgCanvas.width = this.imgWidth
      this.sourceImgCanvas.height = this.imgHeight
      this.sourceImgCanvas.style.display = 'none'
      this.sourceImgCtx = this.sourceImgCanvas.getContext('2d')
      this.sourceImgCtx.drawImage(this.selectImage, 0, 0, this.imgWidth, this.imgHeight)
      document.body.appendChild(this.sourceImgCanvas)
      this.scale = 1
      this.setXandY(0, 0)
    }.bind(this)
    return this
  }

  setXandY(vx, vy) {
    // 防止图片被拖出画布
    if (vx < this.appearSize - this.imgWidth * this.scale) {
      this.xPosition = this.appearSize - this.imgWidth * this.scale
    } else if (vx > this.canvasWidth - this.appearSize) {
      this.xPosition = this.canvasWidth - this.appearSize
    } else {
      this.xPosition = vx
    }
    if (vy < this.appearSize - this.imgHeight * this.scale) {
      this.yPosition = this.appearSize - this.imgHeight * this.scale
    } else if (vy > this.canvasHeight - this.appearSize) {
      this.yPosition = this.canvasHeight - this.appearSize
    } else {
      this.yPosition = vy
    }
    this.updateCanvas()
  }

  /* 计算鼠标事件相对容器的位置 */
  calculateChange(e, container, skip) {
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
    let left = x - (container.getBoundingClientRect().left + window.pageXOffset)
    let top = y - (container.getBoundingClientRect().top + window.pageYOffset)

    if (left < 0) {
      left = 0
    } else if (left > containerWidth) {
      left = containerWidth
    }
    if (top < 0) {
      top = 0
    } else if (top > containerHeight) {
      top = containerHeight
    }

    return {
      x: left,
      y: top
    }
  }
}
export default PolylineCanvas