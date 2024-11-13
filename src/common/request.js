// main.js
import axios from 'axios';

// axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.baseURL = '';

// 请求拦截器
axios.interceptors.request.use((config) => {
    // 为每个请求添加认证头
    config.headers['Authorization'] = 'Bearer YOUR_TOKEN';
    config.headers["Content-Type"] = 'application/json;charset=UTF-8'
    config.headers["Access-Control-Allow-Origin"] = '*'
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.error('响应错误:', error.response);
    return Promise.reject(error);
});

export function request(url = '', params = {}, data = {}, type = 'POST') {
    //设置 url params type 的默认值
    return new Promise((resolve, reject) => {
        try {
            return axios({
                method: type,
                url: url,
                params,
                data: data
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        } catch (error) {
            reject(error)
        }
    })
}