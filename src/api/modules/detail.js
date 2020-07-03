/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-03-29 21:02:14
 * @LastAuthor: gooing
 * @文件相对于项目的路径: \pixiciv-pc\src\api\modules\detail.js
 * @message:
 */
import axios from '../base';

function getPixById(id) {
  return axios({
    url: `/illusts/${id}`,
    method: 'get'
  });
}

function reqArtistIllust(params) {
  return axios({
    url: `/artists/${params.artistId}/illusts/${params.type}`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 30,
      maxSanityLevel: 4
    }
  });
}

function reqIllustDetail(pid) {
  return axios({
    url: `/illusts/${pid}`,
    method: 'get'
  });
}

function reqArtist(artistId) {
  return axios({
    url: `/artists/${artistId}`,
    method: 'get'
  });
}

// 获取关联画作
function reqRelatedIllust(param) {
  return axios({
    url: `/illusts/${param.illustId}/related`,
    method: 'get',
    params: {
      page: param.page,
      pageSize: param.pageSize || 30
    }
  });
}

// 获取画师画作汇总
function reqSummary(artistId) {
  return axios({
    url: `/artists/${artistId}/summary`,
    method: 'get'
  });
}

// 查看画作收藏用户列表
function bookmarkedUsers(params) {
  return axios({
    url: `/illusts/${params.illustId}/bookmarkedUsers`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 30
    }
  });
}

// 新增用户查看画作历史记录
function illustHistory(data) {
  return axios({
    url: `/users/${data.userId}/illustHistory`,
    method: 'post',
    data
  });
}

export { getPixById, reqArtistIllust, reqIllustDetail, reqArtist, reqRelatedIllust, reqSummary, bookmarkedUsers, illustHistory };

