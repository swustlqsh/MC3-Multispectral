import {info, warn} from './logs'
import Promise from 'bluebird'

const bluePromise = (name, callback, done) => {
  return new Promise((resolve, reject) => {
    const newResolve = (data) => {
      resolve(data)
      info(`bluePromise[${name}.resolve]`, data)
      done instanceof Function && done('resolve', data)
    }

    const newReject = (data) => {
      let err
      if (data instanceof Error) {
        err = data
      } else {
        err = new Error()
        err.data = data
        if (data instanceof Object) {
          err.message = data.message
        } else if ([ 'string', 'number' ].indexOf(typeof data) !== -1) {
          err.message = data
        }
        err.message = err.message || '发生了未知错误'
      }
      reject(err)
      warn(`bluePromise[${name}.reject]`, err)
      done instanceof Function && done('reject', err)
    }

    try {
      callback(newResolve, newReject)
    } catch (err) {
      console.error(`bluePromise[${name}.error]`, err)
    }
  })
}

export default bluePromise
