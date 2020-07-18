/*
 * @Author: Dongzy
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-06-21 11:58:37
 * @LastAuthor: Dongzy
 * @文件相对于项目的路径: \pixiciv-pc\src\api\modules\rank.js
 * @message:
 */
import axios from '../base';

function getRank(params) {
  return axios({
    url: `/ranks`,
    method: 'get',
    params: { ...params, pageSize: 30 }
  });
}

export { getRank };
