/**
 * Created by liqiusheng on 09/07/2017.
 */

import Render from './Render'

/**
 按住鼠标左键，拖动鼠标，释放鼠标左键，
 形成一条边，然后在释放处是该条边的终点，
 同时又是另一条边的起点，然后最后在最开始的边的起点附近单击，画出最后一条边
 */


let VIA_REGION_SHAPE = {
  POLYGON: 'polygon',
  POINT: 'point'
}
let VIA_REGION_EDGE_TOL = 5
let VIA_REGION_CONTROL_POINT_SIZE = 2
let VIA_REGION_POINT_RADIUS = 3
let VIA_POLYGON_VERTEX_MATCH_TOL = 5
let VIA_REGION_MIN_DIM = 3
let VIA_MOUSE_CLICK_TOL = 2
let VIA_ELLIPSE_EDGE_TOL = 0.2
let VIA_THETA_TOL = Math.PI / 18
let VIA_POLYGON_RESIZE_VERTEX_OFFSET = 100
let VIA_CANVAS_DEFAULT_ZOOM_LEVEL_INDEX = 3
let VIA_CANVAS_ZOOM_LEVELS = [ 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0, 4, 5 ]
let VIA_THEME_REGION_BOUNDARY_WIDTH = 4
let VIA_THEME_BOUNDARY_LINE_COLOR = '#1a1a1a'
let VIA_THEME_BOUNDARY_FILL_COLOR = '#aaeeff'
let VIA_THEME_SEL_REGION_FILL_COLOR = '#808080'
let VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR = '#000000'
let VIA_THEME_SEL_REGION_OPACITY = 0.5
let VIA_THEME_MESSAGE_TIMEOUT_MS = 2500
let VIA_THEME_ATTRIBUTE_VALUE_FONT = '10pt Sans'
let VIA_THEME_CONTROL_POINT_COLOR = '#ff0000'

// Data structure for annotations
function ImageMetadata (fileref, filename, size) {
  this.filename = filename
  this.size = size
  this.fileref = fileref         // image url or local file ref.
  this.regions = []
  this.file_attributes = new Map() // image attributes
  this.base64_img_data = ''        // image data stored as base 64
}

function ImageRegion () {
  this.is_user_selected = false
  this.shape_attributes = new Map() // region shape attributes
  this.region_attributes = new Map() // region attributes
}

