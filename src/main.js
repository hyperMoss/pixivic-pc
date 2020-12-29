
import Vue from 'vue';
import api from './api';
import App from './App.vue';
import router from './router.js';
import store from './store/';
import './styles/reset.less';
import './styles/public-style.less';
import VuePageStack from 'vue-page-stack';
import 'element-ui/lib/theme-chalk/index.css';
import { replaceBigImg, replaceSmallImg } from '@/util';
import i18n from './i18n';
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(VuePageStack, { router, keyName: 'VNK' });
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  try {
    if (isChunkLoadFailed) {
      const LoadingChunk = window.sessionStorage.getItem('LoadingChunk');
      if (LoadingChunk) {
        window.sessionStorage.setItem('LoadingChunk', LoadingChunk - 0 + 1);
      } else {
        window.sessionStorage.setItem('LoadingChunk', 1);
      }
      if (LoadingChunk - 0 > 1) {
        // 防止 死循环
        return false;
      }
      router.replace(targetPath);
      window.sessionStorage.setItem('LoadingChunkPath', targetPath);
      const sa = window.sa;
      if (sa && sa.track) {
        sa.track('element_click', {
          page_title: 'LoadingChunk',
          element_type: 'view',
          page_source: targetPath, // 当前路由
          element_name: `刷新页面${LoadingChunk - 0}次` // 尝试 打开次数
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
router.onReady(vm => {
  try {
    const LoadingChunkPath = window.sessionStorage.getItem('LoadingChunkPath');
    const path = vm.path;
    if (LoadingChunkPath) {
      if (path !== LoadingChunkPath && path !== '/') {
        window.sessionStorage.setItem('LoadingChunkPath', vm.path);
        router.replace(vm.path);
      } else {
        router.replace(LoadingChunkPath);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
Vue.filter('dateFormat', val => {
  const time = new Date(val);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
});
Vue.filter('replaceBig', val => replaceBigImg(val));
Vue.filter('replaceSmall', val => replaceSmallImg(val));
Vue.filter('replaceAvatar', val => `${process.env.VUE_APP_STATIC_API}${val}.jpg`);
Vue.filter(
  'replaceSquare',
  val =>
    'https://img.pixivic.net/c/360x360_70/img-master' +
    val.split('img-master')[1]
);

Vue.prototype.$api = api;
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
