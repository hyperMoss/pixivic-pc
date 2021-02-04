import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'home',
    // component: () => import('./views/DailyRank/DailyRank.vue')
    component: require('./views/DailyRank/DailyRank.vue').default,
  },
  {
    path: '/keywords',
    name: 'keywords',
    // component: () =>import('./views/SearchResult/SearchResult.vue'),
    component: require('./views/SearchResult/SearchResult.vue').default,
  },
  {
    path: '/illusts/:pid',
    name: 'Illusts',
    // component: () => import('./views/Detail/Detail.vue'),
    component: require('./views/Detail/Detail.vue').default,
    props: true,
  },
  {
    path: '/artist/:artistId',
    name: 'Artist',
    // component: () => import('./views/Artist/Artist.vue'),
    component: require('./views/Artist/Artist.vue').default,
    props: true,
  },
/*  {
    path: '/note',
    name: 'Note',
    // component: () => import('./views/Note/Note.vue')
    component: require('./views/Note/Note.vue').default,
  },*/
  {
    path: '/donate',
    name: 'Donate',
    // component: () => import('./views/Donate/Donate.vue')
    component: require('./views/Donate/Donate.vue').default,
  },
  {
    path: '/remark',
    name: 'Remark',
    // component: () => import('./views/Remark/Remark.vue')
    component: require('./views/Remark/Remark.vue').default,
  },
  {
    path: '/qqauth',
    name: 'QQauth',
    // component: () => import('./views/QQauth/QQauth.vue')
    component: require('./views/QQauth/QQauth.vue').default,
  },
  {
    path: '/oauth/authorize',
    name: 'Oauth',
    component: require('./views/Oauth/index.vue').default,
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: require('./views/ResetPassword/index.vue').default,
    meta: {
      title: '重置密码',
    },
  },
  ...require('./views/SpotLight').default, // A 业务路由入口
  ...require('./views/User').default, // A 业务路由入口
  ...require('./views/Collection/index').default, // A 业务路由入口
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

export default router;
