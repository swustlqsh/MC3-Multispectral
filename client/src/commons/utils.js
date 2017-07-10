/**
 * Created by liqiusheng on 06/07/2017.
 */
export const getPageSize = () => {
  let winWidth = 0
  let winHeight = 0
  if (window.innerWidth)
    winWidth = window.innerWidth
  else if ((document.body) && (document.body.clientWidth))
    winWidth = document.body.clientWidth
  if (window.innerHeight)
    winHeight = window.innerHeight
  else if ((document.body) && (document.body.clientHeight))
    winHeight = document.body.clientHeight
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight
    winWidth = document.documentElement.clientWidth
  }
  return { width: winWidth, height: winHeight }
}

export const getPointsOfArea = (area) => {
  let num = area.length
  //[[2,3], [3,4]]
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