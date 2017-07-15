var mongodb = require("mongodb");

var server = new mongodb.Server('192.168.10.9', 27066, { auto_reconnect: true }, 10);
var db = new mongodb.Db("vastchallenge2017mc3", server);

var MongoClient = require('mongodb').MongoClient;

// db.open(function (err, db) {
//
//   if (err) {
//     console.log("err occured.");
//   }
//
//   /*db.createCollection('fuck1',{safe:true},function(err,collection){
//    if(err){
//    console.log(err);
//    }else{
//    console.log("created successful!");
//    }
//
//    });*/
//
//   db.collection('matrix', function (err, collection) {
//     var channelArray = [ 'B1B5B6', 'B3B2B1', 'B4B3B2', 'B5B4B2', 'NDVI', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6' ]
//     var dateArray = [ '2014_03_17', '2014_08_24', '2014_11_28', '2014_12_30',
//       '2015_02_15', '2015_06_24', '2015_09_12', '2015_11_15',
//       '2016_03_06', '2016_06_26', '2016_09_06', '2016_12_19' ]
//     var imageObjArray1 = []
//     for (var i = 0; i < channelArray.length; i++) {
//       var channelName = channelArray[ i ]
//       for (var j = 0; j < dateArray.length; j++) {
//         var imageObj = {}
//         var date = dateArray[ j ]
//         imageObj = {}
//         imageObj.type = 'imageObj'
//         imageObj.channelName = channelName
//         imageObj.date = date
//         imageObj.imageName = channelName + '_' + date
//         imageObj.iIndex = i
//         imageObj.jIndex = j
//         imageObj.featuresArray = []
//         imageObj.displayRange = [ 0, 6 ]
//         imageObj.eventsArray = []
//         imageObjArray1.push(imageObj)
//       }
//     }
//     collection.insert(imageObjArray1, { safe: true }, function (err, result) {
//       if (err) throw err;
//       console.log("insert done");
//       queryData()
//     });
//
//     /*collection.update({'name':'tom'},{$set:{'name':'lily','age':100}},function(err,result){
//      if(err) throw err;
//      if(!err){
//      console.log("update successful");
//      }
//      });*/
//
//     /*collection.remove({'name':'tom'},{safe:true},function(err,result){
//      if(err) console.log(err);
//      });*/
//     /*	//获取所有结果
//      collection.find().toArray(function(err,items){
//      if(err) throw err;
//      for(var i=0;i<items.length;i++){
//      console.log(items[i]);
//      }
//      for(item in array){
//      console.log(array[item]);
//      }
//      });*/
//     //流式获取所有结果
//     /*	var stream = collection.find().streamRecords();
//      stream.on("data",function(item){
//      console.log(item);
//      });
//      stream.on("end",function(){
//      console.log("stream is end");
//      });*/
//
//     collection.findOne({ 'name': 'tom' }, function (err, result) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });
// });

var queryFinish = function(result){
  // console.log('result', result)
}
queryData('matrix', queryFinish)

function queryData (tableName, queryFinish) {
  var DB_CONN_STR = 'mongodb://192.168.10.9:27066/vastchallenge2017mc3';

  var selectData = function(db, callback) {
    //连接到表
    var collection = db.collection(tableName);
    //查询数据
    var whereStr = {"type":'imageObj'};
    collection.find(whereStr).toArray(function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      callback(result);
    });
  }

  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    selectData(db, function(result) {
      queryFinish(result)
      return result
      db.close();
    });
  });
}

updateData("B1B5B6_2014_03_17", "event", ['uahuahau'])
function updateData(imageName, type, data){
  var DB_CONN_STR = 'mongodb://192.168.10.9:27066/vastchallenge2017mc3';

  var updateData = function(db, callback) {
    //连接到表
    var collection = db.collection('matrix');
    //更新数据
    var whereStr = {"imageName": imageName};
    console.log('updateData', data)
    if(type === "event"){
      var updateStr = {$set: { 'eventsArray' : data}};
    }else if(type === "feature"){
      var updateStr = {$set: { 'featuresArray' : data}};
    }
    collection.update(whereStr, updateStr, function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      callback(result);
    });
  }

  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    updateData(db, function(result) {
      console.log(result);
      db.close();
    });
  });
}

addData({'feature': 1111})
function addData(data){
  var DB_CONN_STR = 'mongodb://192.168.10.9:27066/vastchallenge2017mc3';

  var insertData = function(db, callback) {
    //连接到表 site
    var collection = db.collection('feature');
    //插入数据
    collection.insert(data, function(err, result) {
      console.log('insertData', data)
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
      callback(result);
    });
  }

  MongoClient.connect(DB_CONN_STR, function(err, db) {
    insertData(db, function(result) {
      console.log(result);
      db.close();
    });
  });
}