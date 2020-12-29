
<template>
  <div class="LeftSide">
    <el-menu
      :collapse="isCollapse"
      :default-active="computerActiveNav"
      class="el-menu-vertical-demo"
      @close="handleClose"
      @select="handleOpen"
    >
      <el-menu-item
        v-for="item of navLsit"
        :key="item.name"
        :index="item.routePath"
      >
        <i :class="[item.icon]" />
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
    <div>
      <a
        href="http://beian.miit.gov.cn/"
        target="_blank"
        style="text-decoration:none;color:#0080FF;"
      >
        <div class="beian">桂ICP备17012945号-3</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftSide',
  components: {},
  data() {
    return {
      isCollapse: true,
    };
  },
  computed: {
    computerActiveNav() {
      let result = '0';
      const index = this.navLsit.indexOf(
        item => item.routePath === this.$route.path
      );
      if (index !== -1) {
        result = '' + index;
      }
      return result;
    },
    navLsit() {
      return [
        {
          name: this.$t('Home'),
          icon: 'el-icon-s-home',
          routePath: '/'
        },
        {
          name: this.$t('Notice'),
          icon: 'el-icon-document',
          routePath: '/note'
        },
        {
          name: this.$t('Feedback'),
          icon: 'el-icon-chat-round',
          routePath: '/bbs'
        },
        {
          name: this.$t('Donate'),
          icon: 'el-icon-coffee-cup',
          routePath: '/donate'
        },
        {
          name: this.$t('Links'),
          icon: 'el-icon-link',
          routePath: '/remark'
        }
      ];
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      this.$router.push({ path: key, query: {}});
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped lang="less">
.LeftSide {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  .beian {
    width: 15px;
    margin: 0 auto;
    line-height: 24px;
    font-size: 12px;
    word-wrap: break-word; /*英文的时候需要加上这句，自动换行*/
    word-break: break-all;
  }
}
</style>
