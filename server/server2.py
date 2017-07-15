import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options
import os
import sys
import json, ast
from tornado.options import define, options
import tornado.websocket
from pymongo import MongoClient

client = MongoClient('192.168.10.9', 27066)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class AllDataHandler(tornado.web.RequestHandler):
	def post(self):
		self.content_type = 'application/json'
		self.add_header("Access-Control-Allow-Origin", "*")
		databaseName = self.get_argument('databaseName')
		print('...............wsHandler')
		print(databaseName)
		result = queryDatabase(databaseName)
		print(result)
		# self.write('vuex update handler')

# class UpdateMatrixDataHandler(tornado.web.RequestHandler):
# 	def post(self):
# 		self.content_type = 'application/json'
# 		self.add_header("Access-Control-Allow-Origin", "*")
# 		databaseName = self.get_argument('databaseName')
# 		imageName = self.get_argument('imageName')
# 		dataType = self.get_argument('dataType')
# 		updateData = self.get_argument('updateData')
# 		collection = databaseName['MatrixData']
# 		if dataType == 'FeatureData':
# 			collection.update({'imageName': imageName},{$set:{'featuresArray':updateData}})
# 		else if dataType == 'EventData':
# 			collection.update({'imageName': imageName},{$set:{'eventsArrays':updateData}})

class UpdateVueDataHandler(tornado.web.RequestHandler):
	def post(self):
		self.content_type = 'application/json'
		self.add_header("Access-Control-Allow-Origin", "*")
		databaseName = self.get_argument('databaseName')
		databaseName = self.get_argument('ObjId')

class QueryHandler(tornado.web.RequestHandler):
	def get(self):
		self.content_type = 'application/json'
		self.add_header("Access-Control-Allow-Origin", "*")
		databaseName = self.get_argument('databaseName')
		result = queryDatabase(databaseName)
		self.write('vuex query handler')

class InitHandler(tornado.web.RequestHandler):
	def post(self):
		print('init handler')
		self.content_type = 'application/json'
		self.add_header("Access-Control-Allow-Origin", "*")
		databaseName = self.get_argument('databaseName')
		originalData = self.get_argument('originalData')
		db = client['vastchallenge2017mc3']
		print(databaseName)
		collection = db[databaseName]
		print(collection)
		print(originalData)
		print(databaseName)
		print(type(originalData))
		originalData = ast.literal_eval(originalData)
		print('originalData', originalData)
		print('type', type(originalData))
		originalObj = json.loads(originalData)
		print(type(originalObj))
		print('originalObj', originalObj)
		print('array', [originalObj])
		collection.insert_one(originalObj)
		# self.write('vuex query handler')

class VuexInitHandler(tornado.web.RequestHandler):
	def get(self):
		print('self')

class ImageMatrixInitHandler(tornado.web.RequestHandler):
	def get(self):
		print('self')

class ImageMatrixUpdateHandler(tornado.web.RequestHandler):
	def get(self):
		self.write('image matrix update handler')

class ImageMatrixQueryHandler(tornado.web.RequestHandler):
	def get(self):
		self.write('image matrix query handler')

def queryDatabase(databaseName):
    db = client['vastchallenge2017mc3']
    collection = db[databaseName]
    cur = collection.find({})
    result = []
    for index in cur:
      del index['_id']
      result.append(index)
    return result

def writeDatabase(data):
    db = client['vastchallenge2017mc3']
    # collection = db[itemName]
    # cur = collection.insert(data)

def updateDatabase(databaseName, className, data):
    db = client['vastchallenge2017mc3']
    collection = db[databaseName]
    collection.update({'class': className}, {'$set':{'source': data}})

if __name__ == "__main__":
	tornado.options.parse_command_line()
	print('server running at 127.0.0.1:%d ...'%(8888))
	application = tornado.web.Application([
    	(r"/(.*)", MainHandler),
        (r"/api/init", InitHandler),
        (r"/api/all", AllDataHandler),
        (r"/api/update", ImageMatrixInitHandler),
        (r"/api/imageMatrixView/update", ImageMatrixUpdateHandler),
        (r"/api/imageMatrixView/all", ImageMatrixQueryHandler)
	])
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(8888)
	tornado.ioloop.IOLoop.current().start()
