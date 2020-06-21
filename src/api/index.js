/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-05-23 21:14:38
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\api\index.js
 * @message:
 */
import * as rank from './modules/rank';
import * as detail from './modules/detail';
import * as search from './modules/search';
import * as user from './modules/user';
import * as comment from './modules/comment';
import * as spot from './modules/spot';
import * as collect from './modules/collect';
const api = {
  rank,
  search,
  detail,
  user,
  comment,
  spot,
  collect
};

export default api;
