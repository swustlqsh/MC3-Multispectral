/**
 * Created by liqiusheng on 05/07/2017.
 */
const utils = {}

utils.toJSON = d => {
    return JSON.parse(JSON.stringify(d))
}

utils.isStatusEqual = function (a, b) {
    if (a && b) {
        a = '' + a
        b = '' + b
        let v1 = a.split('@Time:')[ 0 ]
        let v2 = b.split('@Time:')[ 0 ]
        return v1 === v2
    }
    return false
}

utils.setStatus = function (state, keyStr, value, error) {
    let keyArr = keyStr.split('.')
    let lastKey = keyArr.pop()
    let status = state.status
    for (let i = 0; i < keyArr.length; i++) {
        let k = keyArr[ i ]
        if (status.hasOwnProperty(k)) {
            status = status[ k ]
        }
    }
    if (status.hasOwnProperty(lastKey)) {
        status[ lastKey ] = value + '@Time:' + (new Date().toLocaleString()) + '@Random: ' + (~~(Math.random() * Math.pow(10, 8)))
    }
    if (error) {
        let errors = state.error
        for (let i = 0; i < keyArr.length; i++) {
            let k = keyArr[ i ]
            if (errors.hasOwnProperty(k)) {
                errors = errors[ k ]
            }
        }
        if (errors.hasOwnProperty(lastKey)) {
            errors[ lastKey ] = error
        }
    }
}

utils.setArrayItem = (arr, newItem, key) => {
    let arr2 = []
    if (newItem instanceof Array) {
        arr2 = newItem
    } else {
        arr2 = [ newItem ]
    }
    arr2.forEach((item2) => {
        let tmp = arr.find((item) => item[ key ] === item2[ key ])
        if (tmp) Object.assign(tmp, item2)
        else arr.push(item2)
    })
}

utils.removeArrayItem = (arr, key, value) => {
    let index = -1
    arr.some(function (d, i) {
        index = i
        return d[ key ] === value
    })
    if (index !== -1) arr.splice(index, 1)
}

export default utils
