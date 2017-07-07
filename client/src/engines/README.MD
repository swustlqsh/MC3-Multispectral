# 引擎目录
## actions 数据处理操作
* Action 基类
* WorkerAction 使用Worker作为处理器的子类
## renders 渲染
### GraphTag 图片标记类
* ImageMetadata
------------------
```
   The annotation data corresponding to each image is stored in the object
   ImageMetadata
   object of type ImageMetadata() having
   the following properties:
```

* fileRef : a reference to the local file uploaded by user
* base64ImgData : contains either the image URL or image data represented 
in base64 format
* fileAttributes : a Map() 
of image file's attributes. For example, image captions can be represented by 
file attributes as
```
    Map { 'caption': 'flood' }
```
* ImageRegion
------------------
```
    Each image can have multiple regions of varying shape and attributes.
    Therefore, each array entry in `ImageMetadata.regions[]` contains an object of
    type `ImageRegion()` with the following properties corresponding to each 
    region (polygon) defined in the image:
```
 * `shape_attributes` : a [Map()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) 
of attributes defining the shape of the region. For example, a rectangular 
region has the following shape attributes 

```
Map {'name': 'rect', 'x': '115', 'y': '210', 'width': '100', 'height': '200' }
```

 * `region_attributes` : a [Map()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) 
of attributes corresponding to the region. For example, an image region 
containing a red car can have the following attributes

```
Map { 'object\_name': 'car', 'object\_color': 'red' }
```

 * `is_user_selected` : a state variable indicating if this region has been 
selected by the user







