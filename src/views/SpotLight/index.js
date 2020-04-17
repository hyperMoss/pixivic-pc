/*
 * @Author: gooing
 * @since: 2020-03-22 16:59:02
 * @lastTime: 2020-04-17 23:25:13
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\SpotLight\index.js
 * @message:
 */
import index from './SpotLightIndex/index.vue';
import info from './SpotLightIndex/InfoPage.vue';
export default [
  {
    path: '/spot-light/index',
    name: 'spot-light-index',
    component: index
  },
  {
    path: '/spot-light/info-page/',
    name: 'spot-light-info',
    component: info
  }
];
