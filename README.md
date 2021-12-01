继承Watcher类的实例中使用$watch监听数据的变化
```js
const Watcher = require('./Watcher')

class Test extends Watcher {
  a = 0
}


const test = new Test()


const unwatch =  test.$watch('a', function(newValue, oldValue) {
  console.log(this.a, newValue, oldValue)
})


test.a = 123
// test.$watch:  0 123 0
unwatch()
test.a = 456
```