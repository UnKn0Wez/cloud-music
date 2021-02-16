import request from "@/utils/request";
const baseURL= "http://localhost:3000";

//请求歌单列表数据
export function fetchList(params){
    return request({
        params,
        url:`${baseURL}/playlist/list`,
        method:"get"
    });
}

//请求歌单详情
export function fetchById(params){
    return request({
        params,
        url:`${baseURL}/playlist/detail`,
        method:"get"
    });
}

//修改歌单
export function update(params){
    return request({
        url:`${baseURL}/playlist/update`,
        data:{
            ...params
        },
        method:"post"
    });
}

//删除歌单
export function del(params){
    return request({
        params,
        url:`${baseURL}/playlist/delete`,
        method:"post"
    });
}