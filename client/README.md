# 教程
https://confluence.b.360.cn/pages/viewpage.action?pageId=10092607

# 安装
* `npm install` 或者 `cnpm install`
* 天眼Npm源切换 `npm(cnpm) set registry http://10.95.24.22:5010/`
* 天眼Npm服务 http://10.95.24.22:5011/

# 使用
* dev(开发模式): `npm run dev`
* pro(发布模式): `npm run pro`

# 自定义配置
* 配置文件: `config.custom.js`
* 配置文档: http://10.95.24.22:5011/package/@qnpm/skyfenv

# 本地开发配置
* 配置文件: `local.config.js`

# Worker的使用
* 文件命名规范: xxx.worker.js
* 使用: 
	* a.js
	```
    import XxxWorker from 'path/to/xxx.worker'
    const wk = new XxxWorker()
    wk.onmessage = (evt) => { ... }
    wk.onerror = (evt) => { ... }
    wk.postMessage(data)
	```
	* xxx.worker.js
	```
	onmessage = (evt) => {
	  ...
	  self.postMessage(data)
	  self.close()
	}
	```

# Less变量文件在JS中的使用
* 文件命名规范: xxx.vars.less
* 使用:
	* xxx.vars.less
	```
	@color-main: orange;
	```
	* a.js
	```
	import lessVars from 'path/to/xxx.vars.less'
	console.log(lessVars) // => {colorMain: 'orange'}
	```

# Frame 文档
* 路径: frame/README.md

