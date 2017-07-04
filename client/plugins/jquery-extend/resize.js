/**
 * Created by huangxinxin on 16/12/21.
 */
(function ($, h, c) {
  var a = $([])
  var e = $.resize = $.extend($.resize, {})
  var i
  var k = 'setTimeout'
  var j = 'resize'
  var d = j + '-special-event'
  var b = 'delay'
  var f = 'throttleWindow'
  e[ b ] = 250
  e[ f ] = true
  $.event.special[ j ] = {
    setup: function () {
      if (!e[ f ] && this[ k ]) {
        return false
      }
      var l = $(this)
      a = a.add(l)
      $.data(this, d, {
        w: l.width(),
        h: l.height()
      })
      if (a.length === 1) {
        g()
      }
    },
    teardown: function () {
      if (!e[ f ] && this[ k ]) {
        return false
      }
      var l = $(this)
      a = a.not(l)
      l.removeData(d)
      if (!a.length) {
        clearTimeout(i)
      }
    },
    add: function (l) {
      if (!e[ f ] && this[ k ]) {
        return false
      }
      var n

      function m (s, o, p) {
        var q = $(this)
        var r = $.data(this, d)
        if (r) {
          r.w = o !== c ? o : q.width()
          r.h = p !== c ? p : q.height()
          n.apply(this, arguments)
        }
      }

      if ($.isFunction(l)) {
        n = l
        return m
      } else {
        n = l.handler
        l.handler = m
      }
    }
  }
  function g () {
    i = h[ k ](
      function () {
        a.each(function () {
          var n = $(this)
          var m = n.width()
          var l = n.height()
          var o = $.data(this, d)
          if (m !== o.w || l !== o.h) {
            n.trigger(j, [ o.w = m, o.h = l ])
          }
        })
        g()
      },
      e[ b ]
    )
  }
})($, window)
