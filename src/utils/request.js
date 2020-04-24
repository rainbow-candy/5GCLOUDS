import axios from 'axios';
import { stringify } from 'qs';

import errorMessage from './error-handler';
import { userAuth, App } from '@/utils/auth';
import URL from '../config/rest-url';

// 取消请求
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const cancelCode = 'REQUEST_CANCEL';
const requestNoToken = Object.values(URL.login);

/**
 * 创建 axios 服务实例
 * @description
 * 该方法所需的参数如下：
 * @param {String} url 请求的 url，默认配置了一级路径，只需二级路径，例如：/login
 * @param {String} method 请求方式 `get/post`
 * @param {Object} data post 请求的参数
 * @param {Object} params get 请求的参数
 */
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 20000,
  cancelToken: source.token
});

export default service;

// 请求拦截
service.interceptors.request.use(
  (config) => {
    const userInfo = userAuth.getToken();

    if (!requestNoToken.includes(config.url)) {
      const AppInfo = App.getToken();

      if (AppInfo) {
        config.headers.token = AppInfo.token;
      } else {
        source.cancel(cancelCode);
      }
    }
    // 增加 regionCode 参数
    if (userInfo) {
      const params = (config.params = config.params || {});
      params.regionCode = params.areaCode = userInfo.areaCode;
    }
    // post 参数转换为 FormData 形式
    const headers = config.headers;
    if (config.method === 'post' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
      config.data = stringify(config.data);
    }

    return config;
  },
  (error) => {
    errorMessage(error || 'response error.');
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (!data || data.success === false) {
      if (data.tokenInvalid) {
        errorMessage('登陆已过期，请重新登陆', true);
        App.clear();
        userAuth.clear();
        this.$router.push('/home')
      } else {
        errorMessage(data.message || '请求数据为空', true);
      }
    }
    return data;
  },
  (error) => {
    errorMessage(error || 'response error.');
    return Promise.reject(error);
  }
);
