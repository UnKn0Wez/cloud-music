const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')

//歌单模块:获取歌单列表接口
router.get('/list',async(ctx,next)=>{
    //从上下文中获得请求参数
    const query = ctx.request.query
    //异步调用封装好的云函数调用功能，传递三格参数分别为：上下文对象，云函数名称music
    //以及params参数对象（包含music云函数的具体url，当前页起始索引，每页记录数）
    const res = await callCloudFn(ctx,'music',{
        $url:'playlist',
        start:parseInt(query.start),
        count:parseInt(query.count),
    })
    console.log(res)
    let data=[]
    //根据测试发现返回结果的数据在resp_data属性中还是个json字符串
    if(res.resp_data){
        //反序列化为JSON对象，然后取出data属性
        data=JSON.parse(res.resp_data).data
    }
    //向客户端返回结果
    ctx.body={
        data,
        code:20000,
    }
})

module.exports=router