/*
 * @Author: Dongzy
 * @since: 2020-06-17 23:05:08
 * @lastTime: 2020-06-18 20:28:29
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\VirtualList\tool.js
 * @message:
 */

// 滚动条在Y轴上的滚动距离
function getScrollTop() {
  let bodyScrollTop = 0;
  let documentScrollTop = 0;

  if (document.body) {
    // 视窗的纵向距离
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    // 文档流的纵向距离
    documentScrollTop = document.documentElement.scrollTop;
  }
  return bodyScrollTop - documentScrollTop > 0
    ? bodyScrollTop
    : documentScrollTop;
}
// 文档的总高度
function getScrollHeight() {
  return document.documentElement.scrollTop === 0
    ? document.body.scrollHeight
    : document.documentElement.scrollHeight;
}
// 浏览器视口的高度
function getWindowHeight() {
  return document.documentElement.scrollTop === 0
    ? document.body.clientHeight
    : document.documentElement.clientHeight;
}

export { getScrollTop, getScrollHeight, getWindowHeight, randomColor };
