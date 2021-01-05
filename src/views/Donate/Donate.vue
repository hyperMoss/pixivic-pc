<template>
  <div class="Donate">
    <div class="donate-card-warp">
      <el-card class="donate-card">
        <div slot="header">
          <span>支付宝</span>
        </div>
        <img
          alt="支付宝"
          src="@/assets/images/alipay.jpg"
        >
      </el-card>
      <el-card class="donate-card">
        <div slot="header">
          <span>微信</span>
        </div>
        <img
          alt="微信"
          src="@/assets/images/wechat.jpg"
        >
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Donate',
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {},
  mounted() {},
  methods: {

  },
};
</script>

<style scoped lang="less">
.Donate {
    height: calc(~"100vh - 60px");
  .code{
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
  .donate-card-warp{
    display: flex;
    align-items: center;
    .donate-card {
      height: 300px;
      width: 200px;
      margin: 80px auto;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
