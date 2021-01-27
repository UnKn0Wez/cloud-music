// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  enf : 'qzw-4gnc72n9db26b734'
})

//引入云数据库，并定义一个常量方便调用
const db = cloud.database()

const playlistCollection = db.collection('playlist')

const axios = require('axios')

const URL = 'https://qzwwx.cn1.utools.club/top/playlist/highquality?before=1503639064232&limit=20'
// 云函数入口函数
exports.main = async(event,context) =>{
  const{
    data
  }=await axios.get(URL)
  console.log('######'+JSON.stringify(data))

  if(data.code>=1000){
    console.log(data.msg)
    return 0
  }

  const playlist = data.playlists

  const newData=[]

  for(let i= 0,len = playlist.length;i<len;i++){
    let pl=playlist[i]
    pl.createTime=db.serverDate()
    newData.push(pl)
  }
  console.log(newData)
  if(newData.length>0){
    await playlistCollection.add({
      data:[...newData]
    }).then((res)=>{
      console.log('插入成功')
    }).catch((err) =>{
      console.log(err)
      console.log('插入失败')
    })
  }
  return newData.length

}


