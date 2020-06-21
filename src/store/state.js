/*
 * @Author: gooing
 * @since: 2020-02-02 14:59:46
 * @lastTime: 2020-06-01 21:12:14
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\store\state.js
 * @message:
 */
const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  cachedViews: [],
  showTab: false,
  likeStatus: null, // 点赞画作状态
  followStatus: null, // 画师关注状态
  detail: null, // 详情信息
  loginBoolean: false,
  collectBoolean: false,
  readyCollectItem: {},
  collectInfo: {}
};

export default state;
