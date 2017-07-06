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

  return {width: winWidth, height: winHeight}
}

