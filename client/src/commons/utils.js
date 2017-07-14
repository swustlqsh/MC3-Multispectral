/**
 * Created by liqiusheng on 06/07/2017.
 */
export const getPageSize = () => {
  let winWidth = 0
  let winHeight = 0
  if (window.innerWidth) {
    winWidth = window.innerWidth
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth
  }
  if (window.innerHeight) {
    winHeight = window.innerHeight
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight
  }
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight
    winWidth = document.documentElement.clientWidth
  }
  return { width: winWidth, height: winHeight }
}

export const getPointsOfArea = (oArea, isTrans = true) => {
  // return the points arr, like [[x0,y0], [x1, y1]....]
  let area = []
  let num = 0
  if (isTrans) {
    num = oArea[ 0 ].length
    for (let i = 0; i < num; i++) {
      area.push([ oArea[ 0 ][ i ], oArea[ 1 ][ i ] ])
    }
  } else {
    area = oArea
    num = area.length
  }

  // [[2,3], [3,4]]
  let minX = 100000
  let maxX = -1
  let minY = 100000
  let maxY = -1
  // cal the boundary of area
  for (let i = 0; i < num; i++) {
    minX = Math.min(minX, area[ i ][ 0 ])
    maxX = Math.max(maxX, area[ i ][ 0 ])
    minY = Math.min(minY, area[ i ][ 1 ])
    maxY = Math.max(maxY, area[ i ][ 1 ])
  }
  let points = []
  for (let i = minX; i < maxX; i++) {
    for (let j = minY; j < maxY; j++) {
      if (isPinArea([ i, j ], area)) {
        points.push([ i, j ])
      }
    }
  }
  return points
  function isPinArea (point, area) {
    let len = area.length
    let x = +point[ 0 ]
    let y = -1 * (+point[ 1 ])
    let n = 0
    for (let i = 0; i < len - 1; i++) {
      let p1 = area[ i ]
      let p2 = area[ (i + 1) % len ]
      let p1x = p1[ 0 ]
      let p1y = -1 * p1[ 1 ]
      let p2x = p2[ 0 ]
      let p2y = -1 * p2[ 1 ]
      if (p1y === p2y) {
        continue
      }
      if (y < Math.min(p1y, p2y)) continue
      if (y > Math.max(p1y, p2y)) continue
      let px = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
      if (px > x) n += 1
    }
    return n % 2 === 1
  }
}
/**
 16进制颜色转为RGB格式
 十六进制格式（#000000-#FFFFFF) == 》 [(0-255),(0-255),(0-255)]
 */
export const getColorRgb = (color, type = 0) => {
  let sColor = color.toLowerCase()
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    let sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    if (type === 0) {
      return sColorChange
    } else {
      return 'RGB(' + sColorChange.join(',') + ')'
    }
  } else {
    return sColor
  }
}

/**
 将选中区域的颜色高亮
 |----------|
 |          |
 |__________|
 */

// colorSpace
// metaData 结构:
// metaData = {
//   width: 4,
//   height: 2,
//   data: [0,0,0,0,0,0,0,0,0,0,0,0,200,200,200,1,200,200,200,0,200,200,200,1,200,200,200,1,200,200,200,1]
// }

export const transSelectRegionToBase64 = (metaData, area, color) => {
  let width = metaData.width
  let height = metaData.height

  let marked = Array(height).fill([])
  for (let i = 0; i < height; i++) {
    marked[ i ] = Array(width).fill(0)
  }
  // let points = getPointsOfArea(area, false)
  // for (let i = 0; i < points.length; i++) {
  //   let tmpX = Math.round(points[i][0])
  //   let tmpY = Math.round(points[i][1])
  //   if (tmpX < 0 || tmpY < 0 || tmpX >= width || tmpY >= height) {
  //   } else {
  //     marked[ tmpX ][ tmpY ] = 1
  //   }
  // }
  // marked = isInsidePolygonForAll(area, 651, 651)
  // for (let i = 0; i < height; i++) {
  //   for (let j = 0; j < width; j++) {
  //     if (marked[ j ][ i ] === 1) {
  //       let tmp = 4 * (i * width + j)
  //       metaData.data[ tmp ] = color[ 0 ]
  //       metaData.data[ tmp + 1 ] = color[ 1 ]
  //       metaData.data[ tmp + 2 ] = color[ 2 ]
  //     }
  //   }
  // }
  return metaData
}

export const getBoundary = (area) => {
  let bbox = new Array(4)

  let minx = Number.MAX_SAFE_INTEGER
  let miny = Number.MAX_SAFE_INTEGER
  let maxx = 0
  let maxy = 0

  for (let i = 0; i < area.length; ++i) {
    let nx = area[ i ][ 0 ]
    let ny = area[ i ][ 1 ]
    if (nx < minx) {
      minx = nx
    }
    if (nx > maxx) {
      maxx = nx
    }
    if (ny < miny) {
      miny = ny
    }
    if (ny > maxy) {
      maxy = ny
    }
  }
  bbox[ 0 ] = minx
  bbox[ 1 ] = miny
  bbox[ 2 ] = maxx
  bbox[ 3 ] = maxy

  return bbox
}

export const getBoundaryToArray = (boundaryX, boundaryY) => {
  let area = Array(boundaryX.length).fill([])
  boundaryX.forEach((d, i) => {
    area[ i ] = [ d, boundaryY[ i ] ]
  })
  return area
}

export const isLeft = (x0, y0, x1, y1, x2, y2) => {
  return (((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0)))
}

export const isInsidePolygonForOne = (area, px, py) => {
  let wn = 0
  for (let i = 0; i < area.length - 1; ++i) {
    let isLeftValue = isLeft(area[ i ][0], area[ i ][1], area[ i + 1 ][0], area[ i + 1 ][1], px, py)
    if (area[ i ][1] <= py) {
      if (area[ i + 1 ][1] > py && isLeftValue > 0) {
        ++wn
      }
    } else {
      if (area[ i + 1 ][1] <= py && isLeftValue < 0) {
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
export const isInsidePolygonForAll = (area, width, height) => {
  let marked = Array(height).fill([])
  for (let i = 0; i < height; i++) {
    marked[ i ] = Array(width).fill(0)
  }
  let box = getBoundary(area)
  for (let i = 0; i < 651; i++) {
    for (let j = 0; j < 651; j++) {
      if (i < box[0] || i > box[2] || j < box[1] || j > box[3]) {
      } else {
        marked[i][j] = 1
      }
    }
  }
  return marked
}
