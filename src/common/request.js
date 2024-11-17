// main.js
import axios from 'axios';
import router from '@/router';

// axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.baseURL = 'http://8.153.68.28:8090';

// 请求拦截器
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || '';
    // 为每个请求添加认证头
    config.headers['token'] = token;
    config.headers["Content-Type"] = 'application/json;charset=UTF-8'
    config.headers["Access-Control-Allow-Origin"] = '*'
    return config;
}, (error) => {
    console.error('请求错误:', error);
    return Promise.resolve({
        data: {
            code: -1,
            msg: '请求发送失败'
        }
    });
});

// 响应拦截器
axios.interceptors.response.use((response) => {
    if (response.data.code === 401) {
        router.replace('/login');
        return Promise.reject(response.data);
    }
    return response;
}, (error) => {
    console.error('响应错误:', error.response);
    if (error.response?.data?.code === 401) {
        router.replace('/login');
    }
    return Promise.resolve({
        data: {
            code: -1,
            msg: error.response?.data?.message || '请求失败'
        }
    });
});

export function request(url = '', params = {}, data = {}, type = 'POST') {
    //设置 url params type 的默认值
    return new Promise((resolve) => {
        try {
            axios({
                method: type,
                url: url,
                params,
                data: data
            }).then(res => {
                if (res.data.code === 401) {
                    router.push('/login');
                    return;
                }
                resolve(res.data)
            }).catch(err => {
                if (err.code === 401) {
                    router.replace('/login');
                    return;
                }
                resolve({
                    data: {
                        code: -1,
                        msg: err.message || '请求失败'
                    }
                })
            })
        } catch (error) {
            resolve({
                data: {
                    code: -1,
                    msg: error.message || '请求失败'
                }
            })
        }
    })
}