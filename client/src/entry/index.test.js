import Vue from 'vue'
import chai from 'chai'
import mocha from 'mocha'
import tests from '../../test'

const run = function () {
  return new Vue({
    el: 'body',
    replace: false,
    template: '<div id="mocha"></div>',
    created () {
      mocha.setup('bdd')
    },
    ready () {
      tests(window.describe, window.it, chai.expect)
      mocha.run()
    }
  })
}

run()
