/**
 * Created by liqiusheng on 14/07/2017.
 */

import Vue from 'vue'
import VueResource from 'vue-resource'
import nprogress from 'nprogress'
import async from './async'

let queue = []

Vue.use(VueResource)

nprogress.configure({
	showSpinner: false,
	trickleRate: 0.01,
	trickleSpeed: 100
})

const start = () => {
	nprogress.start()
	queue.push('')
}

const done = () => {
	queue.pop()
	if (!queue.length) {
		nprogress.done()
	}
	return true
}

const formatRes = (res) => {
	let error = ''
	let message = ''
	let data = ''
	if (res.body) {
		error = res.body.error
		message = res.body.message
		data = res.body.data
	}
	if (error && data && [ 'string', 'number' ].indexOf(typeof data) !== -1) {
		data = 'error.code' + (data ? '.' : '') + data
		message = data
	}
	return {
		error, message, data, res
	}
}

const statusCheck = (reject, next) => {
	return (res) => {
		done()
		let status = res.status
		if (status === 401) {
			reject(formatRes(res))
		} else if (status === 500) {
			reject(formatRes(res))
		} else {
			next instanceof Function && next(formatRes(res))
		}
	}
}

const factory = (method) => {
	return function (...args) {
		start()
		return async(`http.${method}(${args[ 0 ]})`,
			(resolve, reject) => {
				Vue.http[ method ](...args).then(
					// resolve
					statusCheck(reject, res => {
						if (res.error) {
							reject(res)
						} else {
							resolve(res)
						}
					}),
					// reject
					statusCheck(reject, reject)
				)
			}
		).finally(done)
	}
}

export default {
	get: factory('get'),
	post: factory('post'),
	put: factory('put'),
	delete: factory('delete'),
	jsonp: factory('jsonp')
}
