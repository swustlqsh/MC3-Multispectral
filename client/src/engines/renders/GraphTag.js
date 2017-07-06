/**
 * Created by liqiusheng@b.360.cn on 2017/7/5.
 */
import Render from './Render'
import _ from 'lodash'
import config from '../config'

function ImageRegion () {
  this.is_user_selected = false
  this.shape_attributes = new Map() // region shape attributes
  this.region_attributes = new Map() // region attributes
}

class GraphTag extends Render {
  constructor (opts) {
    super(opts)
    this.el = window.d3.select(this.selector)
    this.currentImageFilename = ''
    this.canvasRegions = []
    this.currentImage = undefined
    // 高度相关
    this.currentImageWidth = 0
    this.currentImageHeight = 0
    this.currentCanvasWidth = 0
    this.currentCanvasHeight = 0
    // 图片信息
    this.canvasZoomLevelIndex = config.CANVAS_DEFAULT_ZOOM_LEVEL_INDEX
    this.canvasScaleWithoutZoom = 1.0
    this.imgMetadata = {}
    this.imageIdList = []
    // 状态信息
    this.imgCount = 0
    this.imageId = ''
    this.imageIndex = 0
    this.currenImageFilename = ''
    this.currentImageLoaded = false
    this.isLoadingCurrentImage = false
    // region
    this.clickX0 = 0
    this.clickX1 = 0
    this.clickY0 = 0
    this.clickY1 = 0
    this.isUserDrawingRegion = false
    this.isWindowResized = false
    this.isUserResizingRegion = false
    this.isUserMovingRegion = false
    this.isUserDrawingPolygon = false
    this.isRegionSelected = false
    this.userSelRegionId = -1
    // application
    this.isRegionBoundaryVisible = true
    this.isRegionIdVisible = true

    return this
  }

  init (opts) {
    super.init(opts)
    // this.el.html('')
    this.currentImageWidth = this.el.node().clientWidth
    this.currentImageHeight = this.el.node().clientHeight
    // this.el.node().style.display = 'none'
    // image canvas
    this.imgCanvas = document.getElementById('image_canvas')
    this.imgCtx = this.imgCanvas.getContext('2d')
    this.regCanvas = document.getElementById('region_canvas')
    this.regCtx = this.regCanvas.getContext('2d')
    this.imageMenu = document.getElementById('image_menu')
    return this
  }

  getImageId (fileName, size) {
    if (typeof (size) === 'undefined') {
      return fileName
    } else {
      return fileName + size
    }
  }

  setAllCanvasSize (w, h) {
    this.imgCanvas.height = h
    this.imgCanvas.width = w
    this.regCanvas.height = h
    this.regCanvas.width = w
  }

  imageMetaData (fileRef, fileName, size) {
    let metaInfo = {
      fileName: fileName,
      size: size,
      fileRef: fileRef,
      regions: [],
      fileAttributes: {},
      base64_img_data: ''
    }
    return metaInfo
  }

  clearImageDisplayArea () {
    this.el.node().style.display = 'none'
  }

