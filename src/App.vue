<template>
  <div id="app">
    <div
      class="app-container"
      style="overflow: hidden;"
    >
      <!-- 边栏开始 -->
      <div class="page-bar">
        <left-side />
      </div>
      <div class="page-container">
        <header-bar />
        <div class="window-view">
          <vue-page-stack>
            <router-view
              :key="key"
              style="max-height: calc(~'100vh - 60px');"
            />
          </vue-page-stack>
        </div>
      </div>
    </div>
    <Login />
    <CollectPicture />
    <CheckPhone />
  </div>
</template>

<script>
import cookie from 'js-cookie';
import { mapGetters } from 'vuex';
import CheckPhone from 'components/CheckPhone';
import HeaderBar from './components/PublicComponents/HeaderBar.vue';
import LeftSide from './components/PublicComponents/LeftSide.vue';
import Login from './components/PublicComponents/Login/index.vue';
import CollectPicture from './components/Collections/CollectPicture';

function checkWebpFeature(feature, callback) {
  const kTestImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
  };
  const img = new Image();
  img.onload = function () {
    const result = (img.width > 0) && (img.height > 0);
    callback(feature, result);
  };
  img.onerror = function () {
    callback(feature, false);
  };
  img.src = `data:image/webp;base64,${kTestImages[feature]}`;
}

export default {
  name: 'App',
  components: {
    HeaderBar,
    LeftSide,
    Login,
    CollectPicture,
    CheckPhone,
  },
  data() {
    return {

    };
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
    ...mapGetters(['user']),
  },
  mounted() {
    if (!cookie.get('alert')) {
      this.$notify({
        title: this.$tc('wechatImg'),
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<img src="" style="height:200px;width:200px;"/>',
      });
      cookie.set('alert', true, {
        expires: 365,
      });
    }
    this.$i18n.locale = cookie.get('lang') || 'zh';
    checkWebpFeature('lossless', (f, e) => {
      sessionStorage.setItem('supportWebp', e);
    });
    this.getUsersInfo();
  },

  methods: {
    async getUsersInfo() {
      if (!this.user.id) { return; }
      const res = await this.$api.user.getUsers(this.user.id);
      this.$store.dispatch('setUser', res.data.data);
      // this.getProxyList(data);
    },
  },

};
</script>

<style lang="less">
#app {
  .app-container {
    display:flex;
  }
  .window-view {
    overflow: auto;
    background: #fff;
  }
  .page-bar{
    width:65px;
    background-color: rgb(238, 241, 246)
  }
  @media screen and (max-width:600px){
    .app-container  {
      flex-direction: column-reverse;
    }
    .page-bar{
      width:100%;
      position: absolute;
      z-index: 10;
      height: 60px;
    }
  }
  .page-container{
    overflow: hidden;
    flex: 1;
  }
}
</style>
