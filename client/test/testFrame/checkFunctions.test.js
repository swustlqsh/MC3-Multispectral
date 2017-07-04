import checkFunctions from '../../frame/modules/checkFunctions'

const exps = [{
  functionName: 'isNotEmpty',
  desc: '非空',
  cases: [
    { args: [1], result: true },
    { args: [0], result: false },
    { args: ['1'], result: true },
    { args: ['abc'], result: true },
    { args: [''], result: false },
    { args: [[1]], result: true },
    { args: [[]], result: false },
    { args: [{a: 1}], result: true },
    { args: [{}], result: false },
    { args: [null], result: false },
    { args: [], result: false }
  ]
}, {
  functionName: 'isId',
  desc: '是中国身份证号码',
  cases: [
    { args: ['110228201704070022'], result: true },
    { args: ['11022820170407002X'], result: true },
    { args: ['11022820170407002x'], result: false },
    { args: ['11022820170407002'], result: false }
  ]
}, {
  functionName: 'isEmail',
  desc: '是电子邮箱地址',
  cases: [
    { args: ['hx@360.cn'], result: true },
    { args: ['hx360.cn'], result: false },
    { args: ['hx@360'], result: false }
  ]
}, {
  functionName: 'isMobile',
  desc: '是中国手机号',
  cases: [
    { args: ['18899991234'], result: true },
    { args: ['10099991234'], result: false },
    { args: ['188999912'], result: false },
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isTel',
  desc: '是中国电话号码',
  cases: [
    { args: ['5279090'], result: true },
    { args: ['01088889999'], result: true },
    { args: ['188999912'], result: false },
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isIpv4',
  desc: '是IPv4',
  cases: [
    { args: ['8.8.8.8'], result: true },
    { args: ['256.1.1.1'], result: false },
    { args: ['0.1.300.1'], result: false },
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isIpv6',
  desc: '是IPv6',
  cases: [
    { args: ['2001:0DB8:02de:0000:0000:0000:0000:0e13'], result: true },
    { args: ['2001:DB8:2de:0:0:0:0:e13'], result: true },
    { args: ['2001:DB8:2de::e13'], result: true },
    { args: ['8.8.8.8'], result: false },
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isMd5',
  desc: '是MD5',
  cases: [
    { args: ['1055d3e698d289f2af8663725127bd4b'], result: true },
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isUrl',
  desc: '是URL',
  cases: [
    { args: ['https://confluence.b.360.cn/pages/viewpage.action?pageId=10092643'], result: true },
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isMinLen',
  desc: '长度大于等于',
  cases: [
    { args: ['abcd', 4], result: true },
    { args: ['abcd', 5], result: false },
    { args: [1234, 4], result: true },
    { args: [[1, 2, 3, 4], 4], result: true }
  ]
}, {
  functionName: 'isMaxLen',
  desc: '长度小于等于',
  cases: [
    { args: ['abcd', 4], result: true },
    { args: ['abcd', 5], result: true },
    { args: [1234, 4], result: true },
    { args: [[1, 2, 3, 4], 3], result: false }
  ]
}, {
  functionName: 'isRangeLen',
  desc: '长度在范围内',
  cases: [
    { args: ['abcd', 2, 5], result: true },
    { args: ['abcd', 5, 10], result: false },
    { args: [1234, 4, 5], result: true },
    { args: [[1, 2, 3, 4], 2, 5], result: true },
    { args: [[1, 2, 3, 4], 5, 10], result: false }
  ]
}, {
  functionName: 'isJson',
  desc: '是JSON',
  cases: [
    { args: ['{"a": 123}'], result: true },
    { args: ['{a: 123}'], result: false },
    { args: ['{a: 123'], result: false },
    { args: ['"abc"'], result: true },
    { args: ['abc'], result: false },
    { args: [1], result: true }
  ]
}, {
  functionName: 'isBase64',
  desc: '是Base64',
  cases: [
    { args: ['abc'], result: false },
    { args: [1], result: false }
  ]
}, {
  functionName: 'isLt',
  desc: '小于',
  cases: [
    { args: [1, 2], result: true },
    { args: ['abc', 'abcd'], result: true },
    { args: ['2010-10-10', '2010-10-11'], result: true },
    { args: ['2016-10-10', '2010-10-11'], result: false }
  ]
}, {
  functionName: 'isLte',
  desc: '小于等于',
  cases: [
    { args: [1, 1], result: true },
    { args: ['abc', 'abcd'], result: true },
    { args: ['2010-10-10', '2010-10-10'], result: true },
    { args: ['2016-10-10', '2010-10-11'], result: false }
  ]
}, {
  functionName: 'isGt',
  desc: '大于',
  cases: [
    { args: [2, 1], result: true },
    { args: ['abcd', 'abc'], result: true },
    { args: ['2010-10-12', '2010-10-11'], result: true },
    { args: ['2010-10-10', '2016-10-11'], result: false }
  ]
}, {
  functionName: 'isGte',
  desc: '大于等于',
  cases: [
    { args: [1, 1], result: true },
    { args: ['abcd', 'abc'], result: true },
    { args: ['2010-10-12', '2010-10-12'], result: true },
    { args: ['2010-10-12', '2010-10-11'], result: true },
    { args: ['2010-10-10', '2016-10-11'], result: false }
  ]
}, {
  functionName: 'isIn',
  desc: '在',
  cases: [
    { args: ['123', '1234567'], result: true },
    { args: ['1235', '1234567'], result: false },
    { args: [1, [1, 2, 3]], result: true },
    { args: [[1], [1, 2, 3]], result: false }
  ]
}, {
  functionName: 'isNotIn',
  desc: '不在',
  cases: [
    { args: ['123', '1234567'], result: false },
    { args: ['1235', '1234567'], result: true },
    { args: [1, [1, 2, 3]], result: false },
    { args: [[1], [1, 2, 3]], result: true }
  ]
}]

export default (describe, it, expect) => {
  exps.forEach(({functionName, desc, cases}) => {
    if (checkFunctions[functionName]) {
      describe(`frame.checkFunctions.${functionName}(${desc})的测试用例`, () => {
        cases.forEach((item) => {
          let argStr = JSON.stringify(item.args)
          argStr = argStr.slice(1, argStr.length)
          argStr = argStr.slice(0, argStr.length - 1)
          it(`${functionName}(${argStr}) => ${item.result}`, () => {
            expect(checkFunctions[functionName].apply(checkFunctions, item.args)).to.be.equal(item.result)
          })
        })
      })
    }
  })
}
