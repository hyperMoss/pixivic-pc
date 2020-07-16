/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-07-14 20:55:43
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\api\base.js
 * @message:
 */
import axios from 'axios';
import cookie from 'js-cookie';
import i18n from '../i18n';
// 创建axios实例
const instance = axios.create({
  baseURL: 'https://api.pixivic.com',
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000,
  validateStatus(status) {
    return status >= 200 && status < 600;
  }
});

export function getLanguage() {
  const chooseLanguage = cookie.get('language');
  if (chooseLanguage) return chooseLanguage;
  const language = (navigator.language || navigator.browserLanguage).toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return 'zh';
}
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
      const message = i18n.tc('filter.loginError');
      alert(message);
      setTimeout(() => { window.location.href = '/'; }, 1000);
    }
    return response;
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default instance;
