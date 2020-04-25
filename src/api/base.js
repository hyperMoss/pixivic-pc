/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-04-25 16:27:00
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\api\base.js
 * @message:
 */
import axios from 'axios';
import cookie from 'js-cookie';

// 创建axios实例
const instance = axios.create({
  baseURL: 'https://api.pixivic.com',
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000,
  validateStatus(status) {
    return status >= 200 && status < 600;
  }
});

instance.interceptors.request.use(
  config => {
    if (cookie.get('jwt')) {
      config.headers.authorization = cookie.get('jwt');
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    // console.log('response', response);
    if (response.headers.hasOwnProperty('authorization')) {
      cookie.set('jwt', response.headers.authorization, {
        expires: 365
      });
    }
    if (response.status === 401) {
      // 登录过期
      cookie.remove('jwt');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return response;
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default instance;
