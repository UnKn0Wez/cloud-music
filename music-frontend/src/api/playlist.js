import request from "@/utils/request"
const baseURL= "http://localhost:3000"

//请求歌单列表数据
export function fetchList(params){
    return request({
        params,
        url:`${baseURL}/playlist/list`,
        method:"get"
    })
}