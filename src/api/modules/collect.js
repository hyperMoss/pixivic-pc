/*
 * @Author: gooing
 * @since: 2020-05-21 23:08:15
 * @lastTime: 2020-05-26 00:26:00
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\api\modules\collect.js
 * @message:
 */
import axios from "../base";

// 发起画集
function postCollection(params) {
  const {
    username = 0,
    title = 0,
    caption,
    tagList = [],
    isPublic,
    forbidComment,
    pornWarning
  } = params;
  return axios({
    url: `/collections`,
    method: "post",
    data: {
      username,
      title,
      caption,
      tagList,
      isPublic,
      forbidComment,
      pornWarning
    }
  });
}

// 更新画集
function putCollections(params) {
  const {
    id,
    username = 0,
    title = 0,
    caption,
    tagList = [],
    isPublic,
    forbidComment,
    pornWarning
  } = params;
  return axios({
    url: `/collections/${params.id}`,
    method: "put",
    data: {
      id,
      username,
      title,
      caption,
      tagList,
      isPublic,
      forbidComment,
      pornWarning
    }
  });
}

// 删除画集
function deleteCollections(collectionId) {
  return axios({
    url: `/collections/${collectionId}`,
    method: "delete"
  });
}

// 添加画作至指定画集
function postCollectionsIllust(params) {
  const { collectionId = 0, illust_id = 0 } = params;
  return axios({
    url: `/collections/${collectionId}/illustrations`,
    method: "post",
    data: {
      illust_id
    }
  });
}
// 画集删除画作
function deleteCollectionsIllust(params) {
  const { collectionId = 0, illustId = 0 } = params;
  return axios({
    url: `/collections/${collectionId}/illustrations/${illustId}`,
    method: "delete"
  });
}

// 画集内排序
function orderCollections(params) {
  const {
    collectionId = 0,
    upIllustrationId = 0,
    lowIllustrationId,
    reOrderIllustrationId
  } = params;
  return axios({
    url: `/collections/${collectionId}/illustrations/order`,
    method: "put",
    data: {
      upIllustrationId,
      lowIllustrationId,
      reOrderIllustrationId
    }
  });
}

// 查看用户画集
function getUserCollections(params) {
  const { userId = 0, page, pageSize, isPublic } = params;
  return axios({
    url: `/users/${userId}/collections`,
    method: "get",
    params: {
      page: page,
      pageSize: pageSize || 30,
      isPublic
    }
  });
}
// 查看画集
function getCollections(params) {
  const { collectoinId = 0, page, pageSize, isPublic } = params;
  return axios({
    url: `/collections/${collectoinId}/illustrations`,
    method: "get",
    params: {
      page: page,
      pageSize: pageSize || 30
    }
  });
}
// 获取最新公开画集
function latestCollections(params) {
  const { page, pageSize } = params;
  return axios({
    url: `/collections/latest`,
    method: "get",
    params: {
      page: page,
      pageSize: pageSize || 30
    }
  });
}

// 获取最热门画集
function popCollections(params) {
  const { page, pageSize } = params;
  return axios({
    url: `/collections/pop`,
    method: "get",
    params: {
      page: page,
      pageSize: pageSize || 30
    }
  });
}
// 标签补全
function collectionsTags(keyword) {
  return axios({
    url: `/collections/tags`,
    method: "get",
    params: {
      keyword: keyword
    }
  });
}

export {
  postCollection,
  putCollections,
  deleteCollections,
  postCollectionsIllust,
  deleteCollectionsIllust,
  orderCollections,
  getUserCollections,
  getCollections,
  latestCollections,
  popCollections,
  collectionsTags
};
