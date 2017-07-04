# 测试脚本文件目录
* index.js：测试模块入口文件
* testFrame：frame模块测试文件夹
    * checkFunctions.test.js：checkFunctions模块测试样例
    * utils.test.js：utils模块测试样例

# 如何编写一个测试模块
* 命名规范：模块名.test.js
* 编写规范：
    ```
    export default (describe, it, expect) => {
        describe('描述你的测试', () => {
            it('描述你的用例', () => {
            expect(...).to.be.ok
            expect(...).to.not.be.ok
            expect(...).to.be.equal(...)
            })
        })
    }
    ```
* 引入规范：
    ```
    import testUtils from './testFrame/utils.test'
    ...
    testUtils(describe, it, expect)
    ```
* 参考：
    * http://mochajs.org/
    * http://chaijs.com/