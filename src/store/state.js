const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  cachedViews: [],
  showTab: false,
  likeStatus: null, // 点赞画作状态
  followStatus: null, // 画师关注状态
  detail: null, // 详情信息
  loginBoolean: false,
  loginOrSign: true,
  collectBoolean: false,
  readyCollectItem: {},
  collectInfo: {},
  serverAddress: localStorage.getItem('serverAddress') || null,
  phoneBoolean: false,
};

export default state;
