const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors=require('koa2-cors')
const koaBody = require('koa-body')
const ENV = 'qzw-4gnc72n9db26b734'

//跨域
app.use(
    cors({
        origin: ['http://localhost:9528'],
        credentials: true,
    })
)
//接受post参数解析
app.use(
    koaBody({
        multipart: true,
    })
)
//全局中间件，ctx.body即向客户端的返回内容
app.use(async (ctx, next) => {
    ctx.state.env=ENV
    // ctx.body='Hello World'
    await next()
})

//通过require引入playlist模块
const playlist = require('./controller/playlist.js')

//给playlist模块使用定义跟路由为'/playlist'
router.use('/playlist', playlist.routes())

//使用路由
app.use(router.routes())
app.use(router.allowedMethods())

//对3000端口开启监听，这是node.js的默认端口，如果已经被占用，可以停止相应进程或者换端口
app.listen(3000, () => {
    console.log('服务器开起在3000端口')
})