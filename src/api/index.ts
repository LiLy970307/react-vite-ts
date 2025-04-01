import request from '../request/index'

// 文件上传
export function addUser(data: any) {
    return request({
        url: '/user/creatUser',
        method: 'post',
        data
    })
}