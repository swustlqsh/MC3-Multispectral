# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function
import socket
import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.httputil
# from tornado.escape import json_decode
import json
from SocialAnalysis.social_analysis import request_dispatch


class Index(tornado.web.RequestHandler):
    def get(self):
        self.write('<html><body>Hello, world!')


class TreeHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.content_type = 'application/json'
        self.add_header("Access-Control-Allow-Origin", "*")
        if self.request.arguments.has_key("G"):
            graph = self.get_argument('G')
            cal_type = self.get_argument('cal_type')
            source = self.get_argument('source', '')
            target = self.get_argument('target', '')
            func_name = self.get_argument('func_name')
            length = int(self.get_argument('step', 4))
            inter_day = self.get_argument('inter_day', 0)
            time_check = bool(int(self.get_argument('time_check', 0)))
            new_arguments = {
                "G": graph.split(','),
                "cal_type": cal_type,
                "source": source,
                "target": target,
                "func_name": func_name,
                "length": length,
                "inter_day": inter_day,
                "time_check": time_check
            }
            data = request_dispatch(json.dumps(new_arguments))
            self.write(data)

        else:
            self.write({"status": 2, "msg": " Request params not valid.", "data": None})
        self.finish()

    def post(self, *args, **kwargs):
        self.content_type = 'application/json'
        self.add_header("Access-Control-Allow-Origin", "*")
        file_dic = {}
        arg_dic = {}
        tornado.httputil.parse_body_arguments('application/x-www-form-urlencoded', self.request.body, arg_dic, file_dic)

        self.write("暂时不支持post请求")
        self.finish()


class TreeWebSocket(tornado.websocket.WebSocketHandler):
    # 修复 [tornado]使用webscoket的使用总是403错误
    # http://blog.csdn.net/orangleliu/article/details/42008423
    def check_origin(self, origin):
        return True

    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        parsed = tornado.escape.json_decode(message)
        if (parsed.has_key('G') and parsed.has_key('func_name')):
            data = request_dispatch(parsed)
            self.write_message(data)
        else:
            self.write_message({"status": 2, "msg": " Request params not valid.", "data": None})

    def on_close(self):
        print("WebSocket closed")


if __name__ == '__main__':
    app = tornado.web.Application([
        ('/', Index),
        ('/tree', TreeHandler),
        (r"/wstree", TreeWebSocket)
    ])
    port = 5009
    app.listen(port)
    ip = socket.gethostbyname(socket.gethostname())
    print(u'当前启动 %s:%s' % (ip, port))
    tornado.ioloop.IOLoop.instance().start()
