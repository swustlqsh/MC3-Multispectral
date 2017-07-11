// process.SkyEye 可以访问
import lessVars from './base.vars.less'

console.log(lessVars)
let config = {
  debug: process.SkyEye.ENV === 'dev',
  emSize: 0,
  burnt: '#ef8a62',
  flood: '#2b8cbe',
  defaultFeatures: [
    ['Plant', 'green'],
    ['Moun', 'orange'],
    ['Lake', 'blue'],
    ['City', 'gray']
  ],
  featureColors: {
    'B4B3B2': {
      'Plant': 'red',
      'City': 'gray',
      'Water': 'black'
    },
    'B5B4B2': {
      'Water': 'black',
      'Soil': 'blue',
      'Ground': 'pink',
      'City': 'purple'
    },
    'B1B5B6': {
      'Ice': 'red',
      'Snow': 'Orange',
      'Cloud': 'Pink'
    },
    'B3B2B1': {
      'Plant': 'green',
      'City': 'gray',
      'Water': 'blue'
    }
  },
  date: [
    '2014_03_17',
    '2014_08_24',
    '2014_11_28',
    '2014_12_30',
    '2015_02_15',
    '2015_06_24',
    '2015_09_12',
    '2015_11_15',
    '2016_03_06',
    '2016_06_26',
    '2016_09_06',
    '2016_12_19'
  ],
  defaultFeaturesObj: {
    Moun: 'orange',
    Rode: '#D6E2D7',
    Lake: 'blue',
    City: 'gray',
    Flood: '#2b8cbe',
    Burnt: 'red'
  },
  baseDataPath: '../../../data/'
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
  emSize = 12
} else if (winWidth < 3000) {
  emSize = 15
} else if (winWidth < 4000) {
  emSize = 25
} else if (winWidth < 5000) {
  emSize = 30
} else if (winWidth < 6000) {
  emSize = 35
} else if (winWidth < 7000) {
  emSize = 40
} else if (winWidth < 8000) {
  emSize = 45
} else if (winWidth < 9000) {
  emSize = 50
}
config.emSize = emSize

export default config
