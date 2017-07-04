import testCheckFunctions from './testFrame/checkFunctions.test'
import testUtils from './testFrame/utils.test'

export default (describe, it, expect) => {
  testCheckFunctions(describe, it, expect)
  testUtils(describe, it, expect)
}
