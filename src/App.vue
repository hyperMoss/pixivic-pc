<!--
 * @Author: gooing
 * @since: 2020-01-26 11:47:00
 * @lastTime: 2020-04-29 00:46:45
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\App.vue
 * @message:
 -->
<template>
  <div id="app">
    <el-container class="page-container">
      <!-- 左边栏开始 -->
      <el-aside style="background-color: rgb(238, 241, 246)" width="65px">
        <left-side />
      </el-aside>
      <!-- 左边栏结束 -->
      <el-container>
        <!-- 标题栏开始 -->
        <el-header>
          <header-bar />
        </el-header>
        <!-- 标题栏结束 -->
        <!-- 主要页面开始 -->
        <el-main class="window-view">
          <vue-page-stack>
            <router-view :key="key" />
          </vue-page-stack>
        </el-main>
        <!-- 主要页面结束 -->
      </el-container>
    </el-container>
    <Login />
  </div>
</template>

<script>
import HeaderBar from './components/PublicComponents/HeaderBar.vue';
import LeftSide from './components/PublicComponents/LeftSide.vue';
import cookie from 'js-cookie';
import Login from './components/PublicComponents/Login/index.vue';

export default {
  name: 'App',
  components: {
    HeaderBar,
    LeftSide,
    Login
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
        title: '消息',
        message: '画师搜索现在可用'
      });
      cookie.set('alert', true, {
        expires: 365
      });
    }
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
  min-height: calc(~"100vh - 60px");
  width: calc(~"100vw - 65px");
  overflow: auto;
  background: #fff;
}
</style>
