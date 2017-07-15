/**
 * Created by liqiusheng on 15/07/2017.
 */
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var server = require('http').createServer(app)

app.use(bodyParser.json({limit: '100mb'}));

app.use(bodyParser.urlencoded({
	limit: '100mb',
	extended: true
}))

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
	else  next();
})

// let {queryData, updateData, addData} = require('./mongoDB')
let mongoApi = require('./mongoDB')
// console.log('mongoApi.queryData', mongoApi.queryData)

// ------------------------------------------- POST ---------------------------------------------------------
app.post('/api/all', function (req, res) {
	let body = req.body
	let result = []
	let queryFinish = function(result){
		res.json(result)
	}
	if (Object.keys(req.body).length !== 0) {
		let dataBaseName = body.databaseName
		console.log('dataBaseName', dataBaseName)
		mongoApi.queryData(dataBaseName, queryFinish)
	}
})

// -----------------------------------  init ------------------------------------------------------
app.post('/api/init', function (req, res) {
	let body = req.body
	let results = []
	if (Object.keys(req.body).length !== 0) {
		let dataBaseName = body.databaseName
		let originalData = body.originalData
		// todo

		// results = queryDatabase(dataBaseName)
	}
	res.json({ data: results })
})

//   -----------------------------   添加feature信息   ----------------------------------
app.post('/api/addfeature', function (req, res) {
	let body = req.body
	console.log('body--------', body)
	if (Object.keys(body).length !== 0) {
		mongoApi.addFeatureData(body)
	}
	res.json({ data: 'sssss' })
})

//   -----------------------------   添加feature信息   ----------------------------------
app.post('/api/addmatrixfeature', function (req, res) {
	let body = req.body
	console.log('body--------', body)
	if (Object.keys(body).length !== 0) {
		mongoApi.updateMatrixFeatureData(body)
	}
	res.json({ data: 'sssss' })
})

// get
app.get('/test', function (req, res) {
	let query = req.query
	// todo
	let results = []
	res.send(results)
})

// ------------------- Main Function ------------------
function main () {
	let PORT = process.env.PORT || 8003
	console.log(PORT)
	server.listen(PORT)
}

main()