#### 照片托管后台

a [http://koajs.com/](koa) app

#### Install and Run
```bash
git clone https://github.com/QiIL/order-manage-sys.git
# add config/env document
# add config.base.js and config.development.js and config.unittest.js
npm i
npm start
```

#### Test
测试环境构建文件
```bash
test/bootstrap.js --启动文件
config/env/config.unittest.js --测试配置文件
# 运行
npm test
```

#### APIs
restful api

- [restful api](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

其他api配置

    routes: routers
    api: api/controllers
    models: api/models
    service: api/services

#### 代码规范
response数据

    response返回对象实例
    {
        data:{} -- 返回的数据
        code:200, -- 200代表没有错误，非2xx代表有错误
        msg:'get user info success!' -- 接口信息
        error:'find mongodb err!' -- 错误信息
    }


#### Support
Need help or have a question?

- [koa](http://koajs.com/)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/sails.js)
- [mongoose](http://mongoosejs.com/docs/api.html)
- [Git/manager](http://www.ruanyifeng.com/blog/2012/07/git.html)


