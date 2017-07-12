/**
 * Created by liqiusheng on 11/07/2017.
 */

import Promise from 'bluebird'

import {transSelectRegionToBase64, getColorRgb} from '../../commons/utils'

class VirtulCanvas {
  constructor () {
    // 原始图片信息
    this.selectImage = null
    this.imgWidth = 651
    this.imgHeight = 651
    // image canvas
    this.sourceImgCanvas = null
    this.sourceImgCtx = null
    // cut canvas
    this.cutImgCanvas = null
    this.cutImgCtx = null

    this.cutImgWidth = 0
    this.cutImgHeight = 0
    this.options = {}
  }

  init (opts) {
    this.options = Object.assign({}, opts)
  }

  setCanvas () {
    this.setCutImage()
    this.setSourceImage()
  }
  setColor (color) {
    this.color = getColorRgb(color)
  }

  getAllCanvas () {
    this.sourceImgCanvas = document.getElementById('source-canvas')
    this.sourceImgCtx = this.sourceImgCanvas.getContext('2d')

    this.cutImgCanvas = document.getElementById('cut-canvas')
    this.cutImgCtx = this.cutImgCanvas.getContext('2d')
  }

  setCutImage () {
    let bbox = this.options.bbox
    this.cutImgWidth = bbox[2] - bbox[0]
    this.cutImgHeight = bbox[3] - bbox[1]
    this.cutImgCanvas = document.createElement('canvas')
    this.cutImgCanvas.width = this.cutImgWidth
    this.cutImgCanvas.height = this.cutImgHeight
    // this.cutImgCanvas.style.display = 'none'
    this.cutImgCanvas.id = 'new_cut_canvas'

    this.cutImgCtx = this.cutImgCanvas.getContext('2d')
    // this.cutImgCtx.drawImage(this.selectImage, 0, 0, this.imgWidth, this.imgHeight)
    document.body.appendChild(this.cutImgCanvas)
    return this
  }
  setSourceImage () {
    this.sourceImgCanvas = document.createElement('canvas')
    this.sourceImgCanvas.width = this.imgWidth
    this.sourceImgCanvas.height = this.imgHeight
    // this.sourceImgCanvas.style.display = 'none'
    this.sourceImgCanvas.id = 'new_img_canvas'

    this.sourceImgCtx = this.sourceImgCanvas.getContext('2d')
    // this.sourceImgCtx.drawImage(this.selectImage, 0, 0, this.imgWidth, this.imgHeight)
    document.body.appendChild(this.sourceImgCanvas)
    return this
  }
  // Promise 解决同步问题
  updateSourceImageAndCutImage (src, area) {
    return new Promise(function (resolve) {
      this.selectImage = new Image()
      this.selectImage.src = src
      this.selectImage.onload = function () {
        this.imgWidth = this.selectImage.width
        this.imgHeight = this.selectImage.height
        this.sourceImgCanvas.width = this.imgWidth
        this.sourceImgCanvas.height = this.imgHeight
        this.sourceImgCtx.clearRect(0, 0, this.imgWidth, this.imgHeight)
        this.sourceImgCtx.drawImage(this.selectImage, 0, 0, this.imgWidth, this.imgHeight)
        let bbox = this.options.bbox
        this.cutImgWidth = bbox[2] - bbox[0]
        this.cutImgHeight = bbox[3] - bbox[1]
        this.cutImgCanvas.width = this.cutImgWidth
        this.cutImgCanvas.height = this.cutImgHeight
        let data = this.sourceImgCtx.getImageData(bbox[0], bbox[1], this.cutImgWidth, this.cutImgHeight)
        transSelectRegionToBase64(data, area, this.color)
        this.cutImgCtx.clearRect(0, 0, this.cutImgWidth, this.cutImgHeight)
        this.cutImgCtx.putImageData(data, 0, 0)
        resolve(this.cutImgCanvas.toDataURL())
      }.bind(this)
    }.bind(this))
  }
}
export default VirtulCanvas