  showAllCanvas () {
    this.el.node().style.display = 'inline-block'
  }
  loadCanvasRegions () {
    let regions = this.imgMetadata[ this.imageId ].regions
    this.canvasRegions = []
    let REGION_SHAPE = config.REGION_SHAPE
    let canvasScale = this.canvasScale
    for (let i = 0; i < regions.length; i++) {
      let regioni = new ImageRegion()
      for (let key of regions[ i ].shape_attributes.keys()) {
        let value = regions[ i ].shape_attributes.get(key)
        regioni.shape_attributes.set(key, value)
      }
      this.canvasRegions.push(regioni)
      switch (this.canvasRegions[ i ].shape_attributes.get('name')) {
        case REGION_SHAPE.POLYGON:
          let allPointsX = regions[ i ].shape_attributes.get('all_points_x').slice(0)
          let allPointsY = regions[ i ].shape_attributes.get('all_points_y').slice(0)
          for (let j = 0; j < allPointsX.length; ++j) {
            allPointsX[ j ] = Math.round(allPointsX[ j ] / canvasScale)
            allPointsY[ j ] = Math.round(allPointsY[ j ] / canvasScale)
          }
          this.canvasRegions[ i ].shape_attributes.set('all_points_x', allPointsX)
          this.canvasRegions[ i ].shape_attributes.set('all_points_y', allPointsY)
          break
      }
    }
  }
  loadStoreLocalImg (fileRef, fileName, size) {
    let imgId = this.getImageId(fileName, size)
    this.imgMetadata[ imgId ] = this.imageMetaData(fileRef, fileName, size)
    this.imageIdList.push(imgId)
    this.imgCount = this.imgCount + 1
  }
  showImage (imageIndex) {
    if (this.isLoadingCurrentImage) {
      return
    }
    let imgId = this.imageIdList[ imageIndex || 0 ]
    if (!this.imgMetadata.hasOwnProperty(imgId)) {
      return
    }
    let fileName = this.imgMetadata[ imgId ].fileName
    let imgReader = new FileReader()
    this.isLoadingCurrentImage = true
    imgReader.addEventListener('load', function () {
      this.currentImage = new Image()
      this.currentImage.addEventListener('error', function () {
        this.isLoadingCurrentImage = false
      }.bind(this), false)
      this.currentImage.addEventListener('abort', function () {
        this.isLoadingCurrentImage = false
      }.bind(this), false)
      this.currentImage.addEventListener('load', function () {
        // application
        this.imageId = imgId
        this.imageIndex = imageIndex
        this.currenImageFilename = fileName
        this.currentImageLoaded = true
        this.isLoadingCurrentImage = false
        // region
        this.clickX0 = 0
        this.clickX1 = 0
        this.clickY0 = 0
        this.clickY1 = 0
        this.isUserDrawingRegion = false
        this.isWindowResized = false
        this.isUserResizingRegion = false
        this.isUserMovingRegion = false
        this.isUserDrawingPolygon = false
        this.isRegionSelected = false
        this.userSelRegionId = -1
        this.currentImageWidth = this.currentImage.naturalWidth
        this.currentImageHeight = this.currentImage.naturalHeight
        // update canvas
        this.currentCanvasWidth = Math.round(this.currentImageWidth)
        this.currentCanvasHeight = Math.round(this.currentImageHeight)
        this.canvasScale = this.currentImage.naturalWidth / this.currentCanvasWidth
        this.canvasScaleWithoutZoom = this.canvasScale
        this.setAllCanvasSize(this.currentCanvasWidth, this.currentCanvasHeight)
        // image canvas
        this.imgCanvas.clearRect(0, 0, this.currentCanvasWidth, this.currentCanvasWidth)
        this.imgCtx.drawImage(this.currentImage, 0, 0, this.currentCanvasWidth, this.currentCanvasWidth)
        // region canvas
        this.loadCanvasRegions()
        this.redrawRegCanvas()
        this.regCanvas.focus()
        this.isLoadingCurrentImage = false
        this.currentImage.src = imgReader.result
      }.bind(this), false)
    }.bind(this), false)
    if (this.imgMetadata[ imgId ].base64_img_data === '') {
      imgReader.readAsDataURL(this.imgMetadata[ imgId ].fileRef)
    } else {
      imgReader.readAsText(new Blob([ this.imgMetadata[ imgId ].base64_img_data ]))
    }
  }
  createCanvas (id, width, height) {
    let canvas = document.createElement('canvas')
    canvas.id = id
    if (width && height) {
      canvas.width = width
      canvas.height = height
    }
    this.el.node().appendChild(canvas)
    return canvas
  }
  clearRegCanvas () {
    this.regCtx.clearRect(0, 0, this.regCanvas.width, this.regCanvas.height)
  }
  redrawImgCanvas () {
    if (this.currentImageLoaded) {
      this.imgCtx.clearRect(0, 0, this.imgCanvas.width, this.imgCanvas.height)
      this.imgCtx.drawImage(this.currentImage, 0, 0, this.imgCanvas.width, this.imgCanvas.height)
    }
  }
  redrawRegCanvas () {
    if (this.currentImageLoaded) {
      if (this.canvasRegions.length > 0) {
        this.regCtx.clearRect(0, 0, this.regCanvas.width, this.regCanvas.height)
        if (this.isRegionBoundaryVisible) {
          this.drawAllRegions()
        }
        if (this.isRegionIdVisible) {
          this.drawAllRegionId()
        }
      }
    }
  }
  drawControlPoint (cx, cy) {
    this.regCtx.beginPath()
    this.regCtx.arc(cx, cy, config.REGION_POINT_RADIUS, 0, 2 * Math.PI, false)
    this.regCtx.closePath()

    this.regCtx.fillStyle = config.THEME_CONTROL_POINT_COLOR
    this.regCtx.globalAlpha = 1.0
    this.regCtx.fill()
  }
  drawPolygonRegion (allPointsX, allPointsY, isSelected) {
    if (isSelected) {
      this.regCtx.beginPath()
      this.regCtx.moveTo(allPointsX[0], allPointsY[0])
      for (let i = 1; i < allPointsX.length; ++i) {
        this.regCtx.lineTo(allPointsX[i], allPointsY[i])
      }
      this.regCtx.strokeStyle = config.THEME_SEL_REGION_FILL_BOUNDARY_COLOR
      this.regCtx.lineWidth = config.THEME_REGION_BOUNDARY_WIDTH / 2
      this.regCtx.stroke()
      this.regCtx.fillStyle = config.THEME_SEL_REGION_FILL_COLOR
      this.regCtx.globalAlpha = config.THEME_SEL_REGION_OPACITY
      this.regCtx.fill()
      this.regCtx.globalAlpha = 1.0
      for (let i = 1; i < allPointsX.length; ++i) {
        this.drawControlPoint(allPointsX[i], allPointsY[i])
      }
    } else {
      for (let i = 1; i < allPointsX.length; i++) {
        this.regCtx.strokeStyle = config.THEME_BOUNDARY_FILL_COLOR
        this.regCtx.lineWidth = config.THEME_REGION_BOUNDARY_WIDTH / 2
        this.regCtx.moveTo(allPointsX[i - 1], allPointsY[i - 1])
        this.regCtx.lineTo(allPointsX[i], allPointsY[i])
        this.regCtx.stroke()
        let slope = (allPointsY[i] - allPointsY[i - 1]) / (allPointsX[i] - allPointsX[i - 1])
        if (slope > 0) {
          this.regCtx.strokeStyle = config.THEME_BOUNDARY_LINE_COLOR
          this.regCtx.lineWidth = config.THEME_REGION_BOUNDARY_WIDTH / 4
          this.regCtx.beginPath()
          this.regCtx.moveTo(parseInt(allPointsX[i - 1]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i - 1]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.lineTo(parseInt(allPointsX[i]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.stroke()
          this.regCtx.beginPath()
          this.regCtx.moveTo(parseInt(allPointsX[i - 1]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i - 1]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.lineTo(parseInt(allPointsX[i]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.stroke()
        } else {
          this.regCtx.strokeStyle = config.THEME_BOUNDARY_LINE_COLOR
          this.regCtx.lineWidth = config.THEME_REGION_BOUNDARY_WIDTH / 4
          this.regCtx.beginPath()
          this.regCtx.moveTo(parseInt(allPointsX[i - 1]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i - 1]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.lineTo(parseInt(allPointsX[i]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i]) + parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.stroke()
          this.regCtx.beginPath()
          this.regCtx.moveTo(parseInt(allPointsX[i - 1]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i - 1]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.lineTo(parseInt(allPointsX[i]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(allPointsY[i]) - parseInt(config.THEME_REGION_BOUNDARY_WIDTH / 4))
          this.regCtx.stroke()
        }
      }
    }
  }
  drawAllRegions () {
    let REGION_SHAPE = config.REGION_SHAPE
    this.canvasRegions.forEach(function (item) {
      let attr = item.shape_attributes
      let isSelected = item.is_user_selected
      switch (attr.get('name')) {
        case REGION_SHAPE.POLYGON:
          this.drawPolygonRegion(attr.get('all_points_x'), attr.get('all_points_y'), isSelected)
          break
      }
    })
  }
  drawAllRegionId () {
  }
}
export default GraphTag
