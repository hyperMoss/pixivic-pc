
<template>
  <div class="Remark">
    <el-card class="friend-card">
      <div slot="header">
        <span>友链</span>
      </div>
      <div v-for="e in friendLinkList" :key="e.href" class="card-item">
        <a class="text title" :href="e.href" target="_blank">{{ e.title }}</a>
        <span class="desc">{{ e.desc }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Remark',
  components: {},
  data() {
    return {
      friendLinkList: [
        {
          title: 'ACG漫音社',
          desc: '动漫无损音乐下载资讯站，专注分享二次元高品质音乐~',
          href: 'http://www.acgjc.com'
        },
        {
          title: 'ACG17宅',
          desc: '一个有趣的动漫小站~',
          href: 'http://acg17.com'
        },
        {
          title: 'Xinger1337s Home',
          desc: '搜刮各种二次元美图~',
          href: 'https://acg.blue'
        },
        {
          title: '果汁导航',
          desc: '一个简约优质实用的资源导航平台~',
          href: 'http://guozhivip.com'
        },
        {
          title: 'Animex动漫社',
          desc: '二次元及日本文化最速报~',
          href: 'http://www.animetox.com/'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="less">
.Remark {
  display: flex;
  justify-content: center;
  height: calc(~"100vh - 60px");
  align-items: center;
  .friend-card {
    width: 480px;
    .text {
      font-size: 14px;
    }
    .title {
      cursor: pointer;
      color: #409eff;
      text-decoration: none;
    }
    .desc {
      color: #adadad;
      font-size: 12px;
      margin-left: auto;
    }
    .card-item {
      margin-bottom: 18px;
      display: flex;
    }
  }
}
</style>
