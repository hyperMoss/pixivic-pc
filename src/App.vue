<!--
 * @Author: gooing
 * @since: 2020-01-26 11:47:00
 * @lastTime: 2020-06-21 23:35:40
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\App.vue
 * @message:
 -->
<template>
  <div id="app">
    <el-container class="page-container" style="overflow: hidden;">
      <!-- 左边栏开始 -->
      <el-aside style="background-color: rgb(238, 241, 246)" width="65px">
        <left-side />
      </el-aside>
      <!-- 左边栏结束 -->
      <el-container style="overflow: hidden;">
        <!-- 标题栏开始 -->
        <el-header>
          <header-bar />
        </el-header>
        <!-- 标题栏结束 -->
        <!-- 主要页面开始 -->
        <el-main class="window-view">
          <vue-page-stack>
            <router-view :key="key" style="overflow-y: auto;max-height: calc(~'100vh - 60px');" />
          </vue-page-stack>
        </el-main>
        <!-- 主要页面结束 -->
      </el-container>
    </el-container>
    <Login />
    <CollectPicture />
  </div>
</template>

<script>
import HeaderBar from './components/PublicComponents/HeaderBar.vue';
import LeftSide from './components/PublicComponents/LeftSide.vue';
import cookie from 'js-cookie';
import Login from './components/PublicComponents/Login/index.vue';
import CollectPicture from './components/Collections/CollectPicture';

export default {
  name: 'App',
  components: {
    HeaderBar,
    LeftSide,
    Login,
    CollectPicture
  },
  data() {
    return {

    };
  },
  computed: {
    key() {
      return this.$route.fullPath;
    }
  },
  mounted() {
    if (!cookie.get('alert')) {
      this.$notify({
        title: this.$tc('news.title'),
        message: this.$tc('news.content')
      });

      cookie.set('alert', true, {
        expires: 365
      });
    }
    this.$i18n.locale = cookie.get('lang') || 'zh';
    this.$notify({
      title: this.$tc('wechatImg'),
      duration: 0,
      dangerouslyUseHTMLString: true,
      message: '<img src="https://cdn.jsdelivr.net/gh/OysterQAQ/Blog-Image/wechat.jpg" style="height:200px;width:200px;"/>'
    });
  }
};
</script>

<style lang="less">
#app {
  .page-container {
    /deep/ .el-main {
      padding: 0px;
    }
  }
}
.window-view {
  height: calc(~"100vh - 60px");
  width: calc(~"100vw - 65px");
  overflow: auto;
  background: #fff;
}
</style>
