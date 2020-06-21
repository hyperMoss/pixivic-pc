/*
 * @Author: gooing
 * @since: 2020-03-23 23:14:54
 * @lastTime: 2020-06-07 23:37:24
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\User\index.js
 * @message:
 */
import BookMarked from './BookMarked/index.vue';
import Followed from './Followed/index.vue';
import HomePage from './HomePage/index.vue';

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
    path: '/users/home-page/:userId',
    name: 'HomePage',
    component: HomePage,
    props: true
  }
];
