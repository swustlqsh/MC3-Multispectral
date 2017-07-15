# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options
import os
import sys
from tornado.options import define, options
import tornado.websocket
import json, ast
import numpy as np
from pymongo import MongoClient
# import datamanager
# import frq_path_stat
define("port", default=20768, type=int, help = "run on the given port")
client = MongoClient('192.168.10.9',27066)
os.path.join(os.path.split(__file__)[0],'./cython/arrContain/build/lib/')
# the path to server html, js, css files
client_file_root_path = os.path.join(os.path.split(__file__)[0],'./')
client_file_root_path = os.path.abspath(client_file_root_path)
# datamanager
# print data_dict_path
print('Init data manager');
# data_manager = datamanager.DataManager();
# cal_freq = frq_path_stat.FrqPathStat();
class wsHandler(tornado.web.RequestHandler):
    def get(self):
      print('...............wsHandler')
      data = self.get_argument('data')
      message = self.get_argument('message')
      print(data)
      print(message)
      
      # if message == 'GetExampleData':
      #     result = data_manager.getExampleData(data);
      #     result = json.dumps(result, cls = MyEncoder);

      # if message == 'histogramGroupData':
      #     constraint = data.split('&');
      #     result = cal_freq.frq_path(constraint[0], constraint[1], constraint[2], constraint[3]);
      #     result = json.dumps(result, cls = MyEncoder);

      # evt_unpacked = {'message': message, 'data': result, 'send':data};

      # evt_unpacked = {'message': message, 'data': result};
      # print('SEND ', message);
      # evt = json.dumps(evt_unpacked)
      # self.write(evt);

def queryDatabase(databaseName):
    db = client['vastchallenge2017mc3']
    collection = db[databaseName]
    cur = collection.find({})

    result = []
    for index in cur:
      del index['_id']
      result.append(index)
    return result

def writeDatabase(databaseName,data):
    db = client['vastchallenge2017mc3']
    collection = db[databaseName]
    cur = collection.insert_many(data)

def updateDatabase(databaseName, className, carList):
    db = client['vastchallenge2017mc3']
    collection = db[databaseName]
    collection.update({'class': className},{'$set':{'carList': carList}})


#  def updateClassListDatabase(databaseName, carID, classList):
#     db = client['vastchallenge2017mc1']
#     collection = db[databaseName]
#     collection.update({'class': className},{'$set':{'carList': carList}})


# class checkClassNameHandler(tornado.web.RequestHandler):
#     def get(self):
#       print('...............checkClassNameHandler')
#       name = self.get_argument('data');
#       message = self.get_argument('message');
#       print(name);
#       print(message);
#       result = queryDatabase('label')
#       flag = "success"
#       for index in result:
#         #print(index)
#         if index["class"] == name:
#           flag = 'fail'

#       evt_unpacked = {'message': message, 'data': flag};
#       print('SEND ', message);
#       evt = json.dumps(evt_unpacked)
#       self.write(evt);

# class updateClassHandler(tornado.web.RequestHandler):
#     def get(self):
#       print('...............updateClassHandler')
#       data = json.loads(self.get_argument('data'));
#       message = self.get_argument('message');
#       print(data);
#       print(message);
#       if data:
#         writeDatabase('label', [data])
#       result = queryDatabase('label')
#       #print(result)

#       evt_unpacked = {'message': message, 'data': result};
#       print('SEND ', message);
#       evt = json.dumps(evt_unpacked)
#       self.write(evt);

# class carClassHandler(tornado.web.RequestHandler):
#     def get(self):
#       print('...............updateClassHandler')
#       data = self.get_argument('data');
#       message = self.get_argument('message');
#       print(data)
#       print(message)

#       #if data:
#       #writeDatabase('label', [data])


#       db = client['vastchallenge2017mc1']
#       collection = db[databaseName]
#       cur = collection.find({"carID": data})


#       result = queryDatabase('carPath')
#       data = []
#       for index in result[0]:
#         data.append({"carID": index, "classList": []})
      
#       writeDatabase('carClass', data)

#       #data.append({"carID": index[0], ""})
#       #print(result)
#       # evt_unpacked = {'message': message, 'data': result};
#       # print('SEND ', message);
#       # evt = json.dumps(evt_unpacked)
#       # self.write(evt);

# # json encode for numpy ndarray and so on
# class MyEncoder(json.JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, np.integer):
#             return int(obj)
#         elif isinstance(obj, np.floating):
#             return float(obj)
#         elif isinstance(obj, np.ndarray):
#             return obj.tolist()
#         else:
#             return super(MyEncoder, self).default(obj)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    print('server running at 127.0.0.1:%d ...'%(tornado.options.options.port))
    app = tornado.web.Application(
        handlers=[
                  (r'/ws', wsHandler),
                  # (r'/checkClassName', checkClassNameHandler),
                  # (r'/updateClass', updateClassHandler),
                  # (r'/carClass', carClassHandler),
                  # (r'/queryCarList', queryCarListHandler),
                  (r'/(.*)', tornado.web.StaticFileHandler, {'path': client_file_root_path,
                                               'default_filename': 'index.html'}) # fetch client files
                  ],
        debug=True,
    )


    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
