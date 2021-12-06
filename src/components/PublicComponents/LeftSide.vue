<template>
  <div class="LeftSide">
    <el-menu
      class="menu"
      :collapse="isCollapse"
      :default-active="computerActiveNav"
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
      <el-menu-item @click.native="goBBS">
        <i class="el-icon-chat-round" />
        <span slot="title">{{ this.$t('Feedback') }}</span>
      </el-menu-item>
    </el-menu>
    <div>
      <a
        href=" "
        target="_blank"
        style="text-decoration:none;color:#0080FF;"
      >
        <div class="beian"><a href="https://beian.miit.gov.cn/"></a></div>
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
        (item) => item.routePath === this.$route.path,
      );
      if (index !== -1) {
        result = `${index}`;
      }
      return result;
    },
    navLsit() {
      return [
        {
          name: this.$t('Home'),
          icon: 'el-icon-s-home',
          routePath: '/',
        }/*,
        {
          name: this.$t('Notice'),
          icon: 'el-icon-document',
          routePath: '/note',
        }*//*,
        {
          name: this.$t('Donate'),
          icon: 'el-icon-coffee-cup',
          routePath: '/donate',
        }*/,
        {
          name: this.$t('Links'),
          icon: 'el-icon-link',
          routePath: '/remark',
        },
      ];
    },
  },
  watch: {},
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      this.$router.push({ path: key, query: {} });
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goBBS() {
      window.open('https://discuss.sharemoe.net/');
    },
  },
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
    margin: 0 auto;
    line-height: 24px;
    font-size: 12px;
    word-wrap: break-word; /*英文的时候需要加上这句，自动换行*/
    word-break: break-all;
  }
}
@media screen and (max-width:600px){
  .menu{
    display:flex;
    justify-content:space-between;
    width:100%;
    .li{
      padding-left: 0;
      width:100%;
    }

    /deep/ .el-menu-item{
      width:100%;
      text-align:center;
    }
  }
  .beian{
    display:none;
  }
}
</style>
