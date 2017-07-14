/**
 * Created by liqiusheng on 14/07/2017.
 */
import Promise from 'bluebird'
// 将异步请求Promise化
let async = (name, callback, done) => {
	return new Promise((resolve, reject) => {
		let newResolve = function (data) {
			resolve(data)
			console.log(`[${name}.resolve]`, data)
			done instanceof Function && done('resolve', data)
		}

		let newReject = function (data) {
			let err = new Error()
			if (data instanceof Object) {
				err.message = data.message || 'error.unknown'
				err.data = data.data
			} else if ([ 'string', 'number' ].indexOf(typeof data) !== -1) {
				err.message = data
				err.data = data
			}
			reject(err)
			console.warn(`[${name}.reject]`, err)
			done instanceof Function && done('reject', err)
		}

		try {
			callback(newResolve, newReject)
		} catch (err) {
			console.error(`[${name}.error]`, err)
		}
	})
}

export default async