class Polyline extends Render {
  constructor (opts) {
    super(opts)
    this.el = window.d3.select(this.selector)
    this._via_img_metadata = {}     // data structure to store loaded images metadata
    this._via_img_count = 0      // count of the loaded images
    this._via_canvas_regions = []   // image regions spec. in canvas space
    this._via_canvas_scale = 1  // current scale of canvas image
    this._via_canvas_width_scale = 1
    this._via_canvas_height_scale = 1

    this._via_image_id_list = []   // array of image id (in original order)
    this._via_image_id = ''   // id={filename+length} of current image
    this._via_image_index = -1   // index
    this._via_current_image = undefined
    this._via_current_image_width = 0
    this._via_current_image_height = 0

    // image canvas
    this._via_img_canvas = undefined
    this._via_img_ctx = undefined
    this._via_reg_canvas = undefined
    this._via_reg_ctx = undefined

    this._via_canvas_width = 0
    this._via_canvas_height = 0
    // image
    this._via_div_real_width = 0
    this._via_div_real_height = 0
    // canvas zoom
    this._via_canvas_zoom_level_index = VIA_CANVAS_DEFAULT_ZOOM_LEVEL_INDEX
    this._via_canvas_scale_without_zoom = 1.0

    // state of the application
    this._via_is_user_drawing_region = false
    this._via_current_image_loaded = false
    this._via_is_window_resized = false
    this._via_is_user_resizing_region = false
    this._via_is_user_moving_region = false
    this._via_is_user_drawing_polygon = false
    this._via_is_region_selected = false

    this._via_is_canvas_zoomed = false
    this._via_is_loading_current_image = false
    this._via_is_region_id_visible = true
    this._via_is_region_boundary_visible = true

    // region
    this._via_current_shape = VIA_REGION_SHAPE.POLYGON
    this._via_current_polygon_region_id = -1
    this._via_user_sel_region_id = -1
    this._via_click_x0 = 0
    this._via_click_y0 = 0
    this._via_click_x1 = 0
    this._via_click_y1 = 0
    this._via_region_click_x = 0
    this._via_region_click_y = 0
    this._via_region_edge = [ -1, -1 ]

    return this
  }
  init (opts) {
    super.init(opts)
    this._via_div_real_width = this.options.image_real_width
    this._via_div_real_height = this.options.image_real_height
    // image canvas
    this._via_img_canvas = document.getElementById(this.options.image_canvas_id)
    this._via_img_ctx = this._via_img_canvas.getContext('2d')
    // region canvas
    this._via_reg_canvas = document.getElementById(this.options.region_canvas_id)
    this._via_reg_ctx = this._via_reg_canvas.getContext('2d')
    return this
  }
  setAllCanvasSize (w, h) {
    this._via_img_canvas.height = h
    this._via_img_canvas.width = w
    this._via_reg_canvas.height = h
    this._via_reg_canvas.width = w
  }
  setShowImage (src) {
    this._via_is_loading_current_image = true
    this._via_current_image = new Image()
    this._via_current_image.onload = function () {
      // application
      this._via_current_image_loaded = true
      this._via_is_loading_current_image = false
      // region
      this._via_click_x0 = 0
      this._via_click_y0 = 0
      this._via_click_x1 = 0
      this._via_click_y1 = 0

      this._via_is_user_drawing_region = false
      this._via_is_window_resized = false
      // user 交互相关
      this._via_is_user_resizing_region = false
      this._via_is_user_moving_region = false
      this._via_is_user_drawing_polygon = false
      // 图片实际的大小
      this._via_current_image_width = this._via_current_image.naturalWidth
      this._via_current_image_height = this._via_current_image.naturalHeight

      console.log('this._via_div_real_width', this._via_div_real_width)
      console.log('this._via_div_real_height', this._via_div_real_height)

      this._via_canvas_width = this._via_current_image_width
      this._via_canvas_height = this._via_current_image_height

      if (this._via_canvas_width > this._via_div_real_width) {
        let scaleWidth = this._via_div_real_width / this._via_current_image.naturalWidth
        this._via_canvas_width = this._via_div_real_width
        this._via_canvas_height = this._via_current_image.naturalHeight * scaleWidth
      }
      if (this._via_canvas_height > this._via_div_real_height) {
        let scaleHeight = this._via_div_real_height / this._via_canvas_height
        this._via_canvas_height = this._via_div_real_height
        this._via_canvas_width = this._via_canvas_width * scaleHeight
      }
      this._via_canvas_width = Math.round(this._via_canvas_width)
      this._via_canvas_height = Math.round(this._via_canvas_height)

      this._via_canvas_scale = this._via_current_image.naturalWidth / this._via_canvas_width
      console.log('this._via_canvas_scale', this._via_canvas_scale)
      this._via_canvas_width_scale = this._via_current_image.naturalWidth / this._via_canvas_width
      this._via_canvas_height_scale = this._via_current_image.naturalHeight / this._via_canvas_height

      this._via_canvas_scale_without_zoom = this._via_canvas_scale

      this.setAllCanvasSize(this._via_canvas_width, this._via_canvas_height)
      // image canvas
      this._via_img_ctx.clearRect(0, 0, this._via_canvas_width, this._via_canvas_height)
      this._via_img_ctx.drawImage(this._via_current_image, 0, 0, this._via_canvas_width, this._via_canvas_height)
      // 清空当前的 region canvas
      this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
      this._via_reg_canvas.focus()
    }.bind(this)
    this._via_current_image.src = src
    this._via_img_metadata[0] = new ImageMetadata(src, src, '')
  }
  selectOnlyRegion (region_id) {
    this.setRegionSelectState(region_id, true)
    this._via_is_region_selected = true
    this._via_user_sel_region_id = region_id
  }
  _viaRedrawRegCanvas () {
    if (this._via_current_image_loaded) {
      if (this._via_canvas_regions.length > 0) {
        this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
        if (this._via_is_region_boundary_visible) {
          this.drawAllRegions()
        }
        // if (this._via_is_region_id_visible) {
        //   this.drawAllRegionId()
        // }
      }
    }
  }
  drawAllRegions () {
    for (let i = 0; i < this._via_canvas_regions.length; ++i) {
      let attr = this._via_canvas_regions[ i ].shape_attributes
      let is_selected = this._via_canvas_regions[ i ].is_user_selected
      switch (attr.get('name')) {
        case VIA_REGION_SHAPE.POLYGON:
          this._viaDrawPolygonRegion(attr.get('all_points_x'), attr.get('all_points_y'), is_selected)
          break
        case VIA_REGION_SHAPE.POINT:
          this._viaDrawPointRegion(attr.get('cx'), attr.get('cy'), is_selected)
          break
      }
    }
  }
  _viaDrawPolygonRegion (all_points_x, all_points_y, is_selected) {
    if (is_selected) {
      this._via_reg_ctx.beginPath()
      this._via_reg_ctx.moveTo(all_points_x[ 0 ], all_points_y[ 0 ])
      for (let i = 1; i < all_points_x.length; ++i) {
        this._via_reg_ctx.lineTo(all_points_x[ i ], all_points_y[ i ])
      }
      this._via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR
      this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 2
      this._via_reg_ctx.stroke()

      this._via_reg_ctx.fillStyle = VIA_THEME_SEL_REGION_FILL_COLOR
      this._via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY
      this._via_reg_ctx.fill()
      this._via_reg_ctx.globalAlpha = 1.0

      for (let i = 1; i < all_points_x.length; ++i) {
        this._viaDrawControlPoint(all_points_x[ i ], all_points_y[ i ])
      }
    } else {
      for (let i = 1; i < all_points_x.length; ++i) {
        // draw a fill line
        this._via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_FILL_COLOR
        this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 2
        this._via_reg_ctx.beginPath()
        this._via_reg_ctx.moveTo(all_points_x[ i - 1 ], all_points_y[ i - 1 ])
        this._via_reg_ctx.lineTo(all_points_x[ i ], all_points_y[ i ])
        this._via_reg_ctx.stroke()

        let slope_i = (all_points_y[ i ] - all_points_y[ i - 1 ]) / (all_points_x[ i ] - all_points_x[ i - 1 ])
        if (slope_i > 0) {
          // draw a boundary line on both sides
          this._via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR
          this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 4
          this._via_reg_ctx.beginPath()
          this._via_reg_ctx.moveTo(parseInt(all_points_x[ i - 1 ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i - 1 ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.lineTo(parseInt(all_points_x[ i ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.stroke()
          this._via_reg_ctx.beginPath()
          this._via_reg_ctx.moveTo(parseInt(all_points_x[ i - 1 ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i - 1 ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.lineTo(parseInt(all_points_x[ i ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.stroke()
        } else {
          // draw a boundary line on both sides
          this._via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR
          this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 4
          this._via_reg_ctx.beginPath()
          this._via_reg_ctx.moveTo(parseInt(all_points_x[ i - 1 ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i - 1 ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.lineTo(parseInt(all_points_x[ i ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i ]) + parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.stroke()
          this._via_reg_ctx.beginPath()
          this._via_reg_ctx.moveTo(parseInt(all_points_x[ i - 1 ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i - 1 ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.lineTo(parseInt(all_points_x[ i ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4),
            parseInt(all_points_y[ i ]) - parseInt(VIA_THEME_REGION_BOUNDARY_WIDTH / 4))
          this._via_reg_ctx.stroke()
        }
      }
    }
  }
  is_inside_this_region (px, py, region_id) {
    let attr = this._via_canvas_regions[ region_id ].shape_attributes
    let result = false
    switch (attr.get('name')) {
      case VIA_REGION_SHAPE.POLYGON:
        result = this.isInsidePolygon(attr.get('all_points_x'), attr.get('all_points_y'), px, py)
        break

      case VIA_REGION_SHAPE.POINT:
        result = this.isInsidePoint(attr.get('cx'), attr.get('cy'), px, py)
        break
    }
    return result
  }
  // event
  clickEvent (e) {
    console.log('e', e)
  }
  // 开始绘制 多边 起点
  handleMouseDown (e) {
    this._via_click_x0 = e.offsetX
    this._via_click_y0 = e.offsetY
    this._via_is_user_drawing_polygon = true
    console.log('handleMouseDown', this._via_click_x0, this._via_click_y0)
    e.preventDefault()
  }

  // Region collision routines
  isInsideRegion (px, py, descending_order) {
    let N = this._via_canvas_regions.length
    if (N === 0) {
      return -1
    }
    let start
    let end
    let del
    if (descending_order) {
      start = N - 1
      end = -1
      del = -1
    } else {
      start = 0
      end = N
      del = 1
    }

    let i = start
    while (i !== end) {
      let yes = this.is_inside_this_region(px, py, i)
      if (yes) {
        return i
      }
      i = i + del
    }
    return -1
  }
  // 第二个点
  handleMouseUp (e) {
    console.log('handleMouseUp')
    this._via_click_x1 = e.offsetX
    this._via_click_y1 = e.offsetY

    let click_dx = Math.abs(this._via_click_x1 - this._via_click_x0)
    let click_dy = Math.abs(this._via_click_y1 - this._via_click_y0)

    if (click_dx < VIA_MOUSE_CLICK_TOL || click_dy < VIA_MOUSE_CLICK_TOL) {
      if (this._via_is_user_drawing_polygon) {
        let canvas_x0 = Math.round(this._via_click_x0)
        let canvas_y0 = Math.round(this._via_click_y0)

        // check if the clicked point is close to the first point
        let fx0 = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_x')[ 0 ]
        let fy0 = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_y')[ 0 ]
        let dx = (fx0 - canvas_x0)
        let dy = (fy0 - canvas_y0)
        if (Math.sqrt(dx * dx + dy * dy) <= VIA_POLYGON_VERTEX_MATCH_TOL) {
          // user clicked on the first polygon point to close the path
          this._via_is_user_drawing_polygon = false

          // add all polygon points stored in _via_canvas_regions[]
          let all_points_x = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_x').slice(0)
          let all_points_y = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_y').slice(0)
          let canvas_all_points_x = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_x')
          let canvas_all_points_y = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_y')

          // close path
          all_points_x.push(all_points_x[ 0 ])
          all_points_y.push(all_points_y[ 0 ])
          canvas_all_points_x.push(canvas_all_points_x[ 0 ])
          canvas_all_points_y.push(canvas_all_points_y[ 0 ])
          let polygon_region = new ImageRegion()
          polygon_region.shape_attributes.set('name', 'polygon')
          polygon_region.shape_attributes.set('all_points_x', all_points_x)
          polygon_region.shape_attributes.set('all_points_y', all_points_y)
          console.log('this._via_img_metadata', this._via_img_metadata)
          this._via_current_polygon_region_id = this._via_img_metadata[ 0 ].regions.length
          this._via_img_metadata[ this._via_image_id ].regions.push(polygon_region)

          // newly drawn region is automatically selected
          this.selectOnlyRegion(this._via_current_polygon_region_id)

          // this._via_current_polygon_region_id = -1
          // this.update_attributes_panel()
        } else {
          // user clicked on a new polygon point
          this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_x').push(canvas_x0)
          this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes.get('all_points_y').push(canvas_y0)
        }
      } else {
        let region_id = this.isInsideRegion(this._via_click_x0, this._via_click_y0)
        if (region_id >= 0) {
          // first click selects region
          this._via_user_sel_region_id = region_id
          this._via_is_region_selected = true
          this._via_is_user_moving_region = false
          this._via_is_user_drawing_region = false

          // de-select all other regions if the user has not pressed Shift
          // if (!e.shiftKey) {
          //   this.toggleAllRegionsSelection(false)
          // }
          // this.setRegionSelectState(region_id, true)
          // this.update_attributes_panel()
        } else {
          if (this._via_is_user_drawing_region) {
            // clear all region selection
            this._via_is_user_drawing_region = false
            this._via_is_region_selected = false
            this._via_use_sel_region_id = -1
            // this.toggleAllRegionsSelection(false)
            // this.update_attributes_panel()
          } else {
            switch (this._via_current_shape) {
              case VIA_REGION_SHAPE.POLYGON:
                // user has clicked on the first point in a new polygon
                this._via_is_user_drawing_polygon = true

                let canvas_polygon_region = new ImageRegion()
                canvas_polygon_region.shape_attributes.set('name', VIA_REGION_SHAPE.POLYGON)
                canvas_polygon_region.shape_attributes.set('all_points_x', [ Math.round(this._via_click_x0) ])
                canvas_polygon_region.shape_attributes.set('all_points_y', [ Math.round(this._via_click_y0) ])
                this._via_canvas_regions.push(canvas_polygon_region)
                this._via_current_polygon_region_id = this._via_canvas_regions.length - 1
                break
              case VIA_REGION_SHAPE.POINT:
                // user has marked a landmark point
                let point_region = new ImageRegion()
                point_region.shape_attributes.set('name', VIA_REGION_SHAPE.POINT)
                point_region.shape_attributes.set('cx', Math.round(this._via_click_x0 * this._via_canvas_scale))
                point_region.shape_attributes.set('cy', Math.round(this._via_click_y0 * this._via_canvas_scale))
                this._via_img_metadata[ this._via_image_id ].regions.push(point_region)

                let canvas_point_region = new ImageRegion()
                canvas_point_region.shape_attributes.set('name', VIA_REGION_SHAPE.POINT)
                canvas_point_region.shape_attributes.set('cx', Math.round(this._via_click_x0))
                canvas_point_region.shape_attributes.set('cy', Math.round(this._via_click_y0))
                this._via_canvas_regions.push(canvas_point_region)

                // this.update_attributes_panel()
                break
            }
          }
        }
      }
      this._viaRedrawRegCanvas()
      this._via_reg_canvas.focus()
      return
    }
  }

  handleMouseMove(e) {
    this._via_current_x = e.offsetX
    this._via_current_y = e.offsetY
    console.log(this._via_is_user_drawing_polygon)
    if (this._via_is_user_drawing_polygon) {
      this._viaRedrawRegCanvas()
      console.log(this._via_canvas_regions)
      let attr = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes
      let all_points_x = attr.get('all_points_x')
      let all_points_y = attr.get('all_points_y')
      let npts = all_points_x.length

      let line_x = [ all_points_x.slice(npts - 1), this._via_current_x ]
      let line_y = [ all_points_y.slice(npts - 1), this._via_current_y ]
      this._viaDrawPolygonRegion(line_x, line_y, false)
    }
  }

  regionBindAllEvent () {
    // for (let event in this.events) {
    //   this._via_reg_canvas.addEventListener(event, this.events[event].bind(this))
    // }
    // this._via_reg_canvas.addEventListener('dblclick', this.events['dblclick'])
    this._via_reg_canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this._via_reg_canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this._via_reg_canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))

  }

}
export default Polyline