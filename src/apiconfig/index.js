/* eslint-disable */
import axios from 'axios';
import { stringify } from 'qs';
/**
* 定义请求常量
* TIME_OUT、ERR_OK
*/
export const TIME_OUT = 10000;    // 请求超时时间
export const ERR_OK = true;      // 请求成功返回状态，字段和后台统一
export const baseUrl = 'http://112.74.103.26/api/'
// export const baseUrl = 'http://192.168.1.52:8888/api/'
// 请求超时时间
axios.defaults.timeout = TIME_OUT
axios.defaults.headers['authorization'] = window.sessionStorage.getItem('token');

// 封装请求拦截
axios.interceptors.request.use(
    config => {
      const headers = config.headers;
      if (config.method === 'post' || config.method === 'put' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        config.data = stringify(config.data);
      }
      return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 封装响应拦截，判断token是否过期
axios.interceptors.response.use(
  response => {
    const data = response;
    return data;
  },
  error => {
    return Promise.reject(error)
  }
)
// 封装post请求
export function fetch(requestUrl,method, params = '') {
  if(method === 'post'){
    return axios({
      url: baseUrl + requestUrl,
      method: method,
      data:params
    })
  } else if(method === 'put'){
    return axios({
      url: baseUrl + requestUrl,
      method: method,
      data:params
    })
  } else if(method === 'get'){
    return axios({
      url: baseUrl + requestUrl,
      method: method,
      params:params
    })
  } else if(method === 'delete'){
    return axios({
      url: baseUrl + requestUrl,
      method: method,
      params:params
    })
  }
}
