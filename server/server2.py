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

class UpdateHandler(tornado.web.RequestHandler):
	def post(self):
		databaseName = self.get_argument('databaseName')
		print('...............wsHandler')
		print(databaseName)
		result = queryDatabase(databaseName)
		print(result)
		# self.write('vuex update handler')

class QueryHandler(tornado.web.RequestHandler):
	def get(self):
		databaseName = self.get_argument('databaseName')
		result = queryDatabase(databaseName)
		self.write('vuex query handler')

class InitHandler(tornado.web.RequestHandler):
	def post(self):
		databaseName = self.get_argument('databaseName')
		originalData = self.get_argument('originalData')
		db = client['vastchallenge2017mc3']
		print(databaseName)
		collection = db[databaseName]
		print(collection)
		print(originalData)
		print(databaseName)
		print(type(originalData))
		originalObj = json.loads(originalData)
		print(type(originalObj))
		print('originalObj', originalObj)
		print('array', [originalObj])
		collection.insert_many(originalObj)
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
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/api/init", InitHandler),
        (r"/api/all", UpdateHandler),
        (r"/api/imageMatrixView/init", ImageMatrixInitHandler),
        (r"/api/imageMatrixView/update", ImageMatrixUpdateHandler),
        (r"/api/imageMatrixView/all", ImageMatrixQueryHandler),
    ])
    application.listen(8888)
    tornado.ioloop.IOLoop.current().start()
