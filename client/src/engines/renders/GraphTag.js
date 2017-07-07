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
    if (this.currentCanvasWidth !== this.currentCanvasHeight) {
      this.currentCanvasHeight = this.currentCanvasWidth
    }
    this.imgCanvas = document.getElementById(this.options.image_canvas_id)
    this.imgCtx = this.imgCanvas.getContext('2d')
    this.regCanvas = document.getElementById(this.options.region_canvas_id)
    this.regCtx = this.regCanvas.getContext('2d')
    // this.imageMenu = document.getElementById('image_menu')
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
    if (h != w) {
      h = w
    }
    this.imgCanvas.width = w
    this.regCanvas.height = h
    this.regCanvas.width = w
  }

  imageMetaData (fileRef, fileName, size) {
    let metaInfo = {
      file_name: fileName,
      size: size,
      file_ref: fileRef,
      regions: [],
      file_attributes: {},
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
  // Loading Images and Loading Images
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
    let fileName = this.imgMetadata[ imgId ].file_name
    let imgReader = new FileReader()
    this.isLoadingCurrentImage = true
    imgReader.onload = function () {}.bind(this)
    imgReader.addEventListener('load', function () {}.bind(this), false)

    this.currentImage = new Image()

    this.currentImage.addEventListener('error', function () {
      this.isLoadingCurrentImage = false
    }.bind(this), false)

    this.currentImage.addEventListener('abort', function () {
      this.isLoadingCurrentImage = false
    }.bind(this), false)

    this.currentImage.onload =  function () {
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
      if (this.currentCanvasWidth != this.currentCanvasHeight) {
        this.currentCanvasHeight = this.currentCanvasWidth
      }
      // image canvas
      this.imgCtx.clearRect(0, 0, this.currentCanvasWidth, this.currentCanvasWidth)
      this.imgCtx.drawImage(this.currentImage, 0, 0, this.currentCanvasWidth, this.currentCanvasWidth)
      // region canvas
      this.loadCanvasRegions()
      this.redrawRegCanvas()
      this.regCanvas.focus()
      this.isLoadingCurrentImage = false
    }.bind(this)

    this.currentImage.src = this.imgMetadata[ imgId ].file_ref
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
    this.regCtx.shadowColor = 'transparent'
    this.imgMetadata[this.imageId].regions.forEach(function (region, i) {
      let canvasReg = this.canvasRegions[i]
      let box = this.getRegionBoundingBox(canvasReg)
      let x = box[0]
      let y = box[1]
      let w = Math.abs(box[2] - box[0])
      let h = Math.abs(box[3] - box[1])
      this.regCtx.font = config.THEME_ATTRIBUTE_VALUE_FONT
      let annotationStr = i + 1
      let bgndRectWidth = this.regCtx.measureText(annotationStr).width * 2
      if (canvasReg.shape_attributes.get('name') === config.REGION_SHAPE.POLYGON) {
        // put label near the first vertex
        x = canvasReg.shape_attributes.get('all_points_x')[0]
        y = canvasReg.shape_attributes.get('all_points_y')[0]
      } else {
        // center the label
        x = x - (bgndRectWidth / 2 - w / 2)
      }
      this.regCtx.fillStyle = 'black'
      this.regCtx.globalAlpha = 0.8
    })
  }
  getRegionBoundingBox (region) {
    let d = region.shape_attributes
    let box = new Array(4)
    switch (d.get('name')) {
      case 'polygon':
        let allPointsX = d.get('all_points_x')
        let allPointsY = d.get('all_points_y')
        let minX = Number.MAX_SAFE_INTEGER
        let minY = Number.MAX_SAFE_INTEGER
        let maxX = 0
        let maxY = 0
        allPointsX.forEach(function (item, i) {
          if (item < minX) {
            minX = item
          }
          if (item > maxX) {
            maxX = item
          }
          if (allPointsY[i] < minY) {
            minY = allPointsY[i]
          }
          if (allPointsY[i] > maxY) {
            maxY = allPointsY[i]
          }
        })
        box[0] = minX
        box[1] = minY
        box[2] = maxX
        box[3] = maxY
        break
    }
    return box
  }
  addEventListenerClick () {
    this.regCanvas.addEventListener('click', function (e) {
      console.log('click')
    }, false)
    return this
  }
  addEventListenerDBClick () {
    this.regCanvas.addEventListener('dblclick', function (e) {
      console.log('dblclick')
    }, false)
    return this
  }
  addEventListenerMousedown () {
    this.regCanvas.addEventListener('mousedown', function (e) {
      console.log('mousedown')
    }, false)
    return this
  }
  addEventListenerMouseup () {
    this.regCanvas.addEventListener('mouseup', function (e) {
      console.log('mouseup')
    }, false)
    return this
  }
  addEventListenerMouseover () {
    this.regCanvas.addEventListener('mouseover', function (e) {
      console.log('mouseover')
    }, false)
    return this
  }
  addEventListenerMousemove () {
    this.regCanvas.addEventListener('mousemove', function (e) {
      console.log('mousemove')
    }, false)
    return this
  }
}
export default GraphTag
