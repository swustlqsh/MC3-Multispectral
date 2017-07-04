import utils from '../../frame/modules/utils'

export default (describe, it, expect) => {
  describe('frame.utils.isStatusEqual的测试用例', () => {
    const a = utils.setStatus('TEST_STATUS_SUCCESS')
    const b = utils.setStatus('TEST_STATUS_SUCCESS')
    const c = utils.setStatus('TEST_STATUS_FAILED')
    it(`${a} === ${b} => true`, () => {
      expect(utils.isStatusEqual(a, b)).to.be.ok
    })
    it(`${a} === ${c} => false`, () => {
      expect(utils.isStatusEqual(a, c)).to.not.be.ok
    })
  })

  describe('frame.utils.setArrayItem的测试用例', () => {
    const arr = [
      {id: 1, name: '1'},
      {id: 2, name: '2'},
      {id: 3, name: '3'}
    ]
    const oldArr = JSON.stringify(arr)
    utils.setArrayItem(arr, {id: 2, name: '2-2'}, 'id')
    it(`修改数组中id为2的元素的name属性值为"2-2"，${oldArr} => ${JSON.stringify(arr)}`, () => {
      expect(arr).to.have.lengthOf(3)
      expect(arr[1].name).to.equal('2-2')
    })
  })

  describe('frame.utils.removeArrayItem的测试用例', () => {
    const arr = [
      {id: 1, name: '1'},
      {id: 2, name: '2'},
      {id: 3, name: '3'}
    ]
    const oldArr = JSON.stringify(arr)
    utils.removeArrayItem(arr, 'id', 2)
    const ids = arr.map(({id}) => id)
    it(`删除数组中id为2的元素，${oldArr} => ${JSON.stringify(arr)}`, () => {
      expect(arr).to.have.lengthOf(2)
      expect(ids.indexOf(2)).to.equal(-1)
    })
  })
}
