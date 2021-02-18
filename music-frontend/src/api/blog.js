import request from "@/utils/request";
const baseURL = "http://localhost:3000";

export function fetchList(params){
    return request({
        url:`${baseURL}/blog/list`,
        method:"get",
        params:{
            ...params
        }
    });
}

export function fetchDetail(params){
    return request({
        url:`${baseURL}/blog/detail`,
        method:"get",
        params:{
            ...params
        }
    });
}

export function del(params){
    return request({
        url:`${baseURL}/blog/delete`,
        method:"post",
        data:{
            ...params
        }
    });
}