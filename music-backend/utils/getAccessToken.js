//引入异步请求库
const rp = require('request-promise')
const APPID='wx08068c44770df325'
const APPSECRET='840d21e07394923db8bb843c9544cea8'
//请求access_token的URL
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
//引入node.js的文件操作模块
const fs = require('fs')
//引入node.js的文件路径模块
const path = require('path')
const fileName=path.resolve(__dirname,'./access_token.json')

//异步方法
const updateAccessToken=async()=>{
    //发起异步get请求，得到结果
    const resStr = await rp(URL)
    //将JSON字符串反序列化为JSON对象
    const res = JSON.parse(resStr)
    console.log(res)
    //如果返回结果中有access_token,则写入文件
    if(res.access_token){
        //文件模块的同步写方法，参数为->完整路径文件名，写入的内容(字符串)，所以这里将对象(access_token串和创建时间)序列化一下
        fs.writeFileSync(
            fileName,
            JSON.stringify({
                access_token:res.access_token,
                createTime:new Date(),
            })
        )
    }else{
        //否则继续请求
        await updateAccessToken()
    }
}

//定义一个getAccessToken为异步执行的函数
const getAccessToken = async()=>{
    try{
        //同步读取文件(结果为字符串)
        const readRes = fs.readFileSync(fileName,'utf8')
        //将结果转成对象
        const readObj=JSON.parse(readRes)
        //得到其中的创建时间
        const createTime = new Date(readObj.createTime).getTime()
        //计算和当前时间的差值
        const nowTime=new Date().getTime()
        //token超时，重新请求
        if((nowTime-createTime)/1000/60/60>=2){
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    }catch(error){
        await updateAccessToken()
        await getAccessToken()
    }
}

//定时器，快要到7200秒就请求更新access_token
setInterval(async() =>{
    await updateAccessToken()
},(7200-300)*1000)

// updateAccessToken()

module.exports = getAccessToken
