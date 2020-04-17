/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-04-17 22:19:55
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
const api = {
  rank,
  search,
  detail,
  user,
  comment,
  spot
};

export default api;
