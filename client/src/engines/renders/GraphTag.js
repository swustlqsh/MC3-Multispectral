/**
 * Created by liqiusheng@b.360.cn on 2017/7/7.
 */
import Render from './Render'

let VIA_SHORT_NAME = 'VIA'
let VIA_REGION_SHAPE = {
  RECT: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
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

let VIA_CSV_SEP = ','
let VIA_CSV_QUOTE_CHAR = '"'
let VIA_CSV_KEYVAL_SEP = ':'
let VIA_IMPORT_CSV_COMMENT_CHAR = '#'

let BBOX_LINE_WIDTH = 4
let BBOX_SELECTED_OPACITY = 0.3
let BBOX_BOUNDARY_FILL_COLOR_ANNOTATED = '#f2f2f2'
let BBOX_BOUNDARY_FILL_COLOR_NEW = '#aaeeff'
let BBOX_BOUNDARY_LINE_COLOR = '#1a1a1a'
let BBOX_SELECTED_FILL_COLOR = '#ffffff'

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

class GraphTag extends Render {
  constructor (opts) {
    super(opts)
    this.el = window.d3.select(this.selector)
    this._via_img_metadata = {}     // data structure to store loaded images metadata
    this._via_img_count = 0      // count of the loaded images
    this._via_canvas_regions = []   // image regions spec. in canvas space
    this._via_canvas_scale = 1.0  // current scale of canvas image
    this._via_canvas_width_scale = 1.0
    this._via_canvas_height_scale = 1.0

    this._via_image_id_list = []   // array of image id (in original order)
    this._via_image_id = ''   // id={filename+length} of current image
    this._via_image_index = -1   // index

    this._via_current_image_filename = ''
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
    this._via_is_all_region_selected = false
    this._via_is_user_updating_attribute_name = false
    this._via_is_user_updating_attribute_value = false
    this._via_is_user_adding_attribute_name = false
    this._via_is_loaded_img_list_visible = false
    this._via_is_attributes_panel_visible = false
    this._via_is_reg_attr_panel_visible = false
    this._via_is_file_attr_panel_visible = false
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
    this._via_copied_image_regions = []
    this._via_region_edge = [ -1, -1 ]

    // message
    this._via_message_clear_timer = undefined

    // attributes
    this._via_region_attributes = new Set()
    this._via_current_update_attribute_name = ''
    this._via_current_update_region_id = -1
    this._via_file_attributes = new Set()
    this._via_visible_attr_name = ''

    // persistence to local storage
    this._via_is_local_storage_available = false
    this._via_is_save_ongoing = false

    // image list
    this._via_reload_img_table = true
    this._via_loaded_img_fn_list = []
    this._via_loaded_img_region_attr_miss_count = []
    this._via_loaded_img_file_attr_miss_count = []
    this._via_loaded_img_table_html = []
    return this
  }

  init (opts) {
    super.init(opts)
    this._via_div_real_width = this.options.image_real_width
    this._via_div_real_height = this.options.image_real_height
    // image canvas
    this._via_img_canvas = document.getElementById(this.options.image_canvas_id)
    this._via_img_ctx = this._via_img_canvas.getContext('2d')
    this._via_reg_canvas = document.getElementById(this.options.region_canvas_id)
    this._via_reg_ctx = this._via_reg_canvas.getContext('2d')
    return this
  }

  // load image

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
    let regions = this._via_img_metadata[ this.imageId ].regions
    this.canvasRegions = []
    let REGION_SHAPE = VIA_REGION_SHAPE
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
    this._via_img_metadata[ imgId ] = new ImageMetadata(fileRef, fileName, size)
    this._via_image_id_list.push(imgId)
    this._via_img_count = this._via_img_count + 1
  }

  setAllCanvasSize (w, h) {
    this._via_img_canvas.height = h
    this._via_img_canvas.width = w
    this._via_reg_canvas.height = h
    this._via_reg_canvas.width = w
  }

  // Canvas update routines
  loadCanvasRegions () {
    let regions = this._via_img_metadata[ this._via_image_id ].regions
    this._via_canvas_regions = []
    let canvasScale = this._via_canvas_scale
    for (let i = 0; i < regions.length; i++) {
      let regioni = new ImageRegion()
      for (let key of regions[ i ].shape_attributes.keys()) {
        let value = regions[ i ].shape_attributes.get(key)
        regioni.shape_attributes.set(key, value)
      }
      this._via_canvas_regions.push(regioni)
      switch (this._via_canvas_regions[ i ].shape_attributes.get('name')) {
        case VIA_REGION_SHAPE.POLYGON:
          let allPointsX = regions[ i ].shape_attributes.get('all_points_x').slice(0)
          let allPointsY = regions[ i ].shape_attributes.get('all_points_y').slice(0)
          for (let j = 0; j < allPointsX.length; ++j) {
            allPointsX[ j ] = Math.round(allPointsX[ j ] / canvasScale)
            allPointsY[ j ] = Math.round(allPointsY[ j ] / canvasScale)
          }
          this._via_canvas_regions[ i ].shape_attributes.set('all_points_x', allPointsX)
          this._via_canvas_regions[ i ].shape_attributes.set('all_points_y', allPointsY)
          break
        case VIA_REGION_SHAPE.POINT:
          let cx = regions[ i ].shape_attributes.get('cx') / canvasScale
          let cy = regions[ i ].shape_attributes.get('cy') / canvasScale

          this._via_canvas_regions[ i ].shape_attributes.set('cx', Math.round(cx))
          this._via_canvas_regions[ i ].shape_attributes.set('cy', Math.round(cy))
          break
      }
    }
  }

  _viaClearRegCanvas () {
    this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
  }

  _viaDrawControlPoint (cx, cy) {
    this._via_reg_ctx.beginPath()
    this._via_reg_ctx.beginPath()
    this._via_reg_ctx.beginPath()
    this._via_reg_ctx.beginPath()
    this._via_reg_ctx.arc(cx, cy, VIA_REGION_POINT_RADIUS, 0, 2 * Math.PI, false)
    this._via_reg_ctx.beginPath()
    this._via_reg_ctx.closePath()
    this._via_reg_ctx.fillStyle = VIA_THEME_CONTROL_POINT_COLOR
    this._via_reg_ctx.globalAlpha = 1.0
    this._via_reg_ctx.fill()
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

        var slope_i = (all_points_y[ i ] - all_points_y[ i - 1 ]) / (all_points_x[ i ] - all_points_x[ i - 1 ])
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

  _viaDrawPoint (cx, cy, r) {
    this._via_reg_ctx.beginPath()
    this._via_reg_ctx.arc(cx, cy, r, 0, 2 * Math.PI, false)
    this._via_reg_ctx.closePath()
  }

  isInsidePolygon (all_points_x, all_points_y, px, py) {
    let wn = 0
    for (let i = 0; i < all_points_x.length - 1; ++i) {
      let isLeft_value = this.isLeft(all_points_x[ i ], all_points_y[ i ], all_points_x[ i + 1 ], all_points_y[ i + 1 ], px, py)
      if (all_points_y[ i ] <= py) {
        if (all_points_y[ i + 1 ] > py && isLeft_value > 0) {
          ++wn
        }
      } else {
        if (all_points_y[ i + 1 ] <= py && isLeft_value < 0) {
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

  isInsidePoint (cx, cy, px, py) {
    let dx = px - cx
    let dy = py - cy
    let r2 = VIA_POLYGON_VERTEX_MATCH_TOL * VIA_POLYGON_VERTEX_MATCH_TOL
    if ((dx * dx + dy * dy) < r2) {
      return true
    } else {
      return false
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

  _viaDrawPoint_region (cx, cy, is_selected) {
    if (is_selected) {
      this._viaDrawPoint(cx, cy, VIA_REGION_POINT_RADIUS)

      this._via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR
      this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 2
      this._via_reg_ctx.stroke()

      this._via_reg_ctx.fillStyle = VIA_THEME_SEL_REGION_FILL_COLOR
      this._via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY
      this._via_reg_ctx.fill()
      this._via_reg_ctx.globalAlpha = 1.0
    } else {
      // draw a fill line
      this._via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_FILL_COLOR
      this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 2
      this._viaDrawPoint(cx, cy, VIA_REGION_POINT_RADIUS)
      this._via_reg_ctx.stroke()

      // draw a boundary line on both sides of the fill line
      this._via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR
      this._via_reg_ctx.lineWidth = VIA_THEME_REGION_BOUNDARY_WIDTH / 4
      this._viaDrawPoint(cx, cy, VIA_REGION_POINT_RADIUS - VIA_THEME_REGION_BOUNDARY_WIDTH / 2)
      this._via_reg_ctx.stroke()
      this._viaDrawPoint(cx, cy, VIA_REGION_POINT_RADIUS + VIA_THEME_REGION_BOUNDARY_WIDTH / 2)
      this._via_reg_ctx.stroke()
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
          this._viaDrawPoint_region(attr.get('cx'), attr.get('cy'), is_selected)
          break
      }
    }
  }

  getRegionBoundingBox (region) {
    let d = region.shape_attributes
    let bbox = new Array(4)

    switch (d.get('name')) {
      case 'polygon':
        let all_points_x = d.get('all_points_x')
        let all_points_y = d.get('all_points_y')

        let minx = Number.MAX_SAFE_INTEGER
        let miny = Number.MAX_SAFE_INTEGER
        let maxx = 0
        let maxy = 0
        for (let i = 0; i < all_points_x.length; ++i) {
          if (all_points_x[ i ] < minx) {
            minx = all_points_x[ i ]
          }
          if (all_points_x[ i ] > maxx) {
            maxx = all_points_x[ i ]
          }
          if (all_points_y[ i ] < miny) {
            miny = all_points_y[ i ]
          }
          if (all_points_y[ i ] > maxy) {
            maxy = all_points_y[ i ]
          }
        }
        bbox[ 0 ] = minx
        bbox[ 1 ] = miny
        bbox[ 2 ] = maxx
        bbox[ 3 ] = maxy
        break

      case 'point':
        bbox[ 0 ] = d.get('cx') - VIA_REGION_POINT_RADIUS
        bbox[ 1 ] = d.get('cy') - VIA_REGION_POINT_RADIUS
        bbox[ 2 ] = d.get('cx') + VIA_REGION_POINT_RADIUS
        bbox[ 3 ] = d.get('cy') + VIA_REGION_POINT_RADIUS
        break
    }
    return bbox
  }

  isLeft (x0, y0, x1, y1, x2, y2) {
    return (((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0)) )
  }

  drawAllRegionId () {
    this._via_reg_ctx.shadowColor = 'transparent'
    for (let i = 0; i < this._via_img_metadata[ this._via_image_id ].regions.length; ++i) {
      let canvas_reg = this._via_canvas_regions[ i ]

      let bbox = this.getRegionBoundingBox(canvas_reg)
      let x = bbox[ 0 ]
      let y = bbox[ 1 ]
      let w = Math.abs(bbox[ 2 ] - bbox[ 0 ])
      let h = Math.abs(bbox[ 3 ] - bbox[ 1 ])
      this._via_reg_ctx.font = VIA_THEME_ATTRIBUTE_VALUE_FONT

      let annotation_str = (i + 1)
      let bgnd_rect_width = this._via_reg_ctx.measureText(annotation_str).width * 2

      let char_width = this._via_reg_ctx.measureText('M').width
      let char_height = 1.8 * char_width

      let r = this._via_img_metadata[this._via_image_id].regions[ i ].region_attributes
      if (r.size === 1 && w > (2 * char_width)) {
        // show the attribute value
        for (let key of r.keys()) {
          annotation_str = r.get(key)
        }
        let strw = _via_reg_ctx.measureText(annotation_str).width

        if (strw > w) {
          // if text overflows, crop it
          let str_max = Math.floor((w * annotation_str.length) / strw)
          annotation_str = annotation_str.substr(0, str_max - 1) + '.'
          bgnd_rect_width = w
        } else {
          bgnd_rect_width = strw + char_width
        }
      }

      if (canvas_reg.shape_attributes.get('name') === VIA_REGION_SHAPE.POLYGON) {
        // put label near the first vertex
        x = canvas_reg.shape_attributes.get('all_points_x')[ 0 ]
        y = canvas_reg.shape_attributes.get('all_points_y')[ 0 ]
      } else {
        // center the label
        x = x - (bgnd_rect_width / 2 - w / 2)
      }

      // first, draw a background rectangle first
      this._via_reg_ctx.fillStyle = 'black'
      this._via_reg_ctx.globalAlpha = 0.8
      this._via_reg_ctx.fillRect(Math.floor(x), Math.floor(y - 1.1 * char_height), Math.floor(bgnd_rect_width), Math.floor(char_height))

      // then, draw text over this background rectangle
      this._via_reg_ctx.globalAlpha = 1.0
      this._via_reg_ctx.fillStyle = 'yellow'
      this._via_reg_ctx.fillText(annotation_str, Math.floor(x + 0.4 * char_width), Math.floor(y - 0.35 * char_height))
    }
  }

  _viaRedrawRegCanvas () {
    if (this._via_current_image_loaded) {
      if (this._via_canvas_regions.length > 0) {
        this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
        if (this._via_is_region_boundary_visible) {
          this.drawAllRegions()
        }
        if (this._via_is_region_id_visible) {
          this.drawAllRegionId()
        }
      }
    }
  }

  showImage (imageIndex) {
    if (this._via_is_loading_current_image) {
      return
    }
    let imgId = this._via_image_id_list[ imageIndex || 0 ]
    if (!this._via_img_metadata.hasOwnProperty(imgId)) {
      return
    }
    let fileName = this._via_img_metadata[ imgId ].file_name
    this._via_is_loading_current_image = true
    this._via_current_image = new Image()
    this._via_current_image.addEventListener('error', function () {
      this._via_is_loading_current_image = false
    }.bind(this), false)

    this._via_current_image.addEventListener('abort', function () {
      this._via_is_loading_current_image = false
    }.bind(this), false)

    this._via_current_image.onload = function () {
      // application
      this._via_image_id = imgId
      this._via_image_index = imageIndex
      this._via_current_image_filename = fileName
      this._via_current_image_loaded = true
      this._via_is_loading_current_image = false
      // region
      this._via_click_x0 = 0
      this._via_click_y0 = 0
      this._via_click_x1 = 0
      this._via_click_y1 = 0

      this._via_is_user_drawing_region = false
      this._via_is_window_resized = false
      this._via_is_user_resizing_region = false
      this._via_is_user_moving_region = false
      this._via_is_user_drawing_polygon = false
      this._via_is_region_selected = false
      this._via_user_sel_region_id = -1
      this._via_current_image_width = this._via_current_image.naturalWidth
      this._via_current_image_height = this._via_current_image.naturalHeight
      this._via_canvas_width = this._via_current_image_width
      this._via_canvas_height = this._via_current_image_height
      // update canvas
      // this.currentCanvasWidth = Math.round(this.currentImageWidth)
      // this.currentCanvasHeight = Math.round(this.currentImageHeight)
      if (this._via_canvas_width > this._via_div_real_width) {
        // resize image to match the panel width
        let scaleWidth = this._via_div_real_width / this._via_current_image.naturalWidth
        this._via_canvas_width = this._via_div_real_width
        this._via_canvas_height = this._via_current_image.naturalHeight * scaleWidth
      }
      if (this._via_canvas_height > this._via_div_real_height) {
        // resize further image if its height is larger than the image panel
        let scaleHeight = this._via_div_real_height / this._via_canvas_height
        this._via_canvas_height = this._via_div_real_height
        this._via_canvas_width = this._via_canvas_width * scaleHeight
      }
      this._via_canvas_width = Math.round(this._via_canvas_width)
      this._via_canvas_height = Math.round(this._via_canvas_height)
      this._via_canvas_scale = this._via_current_image.naturalWidth / this.currentCanvasWidth
      this._via_canvas_width_scale = this._via_current_image.naturalWidth / this.currentCanvasWidth
      this._via_canvas_height_scale = this._via_current_image.naturalHeight / this.currentCanvasHeight
      this.canvasScaleWithoutZoom = this._via_canvas_scale
      this.setAllCanvasSize(this._via_canvas_width, this._via_canvas_height)
      // image canvas
      this._via_img_ctx.clearRect(0, 0, this._via_canvas_width, this._via_canvas_height)
      this._via_img_ctx.drawImage(this._via_current_image, 0, 0, this._via_canvas_width, this._via_canvas_height)
      // this._via_img_ctx.scale(this.canvasWidthScale, this.canvasWidthScale)
      // region canvas
      // this.loadCanvasRegions()
      // this.redrawRegCanvas()
      this._via_reg_canvas.focus()
      this.isLoadingCurrentImage = false
      this._via_reload_img_table = true
    }.bind(this)
    this._via_current_image.src = this._via_img_metadata[ imgId ].fileref
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

  isOnPolygonVertex (all_points_x, all_points_y, px, py) {
    let n = all_points_x.length
    for (let i = 0; i < n; ++i) {
      if (Math.abs(all_points_x[ i ] - px) < VIA_POLYGON_VERTEX_MATCH_TOL &&
        Math.abs(all_points_y[ i ] - py) < VIA_POLYGON_VERTEX_MATCH_TOL) {
        return (VIA_POLYGON_RESIZE_VERTEX_OFFSET + i)
      }
    }
    return 0
  }

  isOnRegionCorner (px, py) {
    let _via_region_edge = [ -1, -1 ] // region_id, corner_id [top-left=1,top-right=2,bottom-right=3,bottom-left=4]
    for (let i = 0; i < this._via_canvas_regions.length; ++i) {
      let attr = this._via_canvas_regions[ i ].shape_attributes
      let result = false
      _via_region_edge[ 0 ] = i

      switch (attr.get('name')) {
        case VIA_REGION_SHAPE.POLYGON:
          result = this.isOnPolygonVertex(attr.get('all_points_x'), attr.get('all_points_y'), px, py)
          break
        case VIA_REGION_SHAPE.POINT:
          result = 0
      }

      if (result > 0) {
        _via_region_edge[ 1 ] = result
        return _via_region_edge
      }
    }
    _via_region_edge[ 0 ] = -1
    return _via_region_edge
  }

  isOnRectEdge (x, y, w, h, px, py) {
    let dx0 = Math.abs(x - px)
    let dy0 = Math.abs(y - py)
    let dx1 = Math.abs(x + w - px)
    let dy1 = Math.abs(y + h - py)
    if (dx0 < VIA_REGION_EDGE_TOL && dy0 < VIA_REGION_EDGE_TOL) {
      return 1
    }
    if (dx1 < VIA_REGION_EDGE_TOL && dy0 < VIA_REGION_EDGE_TOL) {
      return 2
    }
    if (dx1 < VIA_REGION_EDGE_TOL && dy1 < VIA_REGION_EDGE_TOL) {
      return 3
    }

    if (dx0 < VIA_REGION_EDGE_TOL && dy1 < VIA_REGION_EDGE_TOL) {
      return 4
    }
    return 0
  }

  toggleAllRegionsSelection (is_selected) {
    for (let i = 0; i < this._via_canvas_regions.length; ++i) {
      this._via_canvas_regions[ i ].is_user_selected = is_selected
      this._via_img_metadata[ this._via_image_id ].regions[ i ].is_user_selected = is_selected
    }
    this._via_is_all_region_selected = is_selected
  }

  selectOnlyRegion (region_id) {
    this.toggleAllRegionsSelection(false)
    this.setRegionSelectState(region_id, true)
    this._via_is_region_selected = true
    this._via_user_sel_region_id = region_id
  }

  setRegionSelectState (region_id, is_selected) {
    this._via_canvas_regions[ region_id ].is_user_selected = is_selected
    this._via_img_metadata[ this._via_image_id ].regions[ region_id ].is_user_selected = is_selected
  }

  update_attributes_panel () {

  }

// Image click handlers
  addEventListenerDBClick () {
    this._via_reg_canvas.addEventListener('dblclick', function (e) {
      this._via_click_x0 = e.offsetX
      this._via_click_y0 = e.offsetY
      let region_id = this.isInsideRegion(this._via_click_x0, this._via_click_y0)
      if (region_id !== -1) {
        // 显示region属性列表
      }
    }.bind(this), false)
    return this
  }

  addEventListenerMousedown () {
    this._via_reg_canvas.addEventListener('mousedown', function (e) {
      this._via_click_x0 = e.offsetX
      this._via_click_y0 = e.offsetY
      this._via_region_edge = this.isOnRegionCorner(this._via_click_x0, this._via_click_y0)
      let region_id = this.isInsideRegion(this._via_click_x0, this._via_click_y0)

      if (this._via_is_region_selected) {
        // check if user clicked on the region boundary
        if (this._via_region_edge[ 1 ] > 0) {
          if (!this._via_is_user_resizing_region) {
            // resize region
            if (this._via_region_edge[ 0 ] !== this._via_user_sel_region_id) {
              this._via_user_sel_region_id = this._via_region_edge[ 0 ]
            }
            this._via_is_user_resizing_region = true
          }
        } else {
          let yes = this.is_inside_this_region(this._via_click_x0, this._via_click_y0, this._via_user_sel_region_id)
          if (yes) {
            if (!this._via_is_user_moving_region) {
              this._via_is_user_moving_region = true
              this._via_region_click_x = this._via_click_x0
              this._via_region_click_y = this._via_click_y0
            }
          }
          if (region_id === -1) {
            // mousedown on outside any region
            this._via_is_user_drawing_region = true
            // unselect all regions
            this._via_is_region_selected = false
            this._via_user_sel_region_id = -1
            this.toggleAllRegionsSelection(false)
          }
        }
      } else {
        if (region_id === -1) {
          // mousedown outside a region
          if (this._via_current_shape !== VIA_REGION_SHAPE.POLYGON &&
            this._via_current_shape !== VIA_REGION_SHAPE.POINT) {
            // this is a bounding box drawing event
            this._via_is_user_drawing_region = true
          }
        } else {
          // mousedown inside a region
          // this could lead to (1) region selection or (2) region drawing
          this._via_is_user_drawing_region = true
        }
      }
      e.preventDefault()
    }.bind(this), false)
  }

  addEventListenerMouseup () {
    this._via_reg_canvas.addEventListener('mouseup', function (e) {
      this._via_click_x1 = e.offsetX
      this._via_click_y1 = e.offsetY

      let click_dx = Math.abs(this._via_click_x1 - this._via_click_x0)
      let click_dy = Math.abs(this._via_click_y1 - this._via_click_y0)

      // indicates that user has finished moving a region
      if (this._via_is_user_moving_region) {
        this._via_is_user_moving_region = false
        this._via_reg_canvas.style.cursor = 'default'

        let move_x = Math.round(this._via_click_x1 - this._via_region_click_x)
        let move_y = Math.round(this._via_click_y1 - this._via_region_click_y)

        if (Math.abs(move_x) > VIA_MOUSE_CLICK_TOL || Math.abs(move_y) > VIA_MOUSE_CLICK_TOL) {

          let image_attr = this._via_img_metadata[ this._via_image_id ].regions[ this._via_user_sel_region_id ].shape_attributes
          let canvas_attr = this._via_canvas_regions[ this._via_user_sel_region_id ].shape_attributes

          switch (canvas_attr.get('name')) {
            case VIA_REGION_SHAPE.POINT:
              let cxnew = image_attr.get('cx') + Math.round(move_x * this._via_canvas_scale)
              let cynew = image_attr.get('cy') + Math.round(move_y * this._via_canvas_scale)
              image_attr.set('cx', cxnew)
              image_attr.set('cy', cynew)

              let canvas_xnew = canvas_attr.get('cx') + move_x
              let canvas_ynew = canvas_attr.get('cy') + move_y
              canvas_attr.set('cx', canvas_xnew)
              canvas_attr.set('cy', canvas_ynew)
              break
            case VIA_REGION_SHAPE.POLYGON:
              let img_px = image_attr.get('all_points_x')
              let img_py = image_attr.get('all_points_y')
              for (let i = 0; i < img_px.length; ++i) {
                img_px[ i ] = img_px[ i ] + Math.round(move_x * this._via_canvas_scale)
                img_py[ i ] = img_py[ i ] + Math.round(move_y * this._via_canvas_scale)
              }

              let canvas_px = canvas_attr.get('all_points_x')
              let canvas_py = canvas_attr.get('all_points_y')
              for (let i = 0; i < canvas_px.length; ++i) {
                canvas_px[ i ] = canvas_px[ i ] + move_x
                canvas_py[ i ] = canvas_py[ i ] + move_y
              }
              break
          }
        } else {
          // indicates a user click on an already selected region
          // this could indicate a user's intention to select another
          // nested region within this region

          // traverse the canvas regions in alternating ascending
          // and descending order to solve the issue of nested regions
          let nested_region_id = this.isInsideRegion(this._via_click_x0, this._via_click_y0, true)
          if (nested_region_id >= 0 && nested_region_id !== this._via_user_sel_region_id) {
            this._via_user_sel_region_id = nested_region_id
            this._via_is_region_selected = true
            this._via_is_user_moving_region = false

            // de-select all other regions if the user has not pressed Shift
            if (!e.shiftKey) {
              this.toggleAllRegionsSelection(false)
            }
            this.setRegionSelectState(nested_region_id, true)
            this.update_attributes_panel()
          }
        }
        this._viaRedrawRegCanvas()
        this._via_reg_canvas.focus()
        return
      }

      // indicates that user has finished resizing a region
      if (this._via_is_user_resizing_region) {
        // _via_click(x0,y0) to _via_click(x1,y1)
        this._via_is_user_resizing_region = false
        this._via_reg_canvas.style.cursor = 'default'

        // update the region
        let region_id = this._via_region_edge[ 0 ]
        let image_attr = this._via_img_metadata[ this._via_image_id ].regions[ region_id ].shape_attributes
        let canvas_attr = this._via_canvas_regions[ region_id ].shape_attributes

        switch (canvas_attr.get('name')) {
          case VIA_REGION_SHAPE.POLYGON:
            let moved_vertex_id = this._via_region_edge[ 1 ] - VIA_POLYGON_RESIZE_VERTEX_OFFSET

            canvas_attr.get('all_points_x')[ moved_vertex_id ] = Math.round(this._via_current_x)
            canvas_attr.get('all_points_y')[ moved_vertex_id ] = Math.round(this._via_current_y)
            image_attr.get('all_points_x')[ moved_vertex_id ] = Math.round(this._via_current_x * this._via_canvas_scale)
            image_attr.get('all_points_y')[ moved_vertex_id ] = Math.round(this._via_current_y * this._via_canvas_scale)

            if (moved_vertex_id === 0) {
              // move both first and last vertex because we
              // the initial point at the end to close path
              let n = canvas_attr.get('all_points_x').length
              canvas_attr.get('all_points_x')[ n - 1 ] = Math.round(this._via_current_x)
              canvas_attr.get('all_points_y')[ n - 1 ] = Math.round(this._via_current_y)
              image_attr.get('all_points_x')[ n - 1 ] = Math.round(this._via_current_x * this._via_canvas_scale)
              image_attr.get('all_points_y')[ n - 1 ] = Math.round(this._via_current_y * this._via_canvas_scale)
            }
            break
        }

        this._viaRedrawRegCanvas()
        this._via_reg_canvas.focus()
        return
      }

      // denotes a single click (= mouse down + mouse up)
      if (click_dx < VIA_MOUSE_CLICK_TOL || click_dy < VIA_MOUSE_CLICK_TOL) {
        // if user is already drawing ploygon, then each click adds a new point
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
            this._via_current_polygon_region_id = this._via_img_metadata[ this._via_image_id ].regions.length
            this._via_img_metadata[ this._via_image_id ].regions.push(polygon_region)

            // newly drawn region is automatically selected
            this.selectOnlyRegion(this._via_current_polygon_region_id)

            this._via_current_polygon_region_id = -1
            this.update_attributes_panel()
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
            if (!e.shiftKey) {
              this.toggleAllRegionsSelection(false)
            }
            this.setRegionSelectState(region_id, true)
            this.update_attributes_panel()
          } else {
            if (this._via_is_user_drawing_region) {
              // clear all region selection
              this._via_is_user_drawing_region = false
              this._via_is_region_selected = false
              this._via_use_sel_region_id = -1
              this.toggleAllRegionsSelection(false)
              this.update_attributes_panel()
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

                  this.update_attributes_panel()
                  break
              }
            }
          }
        }
        this._viaRedrawRegCanvas()
        this._via_reg_canvas.focus()
        return
      }

      // indicates that user has finished drawing a new region
      if (this._via_is_user_drawing_region) {
        this._via_is_user_drawing_region = false
        let region_x0
        let region_y0
        let region_x1
        let region_y1
        // ensure that (x0,y0) is top-left and (x1,y1) is bottom-right
        if (this._via_click_x0 < this._via_click_x1) {
          region_x0 = this._via_click_x0
          region_x1 = this._via_click_x1
        } else {
          region_x0 = this._via_click_x1
          region_x1 = this._via_click_x0
        }

        if (this._via_click_y0 < this._via_click_y1) {
          region_y0 = this._via_click_y0
          region_y1 = this._via_click_y1
        } else {
          region_y0 = this._via_click_y1
          region_y1 = this._via_click_y0
        }

        let original_img_region = new ImageRegion()
        let canvas_img_region = new ImageRegion()
        let region_dx = Math.abs(region_x1 - region_x0)
        let region_dy = Math.abs(region_y1 - region_y0)

        // newly drawn region is automatically selected
        this.toggleAllRegionsSelection(false)
        original_img_region.is_user_selected = true
        canvas_img_region.is_user_selected = true
        this._via_is_region_selected = true
        this._via_user_sel_region_id = this._via_canvas_regions.length // new region's id

        if (region_dx > VIA_REGION_MIN_DIM || region_dy > VIA_REGION_MIN_DIM) { // avoid regions with 0 dim
          switch (this._via_current_shape) {
            case VIA_REGION_SHAPE.POLYGON:
              // handled by _via_is_user_drawing polygon
              break
          }
        } else {
        }
        this.update_attributes_panel()
        this._viaRedrawRegCanvas()
        this._via_reg_canvas.focus()
        return
      }
    }.bind(this), false)
    return this
  }

  addEventListenerMouseover () {
    this._via_reg_canvas.addEventListener('mouseover', function (e) {
      this._viaRedrawRegCanvas()
      this._via_reg_canvas.focus()
    }.bind(this), false)
    return this
  }

  addEventListenerMousemove () {
    this._via_reg_canvas.addEventListener('mousemove', function (e) {
      if (!this._via_current_image_loaded) {
        return
      }
      this._via_current_x = e.offsetX
      this._via_current_y = e.offsetY

      if (this._via_is_region_selected) {
        if (!this._via_is_user_resizing_region) {
          // check if user moved mouse cursor to region boundary
          // which indicates an intention to resize the reigon

          this._via_region_edge = this.isOnRegionCorner(this._via_current_x, this._via_current_y)

          if (this._via_region_edge[ 0 ] === this._via_user_sel_region_id) {
            switch (this._via_region_edge[ 1 ]) {
              // rect
              case 1: // top-left corner of rect
              case 3: // bottom-right corner of rect
                this._via_reg_canvas.style.cursor = 'nwse-resize'
                break
              case 2: // top-right corner of rect
              case 4: // bottom-left corner of rect
                this._via_reg_canvas.style.cursor = 'nesw-resize'
                break

              // circle and ellipse
              case 5:
                this._via_reg_canvas.style.cursor = 'n-resize'
                break
              case 6:
                this._via_reg_canvas.style.cursor = 'e-resize'
                break

              default:
                this._via_reg_canvas.style.cursor = 'default'
            }

            if (this._via_region_edge[ 1 ] >= VIA_POLYGON_RESIZE_VERTEX_OFFSET) {
              // indicates mouse over polygon vertex
              this._via_reg_canvas.style.cursor = 'crosshair'
            }
          } else {
            let yes = this.is_inside_this_region(this._via_current_x, this._via_current_y, this._via_user_sel_region_id)
            if (yes) {
              this._via_reg_canvas.style.cursor = 'move'
            } else {
              this._via_reg_canvas.style.cursor = 'default'
            }
          }
        }
      }

      if (this._via_is_user_drawing_region) {
        // draw region as the user drags the mouse cousor
        if (this._via_canvas_regions.length) {
          this._viaRedrawRegCanvas() // clear old intermediate rectangle
        } else {
          // first region being drawn, just clear the full region canvas
          this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
        }

        let region_x0
        let region_y0

        if (this._via_click_x0 < this._via_current_x) {
          if (this._via_click_y0 < this._via_current_y) {
            region_x0 = this._via_click_x0
            region_y0 = this._via_click_y0
          } else {
            region_x0 = this._via_click_x0
            region_y0 = this._via_current_y
          }
        } else {
          if (this._via_click_y0 < this._via_current_y) {
            region_x0 = this._via_current_x
            region_y0 = this._via_click_y0
          } else {
            region_x0 = this._via_current_x
            region_y0 = this._via_current_y
          }
        }
        let dx = Math.round(Math.abs(this._via_current_x - this._via_click_x0))
        let dy = Math.round(Math.abs(this._via_current_y - this._via_click_y0))

        switch (this._via_current_shape) {
          case VIA_REGION_SHAPE.POLYGON:
            break
        }
        this._via_reg_canvas.focus()
      }

      if (this._via_is_user_resizing_region) {
        // user has clicked mouse on bounding box edge and is now moving it
        // draw region as the user drags the mouse cousor
        if (this._via_canvas_regions.length) {
          this._viaRedrawRegCanvas() // clear old intermediate rectangle
        } else {
          // first region being drawn, just clear the full region canvas
          this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
        }

        let region_id = this._via_region_edge[ 0 ]
        let attr = this._via_canvas_regions[ region_id ].shape_attributes
        switch (attr.get('name')) {
          case VIA_REGION_SHAPE.POLYGON:
            let moved_all_points_x = attr.get('all_points_x').slice(0)
            let moved_all_points_y = attr.get('all_points_y').slice(0)
            let moved_vertex_id = this._via_region_edge[ 1 ] - VIA_POLYGON_RESIZE_VERTEX_OFFSET

            moved_all_points_x[ moved_vertex_id ] = this._via_current_x
            moved_all_points_y[ moved_vertex_id ] = this._via_current_y

            if (moved_vertex_id === 0) {
              // move both first and last vertex because we
              // the initial point at the end to close path
              moved_all_points_x[ moved_all_points_x.length - 1 ] = this._via_current_x
              moved_all_points_y[ moved_all_points_y.length - 1 ] = this._via_current_y
            }

            this._viaDrawPolygonRegion(moved_all_points_x, moved_all_points_y, true)
            break
        }
        this._via_reg_canvas.focus()
      }

      if (this._via_is_user_moving_region) {
        // draw region as the user drags the mouse cousor
        if (this._via_canvas_regions.length) {
          this._viaRedrawRegCanvas() // clear old intermediate rectangle
        } else {
          // first region being drawn, just clear the full region canvas
          this._via_reg_ctx.clearRect(0, 0, this._via_reg_canvas.width, this._via_reg_canvas.height)
        }

        let move_x = (this._via_current_x - this._via_region_click_x)
        let move_y = (this._via_current_y - this._via_region_click_y)
        let attr = this._via_canvas_regions[ this._via_user_sel_region_id ].shape_attributes

        switch (attr.get('name')) {
          case VIA_REGION_SHAPE.POLYGON:
            let moved_all_points_x = attr.get('all_points_x').slice(0)
            let moved_all_points_y = attr.get('all_points_y').slice(0)
            for (let i = 0; i < moved_all_points_x.length; ++i) {
              moved_all_points_x[ i ] += move_x
              moved_all_points_y[ i ] += move_y
            }
            this._viaDrawPolygonRegion(moved_all_points_x, moved_all_points_y, true)
            break

          case VIA_REGION_SHAPE.POINT:
            this._viaDrawPoint_region(attr.get('cx') + move_x, attr.get('cy') + move_y, true)
            break
        }
        this._via_reg_canvas.focus()
        return
      }

      if (this._via_is_user_drawing_polygon) {
        this._viaRedrawRegCanvas()
        let attr = this._via_canvas_regions[ this._via_current_polygon_region_id ].shape_attributes
        let all_points_x = attr.get('all_points_x')
        let all_points_y = attr.get('all_points_y')
        let npts = all_points_x.length

        let line_x = [ all_points_x.slice(npts - 1), this._via_current_x ]
        let line_y = [ all_points_y.slice(npts - 1), this._via_current_y ]
        this._viaDrawPolygonRegion(line_x, line_y, false)
      }
    }.bind(this), false)
    return this
  }
}
export default GraphTag
