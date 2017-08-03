# my-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9996
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

vue版本微信界面，需要配合另外一个wxBot项目做服务器进行交互  
项目下载后直接npm run dev即可运行，微信界面在localhost:9996/#/list当中  
项目的proxyTable 已经配置了指向后台服务的地址  '/back': 'http://localhost:9998' 未避免出现错误信息可以先启动后台服务  
界面如图所示  
