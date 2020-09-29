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
