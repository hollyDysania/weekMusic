
> 很敬佩黄轶老师，涵盖了非常多的知识点。跟着敲还是需要一些vue基础的。


  <!--more-->

  ### 关于Vue开发音乐app的项目总结
线上地址 [点击传送门](http://47.96.100.173/)
`我把它部署到了自己的服务器 ╮(╯▽╰)╭由于没有备案 直接用的服务器ip`

#### 1.利用vue-cli 初始化项目

> 请查看另一篇文章 ✌[点击传送门](https://hollydysania.github.io/2018/03/09/vue-cli-init-project/)

#### 2.meta标签的移动端的自适应

##### 在index.js的head标签内写name为viewport的meta标签

```javascript
  <meta name="viewport" content="width=device-width,initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0, user-scalable=no">
```

###### 了解一下viewport及相关属性设置

| 属性          | 值                                                           |
| ------------- | :----------------------------------------------------------- |
| width         | 设置layout viewport 的宽度，为一个正整数，或字符串"width-device"设备宽度 |
| initial-scale | 设置页面的初始缩放值，为一个数字，可以带小数                 |
| minimum-scale | 允许用户的最小缩放值，为一个数字，可以带小数                 |
| maximum-scale | 允许用户的最大缩放值，为一个数字，可以带小数                 |
| height        | 设置layout viewport 的高度，这个属性并不重要，很少使用       |
| user-scalable | 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes代表允许 |

`根据上面这个表格不难看出：width为设备宽度，初始缩放为1，最大及最小缩放都为1，不允许缩放`

#### 3.添加依赖 babel-runtime和babel-polyfill实现ES6转ES5

babel默认只换新的javascript语法，不转换新的api，所以要安装babel-polyfill，但是会污染全局变量

为了不污染全局变量和内置对象原型，又想使用ES6新语法和api就需要配合使用babel-runtime,可以避免重复代码

```javascript
cnpm i babel-runtime --save
cnpm i babel-polyfill --save-dev
```

然后需要在入口文件main.js中

```javascript
imprort 'bable-polyfill'
```

#### 4.引入fastclick解决移动端300ms点击延迟的问题

```javascript
cnpm i fastclick --save
```

fastclick的实现原理是在检测到touchend事件的时候，会通过DOM自定义事件立即出发模拟一个click事件，并把浏览器在300ms之后的click事件阻止掉。

然后在入口文件引入

```javascript
import fastclick from 'fatclick'
fastclick.attach(document.body)
```

#### 5.webpack.base.conf.js中可以配置别名

```javascript
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
        '@': resolve('src'),
        'common': resolve('src/common')
    }
}
```

`这样页面import某个在src/common下的对象时可以直接写 import music from 'common/music'`

#### 6.路由文件的配置

```javascript
// 在router文件夹内的index.js
import Vue from 'vue'
import Router from 'vue-router'
// 以上是脚手架搭建项目已经写好的
// 假如现在有三个页面 先导入
import Test1 from 'src/components/test1'
import Test2 from 'src/components/test2'
import Test3 from 'src/components/test3'

Vue.use(Router)

export default new Router({
    routes:[
        {
           path: '/',
           redirect: '/test1'
           // 重定向path'/test1'
        },
        {
           path: '/test1',
           component: Test1
        },
        {
           path: '/test2',
           component: Test2
        },
        {
           path: '/test3',
           component: Test3
        }        
    ]
})
```

`完成了基本的路由配置 App.vue里的router-view就会渲染对应path的component`

> `最好是使用路由按需加载，请查看另一篇文章`✌ [点击传送](https://hollydysania.github.io/2018/03/10/routerLazy/)

#### 7.router-link的使用

```javascript
<router-link tag="div" class="tab-item" to="/test1">
        <span class="tab-link">测试</span>
</router-link>
// tag是渲染的标签 to对应点击以后的path
// router会默认有一个class router-link-active 可以覆盖自定义样式
```

#### 8.子组件引入和使用的规范

引入使用首字母大写加驼峰

使用小写 - 连接

```javascript
// 父组件 test2中引入test1
improt TestOne from 'components/test1'
// template中使用时
<test-one></test-one>
// 尽量语义化 我这里随意写的就没有语义化...
```

#### 9.jsonp的原理和使用

> 原理请查看另一篇文章✌[点击传送](https://hollydysania.github.io/2018/03/15/jsonp的原理和使用/)

项目中引入了jsonp插件

```javascript
cnpm i jsonp --save
```

因多处会使用到jsonp对它进行一层封装

```javascript
import originJSONP from 'jsonp'
export default function jsonp(url, data, option) {
// url与处理后的data拼接
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // 返回一个promise
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
    // 插件默认返回第一个参数为null第二个参数为数据 所以会接收两个参数
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 对data数据进行处理
function param(data) {
  let url = ""
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
```

因为使用promise封装了 所以调用时要用到.then

```javascript
import jsonp from 'common/js/jsonp'
jsonp(url, data, option).then((res) => {console.log(res)})
```

那么问题来了 ↓

#### 10.为什么要使用promise对jsonp进行封装

##### 试想一种应用场景（回调地狱）

`A通过jsonp请求获取，B拿到A返回的数据作为参数通过jsonp请求获取，C拿到B返回的数据作为参数通过jsonp请求获取`

我们的做法一般都是，执行jsonp({Aparams})并在A回调里拿到B需要的参数并且执行jsonp({Bparams})然后在B的回调里拿到C需要的参数并且执行jsonp({Cparams})

一两层回调的嵌套其实也觉得还好，但如果业务逻辑复杂需要`嵌套100层呢`？这样就非常不便于阅读和维护，也就是常听到的“回调地狱”

##### 以上promise封装是怎么做到解决回调地狱的呢？

还是上面那个应用场景，我们用以上封装的jsonp怎么使用呢

jsonp({Aparams}).then(jsonp({Bparams})).then({jsonp(Cparams)})即可

当第一个jsonp执行后返回一个promise对象，promise对象状态发生改变就会触发then并且可以拿到A的resolve传递出去的数据,再执行第二个jsonp返回一个promise对象，让promise对象状态发生变化时触发then可以拿到B的resolve传递出去的数据再执行第三个jsonp，依次类推，非常清晰。

当然业务上其实有reject的情况，这时会执行.catch( // 进行错误处理)

那么问题来了，什么是promise状态发生改变时

###### promise的三种状态

1. pending(进行中)；
2. fulfilled(已成功)；
3. rejected(已失败)。

###### 状态改变

1. 当执行resolve时,promise对象的状态会从pending 变为 fulfilled；
2. 当执行reject时,promise对象的状态会从pending 变为 rejected;

`当然ajax也可以结合promise封装，axios已经结合了promise可以直接使用`

#### 11.better-scroll的使用

> 由于项目很多地方都需要滑动，所以我们对better-scroll进行封装

> 详见本站另一篇文章✌  [点击传送](https://hollydysania.github.io/2018/04/19/better-scoll的封装与使用/)

#### 12.图片懒加载: Vue-Lazyload

> 非常好用的一个优化插件 官方文档✌  [点击传送](https://github.com/hilongjw/vue-lazyload)

#### 使用步骤

1.npm 安装

```javascript
cnpm install vue-lazyload --save
```

2.main.js中use

```javascript
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
	// loading图片
    loading: require('本地图片路径')
})
// 页面中使用 只需要用v-lazy指令替换src就可以了
// scr="imgUrl" => v-lazy="imgUrl"
```

`更多属性请看官方文档，超超超好用`

#### 13.vuex的使用

vuex帮助我们管理共享状态,多个没有什么关联性的组件想要共享状态可以通过vuex

详见另一篇文章 ✌ [vuex的学习及使用](https://hollydysania.github.io/2018/03/24/Vuex的学习及使用/)

#### 14.ES6 class类的基本使用

1. ES5中生成实例对象的方法--构造函数

```javascript
function Holly(x, y) {
    this.x = x
    this.y = y
}
Holly.protitype.connect = function() {
    return (this.x + ',' + this.y )
}
var hollyTree = new Holly('www.hollytree', '.top')
```

2. ES6 中引入class这个概念,针对上面改写

```javascript
// 定义一个Holly的类
class Holly {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    // 方法直接定义 不需要function关键字 也不需要逗号
    connect() {
        return (this.x + ',' + this.y )
    }
}
var hollyTree = new Holly('www.hollytree', '.top')
```

> Holly类里有一个cunstructor方法，这就是构造方法this指向实例。 `也就是说ES5中的构造函数Holly对应ES6中Holly类的构造方法`

- ES6的类可以看做构造函数的另一种写法，typeof 类 返回 ‘function’,数据类型为函数，类本身指向构造函数；
- 类所有的方法都定义在类的prototype（原型）上；
- 原型对象的constructor属性直接指向类本身与ES5一致

##### 由于项目中多处用到歌曲的数据，并且数据需求的格式基本一样，所以这里选择用类来创建song实例

```javascript
// song.js
// 定义一个Song类，类的构造函数接收一些参数并指向实例
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  // 类的方法 实例可以直接调用
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
  }
}
let songData = new Song({id: 22, mid:666, singer: 'holly'...})
console.log(songData) // {id: 22, mid: 666, singer: 'holly'...}
```

#### 15.HTML5 audio音频播放

> 简单应用 

```html
<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"> </audio>

```

1. play()方法 开始播放
2. canplay事件：当浏览器可以开始播放音频/视频时触发。
3. paly事件： 当音乐开始播放时触发（播放暂停有时因为业务逻辑可能需要将canplay换成play事件，控制切换以及ready触发时保证已经play()）
4. error事件：当在音频/视频加载期间发生错误时触发。
5. timeupdate事件：在音频/视频（audio/video）的播放位置发生改变时触发。

> 以下代码实现功能：

- 当歌曲发生改变的时候播放也就是调用play()
- 在播放器切换歌曲时可以控制，当前歌曲已经ready时才能切换到下一首
- 实时获取播放时间

```javascript
data() {
    return {
    // 标识
        songReady: false
    }
}，
methods: {
// 只有该歌曲已经ready时，赋值为true
    ready() {
        this.songReady = true
    },
// 然后在切换的方法里 例如next() 加一个判断就可以了
	next() {
        if(!this.songReady) {
            return
        }
        // 就不执行下面的了
        ...
        // 最后在重置为false
        this.songReady = false
	}，
    // 当资源加载失败时不影响切换操作
    error() {
       this.songReady = true 
    }
}，
watch: {
    // 当前歌曲变化时并且已经ready 开始播放
    currentSong() {
        if(!this.songReady) {
            return
        }
        this.$refs.audio.play()
        this.songReady = true
    }
}
```

#### 16. Vue的混入  Mixins 的使用

> 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。
>
> 详见另一篇文章✌  [点击传送 Mixins的使用](https://hollydysania.github.io/2018/04/25/Vue中混入的使用（Mixins）/)

#### 17.带实时提示的搜索组件的节流

- vue中一般是v-model绑定input值然后监听，一旦发生改变就发送请求；
- 例如我想搜索周杰伦，输入周时请求一次，杰时请求一次，伦时请求一次；或者删除伦时请求一次....
- 频繁的发送请求，页面有可能造成卡顿，也增大了服务器的压力；
- 这个时候需要进行节流优化。

> [案例 传送门](https://hollydysania.github.io/2018/05/10/javascript中的节流控制案例/)

#### 18.Vue中常用的一些是事件修饰符

项目中用到了.stop .prevent

- .stop  `阻止事件冒泡`
- .prevent `取消浏览器默认行为（例如a标签的默认刷新页面）`
- .capture `使用事件捕获模式`
- .self  `只作用于元素本身，类似于已阻止事件冒泡`
- .once `只作用一次`

> 修饰符可以串联 例如需要阻止冒泡并且只触发一次 .stop.once

#### 19.打包

```javascript
npm run build
```

打包以后的文件如下：

`包含static静态资源文件夹 与 html 文件`

> 由于是单页应用程序，进入首页时会加载所有的静态文件。项目比较大时会白屏很久。
>
> 这时推荐路由懒加载的模式进行优化，这样打包后会分模块，进入不同路由后加载对应静态资源
>
> 详见： [路由懒加载✌](https://hollydysania.github.io/2018/03/10/routerLazy/)

#### 20.手机上调试推荐使用vConsole

> 一个由微信团队开发开源的插件 使用方法 [ 点击传送✌](https://hollydysania.github.io/2018/05/26/移动端前端开发调试工具-vConsole/)

