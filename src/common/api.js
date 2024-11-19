import { request, uploadRequest } from './request'

const public_url = '/api'

export class API {
    // /user/login   {"username":"admin","pwd":"111111"}
    // data.name data.username data.token
    // 登录
    static async login(params, data) {
        return request(public_url + '/user/login', params, data, 'post')
    }
    static async getDetaInfo(params, data) {
        return request(public_url + '/wxDetalis/info', params, data, 'post')
    }
    static async getProductList(params, data) {
        return request(public_url + '/product/selectProductList', params, data, 'post')
    }
    // 上传图片
    static async uploadImage(params, data) {
        return uploadRequest(public_url + '/upfile/upImage', params, data, 'post')
    }
    // 新增编辑其商品的其他信息
    static async addOrUpdateProperty(params, data) {
        return request(public_url + '/product/addAndUpdateProperty', params, data, 'post')
    }
    // 新增编辑商品
    static async addProduct(params, data) {
        return request(public_url + '/product/add', params, data, 'post')
    }


    // 用户列表
    static async getUserList(params, data) {
        return request(public_url + '/user/selectList', params, data, 'post')
    }
    // 新增用户
    static async addUser(params, data) {
        return request(public_url + '/user/addUser ', params, data, 'post')
    }
    // 编辑用户
    static async editUser(params, data) {
        return request(public_url + '/user/updateUser', params, data, 'post')
    }
}