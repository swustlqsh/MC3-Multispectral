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
    this.currentPolygonRegionId = -1
    this.isUserDrawingPolygon = false
    this.isRegionSelected = false
    this.userSelRegionId = -1
    // application
    this.isRegionBoundaryVisible = true
    this.isRegionIdVisible = true
    this.currentShape = config.REGION_SHAPE.POLYGON

    return this
  }

  init (opts) {
    super.init(opts)
    // this.el.html('')
    this.currentImageWidth = this.el.node().clientWidth
    this.currentImageHeight = this.el.node().clientHeight
    // this.el.node().style.display = 'none'
    // image canvas
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

    this.currentImage.onload = function () {
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
    }.bind(this))
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
  // 辅助函数
  isLeft (x0, y0, x1, y1, x2, y2) {
    return (((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0)))
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
  selectOnlyRegion (id) {
    this.isRegionSelected = true
    this.userSelRegionId = id
  }
  isInsidePoint (cx, cy, px, py) {
    let dx = px - cx
    let dy = py - cy
    let r2 = config.POLYGON_VERTEX_MATCH_TOL * config.POLYGON_VERTEX_MATCH_TOL
    if ((dx * dx + dy * dy) < r2) {
      return true
    } else {
      return false
    }
  }
  isInsidePolygon (allPointsX, allPointsY, px, py) {
    let wn = 0
    // loop through all edges of the polygon
    for (let i = 0; i < allPointsX.length - 1; ++i) {
      let isLeftValue = this.isLeft(allPointsX[i], allPointsY[i], allPointsX[i + 1], allPointsY[i + 1], px, py)
      if (allPointsY[i] <= py) {
        if (allPointsY[i + 1] > py && isLeftValue > 0) {
          ++wn
        }
      } else {
        if (allPointsY[i + 1] <= py && isLeftValue < 0) {
          --wn
        }
      }
    }
    if (wn === 0) {
      return 0
    } else {
      return 1
    }
  }
  isInsideThisRegion (px, py, id) {
    let attr = this.canvasRegions[id].shape_attributes
    let result = false
    switch (attr.get('name')) {
      case config.REGION_SHAPE.POLYGON:
        result = this.isInsidePolygon(attr.get('all_points_x'), attr.get('all_points_y'), px, py)
        break
      case config.REGION_SHAPE.POINT:
        result = this.isInsidePoint(attr.get('cx'), attr.get('cy'), px, py)
        break
    }
    return result
  }
  isInsideRegion (px, py, order) {
    let n = this.canvasRegions.length
    if (n === 0) {
      return -1
    }
    let start
    let end
    let del
    if (order) {
      start = n - 1
      end = -1
      del = -1
    } else {
      start = 0
      end = n
      del = 1
    }
    let i = start
    while (i !== end) {
      let yes = this.isInsideThisRegion(px, py, i)
      if (yes) {
        return i
      }
      i = i + del
    }
    return -1
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
      this.clickX0 = e.offsetX
      this.clickY0 = e.offsetY
      let regionId = this.isInsideRegion(this.clickX0, this.clickY0)
      if (this.isRegionSelected) {

      } else {
        if (regionId === -1) {
          console.log('dd -1  mousedown')
          // mousedown outside a region
          if (this.currentShape !== config.REGION_SHAPE.POLYGON &&
            this.currentShape !== config.REGION_SHAPE.POINT) {
            console.log('dd -1-1  mousedown')
            // this is a bounding box drawing event
            this.isUserDrawingRegion = true
          }
        } else {
          console.log('dd -2  mousedown')
          // mousedown inside a region
          // this could lead to (1) region selection or (2) region drawing
          this.isUserDrawingRegion = true
        }
      }
      e.preventDefault()
    }.bind(this), false)
    return this
  }
  addEventListenerMouseup () {
    this.regCanvas.addEventListener('mouseup', function (e) {
      console.log('----------------------mouseup')
      this.clickX1 = e.offsetX
      this.clickY1 = e.offsetY
      let clickDX = Math.abs(this.clickX0 - this.clickX1)
      let clickDY = Math.abs(this.clickY0 - this.clickY1)
      if (clickDX < config.MOUSE_CLICK_TOL || clickDY < config.MOUSE_CLICK_TOL) {
        console.log('ddddddd')
        // 如果用户正在绘制多边形 每次click事件添加节点
        console.log(this.isUserDrawingPolygon === false ? 'false' : 'true')
        if (this.isUserDrawingPolygon) {
          console.log('isUserDrawingPolygon')
          let canvasX0 = Math.round(this.clickX0)
          let canvasY0 = Math.round(this.clickY0)
          // check if the clicked point is close to the first point
          let fx0 = this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_x')[0]
          let fy0 = this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_y')[0]
          let dx = fx0 - canvasX0
          let dy = fy0 - canvasY0
          if (Math.sqrt(dx * dx + dy * dy) <= config.POLYGON_VERTEX_MATCH_TOL) {
            // user clicked on the first polygon point to close the path
            this.isUserDrawingPolygon = false
            // add all polygon points stored in _via_canvas_regions[]
            let allPointsX = this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_x').slice(0)
            let allPointsY = this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_y').slice(0)
            let canvasAllPointsX = this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_x')
            let canvasAllPointsY = this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_y')
            allPointsX.push(allPointsX[0])
            allPointsY.push(allPointsY[0])
            canvasAllPointsX.push(canvasAllPointsX[0])
            canvasAllPointsY.push(canvasAllPointsY[0])
            let pointsStr = ''
            for (let i = 0; i < allPointsX.length; ++i) {
              allPointsX[i] = Math.round(allPointsX[i] * this.canvasScale)
              allPointsY[i] = Math.round(allPointsY[i] * this.canvasScale)
              pointsStr += allPointsX[i] + ' ' + allPointsY[i] + ','
            }
            pointsStr = pointsStr.substring(0, pointsStr.length - 1) // remove last comma
            let polygonRegion = new ImageRegion()
            polygonRegion.shape_attributes.set('name', 'polygon')
            polygonRegion.shape_attributes.set('all_points_x', allPointsX)
            polygonRegion.shape_attributes.set('all_points_y', allPointsY)
            this.currentPolygonRegionId = this.imgMetadata[this.imageId].regions.length
            this.imgMetadata[this.imageId].regions.push(polygonRegion)
            // newly drawn region is automatically selected
            this.selectOnlyRegion(this.currentPolygonRegionId)
            this.currentPolygonRegionId = -1
          } else {
            // user clicked on a new polygon point
            this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_x').push(canvasX0)
            this.canvasRegions[this.currentPolygonRegionId].shape_attributes.get('all_points_y').push(canvasY0)
          }
        } else {
          let regionId = this.isInsideRegion(this.clickX0, this.clickY0)
          if (regionId >= 1) {
            // 在区域内
            this.userSelRegionId = regionId
            this.isRegionSelected = true
            this.isUserDrawingRegion = false
            this.userSelRegionId = -1
          } else {
            // 在区域外
            console.log('_via_current_shape', this.currentShape)
            switch (this.currentShape) {
              case config.REGION_SHAPE.POLYGON:
                // user has clicked on the first point in a new polygon
                this.isUserDrawingPolygon = true
                let canvasPolygonRegion = new ImageRegion()
                canvasPolygonRegion.shape_attributes.set('name', config.REGION_SHAPE.POLYGON)
                canvasPolygonRegion.shape_attributes.set('all_points_x', [Math.round(this.clickX0)])
                canvasPolygonRegion.shape_attributes.set('all_points_y', [Math.round(this.clickY0)])
                this.canvasRegions.push(canvasPolygonRegion)
                this.currentPolygonRegionId = this.canvasRegions.length - 1
                break
              case config.REGION_SHAPE.POINT:
                // user has marked a landmark point
                let pointRegion = new ImageRegion()
                pointRegion.shape_attributes.set('name', config.REGION_SHAPE.POINT)
                pointRegion.shape_attributes.set('cx', [Math.round(this.clickX0 * this.canvasScale)])
                pointRegion.shape_attributes.set('cy', [Math.round(this.clickY0 * this.canvasScale)])
                this.imgMetadata[this.imageId].regions.push(pointRegion)
                let canvasPointRegion = new ImageRegion()
                canvasPointRegion.shape_attributes.set('name', config.REGION_SHAPE.POINT)
                canvasPointRegion.shape_attributes.set('cx', [Math.round(this.clickX0)])
                canvasPointRegion.shape_attributes.set('cy', [Math.round(this.clickY0)])
                this.canvasRegions.push(canvasPointRegion)
                break
            }
          }
        }
        this.redrawRegCanvas()
        this.regCanvas.focus()
        return
      }
      // 默认没有选中任何图片
      this.isUserDrawingRegion = false
      this.isUserDrawingPolygon = true
      this.isRegionSelected = false
      // 处理多边形信息
    }.bind(this), false)
    return this
  }
  addEventListenerMouseover () {
    this.regCanvas.addEventListener('mouseover', function (e) {
      console.log('mouseover')
    }.bind(this), false)
    return this
  }
  addEventListenerMousemove () {
    this.regCanvas.addEventListener('mousemove', function (e) {
      console.log('mousemove')
      if (!this.currentImageLoaded) {
        return
      }
      console.log(this.currentImageLoaded, 'this.currentImageLoaded')
      let currentX = e.offsetX
      let currentY = e.offsetY
      console.log(currentX, currentY)
      if (this.isRegionSelected) {
        console.log('isRegionSelected')
      }
      if (this.isUserDrawingRegion) {
        console.log('isUserDrawingRegion')
        console.log(this.canvasRegions)
        if (this.canvasRegions.length) {
          this.redrawRegCanvas()
        } else {
          this.regCtx.clearRect(0, 0, this.regCanvas.width, this.regCanvas.height)
        }
        let regionXOne
        let regionY0ne
        if (this.clickX0 < currentX) {
          if (this.clickY0 < currentY) {
            regionXOne = this.clickX0
            regionY0ne = this.clickY0
          } else {
            regionXOne = this.clickX0
            regionY0ne = currentY
          }
        } else {
          if (this.clickY0 < currentY) {
            regionXOne = currentX
            regionY0ne = this.clickY0
          } else {
            regionXOne = currentX
            regionY0ne = currentY
          }
        }
        let dx = Math.round(Math.abs(currentX - this.clickX0))
        let dy = Math.round(Math.abs(currentY - this.clickY0))
        switch (this.currentShape) {
          case config.REGION_SHAPE.POLYGON:
            break
        }
        this.regCanvas.focus()
      }
      if (this.isUserDrawingPolygon) {
        this.redrawRegCanvas()
        let attr = this.canvasRegions[this.currentPolygonRegionId].shape_attributes
        let allPointsX = attr.get('all_points_x')
        let allPointsY = attr.get('all_points_y')
        let npts = allPointsX.length
        let lineX = [allPointsX.slice(npts - 1), currentX]
        let lineY = [allPointsY.slice(npts - 1), currentY]
        this.drawPolygonRegion(lineX, lineY, false)
      }
    }.bind(this), false)
    return this
  }
}
export default GraphTag
