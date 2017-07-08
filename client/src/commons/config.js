// process.SkyEye 可以访问
import lessVars from './base.vars.less'

console.log(lessVars)
let config = {
  debug: process.SkyEye.ENV === 'dev',
  emSize: 0,
  burnt: '#ef8a62',
  flood: '#2b8cbe',
  defaultFeatures: [
    [ 'Moun', 'orange' ],
    [ 'Rode', '#D6E2D7' ],
    [ 'Lake', 'blue' ],
    [ 'City', 'gray' ]
  ],
  defaultFeaturesObj: {
    Moun: 'orange',
    Rode: '#D6E2D7',
    Lake: 'blue',
    City: 'gray'
  }
}
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
let emSize = '12px'
if (winWidth < 2000) {
  emSize = '12px'
} else if (winWidth < 3000) {
  emSize = '15px'
} else if (winWidth < 4000) {
  emSize = '25px'
} else if (winWidth < 5000) {
  emSize = '30px'
} else if (winWidth < 6000) {
  emSize = '35px'
} else if (winWidth < 7000) {
  emSize = '40px'
} else if (winWidth < 8000) {
  emSize = '45px'
} else if (winWidth < 9000) {
  emSize = '50px'
}
config.emSize = emSize

export default config
