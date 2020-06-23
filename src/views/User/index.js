/*
 * @Author: gooing
 * @since: 2020-03-23 23:14:54
 * @lastTime: 2020-06-23 21:41:08
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\views\User\index.js
 * @message:
 */
import BookMarked from './BookMarked/index.vue';
import Followed from './Followed/index.vue';
import HomePage from './HomePage/index.vue';
import MailCheck from './Setting/MailCheck.vue';

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
  },
  {
    path: '/emailCheck',
    name: 'MailCheck',
    component: MailCheck,
  }
];
