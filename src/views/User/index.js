/*
 * @Author: gooing
 * @since: 2020-03-23 23:14:54
 * @lastTime: 2020-05-23 22:07:34
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\User\index.js
 * @message:
 */
import BookMarked from './BookMarked/index.vue';
import Followed from './Followed/index.vue';
import HomePage from './HomePage/index.vue';
import Collect from './Collection/index.vue'

export default [
  {
    path: '/users/bookmarked',
    name: 'BookMarked',
    component: BookMarked
  },
  {
    path: '/users/followed',
    name: 'Followed',
    component: Followed
  },
  {
    path: '/users/home-page',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/users/collect',
    name: 'Collect',
    component: Collect
  }
];
