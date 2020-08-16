
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
