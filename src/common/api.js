import { request } from './request'

const public_url = '8.153.68.28:8090'

export class API {
    static async getDetaInfo(params, data) {
        return request(public_url + '/wxDetalis/info', params, data, 'post')
    }
    static async getProductList(params, data) {
        return request(public_url + '/product/selectProductList', params, data, 'post')
    }
}