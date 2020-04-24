// rest请求配置
const GLOBAL = 'http://192.168.1.44:8888/api/';

export default {
  login: {
    token: GLOBAL + 'checkTokenByAppKey', // 获取token
    login: GLOBAL + 'user/login', // 登录
    logout: GLOBAL + 'user/logout' // 登出
  }
};
