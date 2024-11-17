import { request } from './request'

const public_url = ''

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
        return request(public_url + '/upfile/upImage', params, data, 'post')
    }
    // 新增编辑其他信息
    static async addOrUpdateProperty(params, data) {
        return request(public_url + '/product/addAndUpdateProperty', params, data, 'post')
    }
    // 新增编辑商品
    static async addProduct(params, data) {
        return request(public_url + '/product/add', params, data, 'post')
    }
}