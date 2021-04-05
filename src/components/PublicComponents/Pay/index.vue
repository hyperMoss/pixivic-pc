<template>
  <div class="index">
    <el-dialog
        :visible.sync="localVisible"
        modal
        title="会员图片加速"
        width="500px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
      <div style="text-align: center">
        <div style="font-size: 1.6rem;font-weight: bold;margin-bottom: 20px">
          {{ isVip?'当前会员加速中🚀'
            :'当前还不是会员😥' }}
          <br>
          {{ isVip?`有效期到${dateFormat(user.permissionLevelExpireDate)}`:'' }}
        </div>
        <div style="margin: 20px 0px">
          <el-button
              plain
              @click="goPayNote"
          >
            购前须知
          </el-button>
        </div>
        <el-row>
          <el-button
              type="primary"
              size="small"
              @click="goAilPay"
          >
            淘宝
          </el-button> <el-button
            size="small"
            type="success"
            @click="goWeChatPay"
        >
          微信
        </el-button>
        </el-row>
        <el-input
            v-model="code"
            style="margin: 20px 0;width: 200px"
            label="输入激活码（可叠加）"
            placeholder="输入激活码（可叠加）"
        />
        <el-button
            :disabled="!code"
            @click="submitCode"
        >
          立即兑换
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'PayModal',
  props: {
    payVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      code: '',

    };
  },
  computed: {
    ...mapGetters(['isVip', 'user']),
    localVisible: {
      get() {
        return this.payVisible;
      },
      set() {},
    },
  },
  watch: {},
  mounted() {
    // 验证状态
    this.$api.user.getEmailIsCheck(this.user.id).then((res) => {
      this.isCheckEmail = res.data.data;
    });
  },

  methods: {
    // 日期
    dateFormat(val) {
      const time = new Date(val);
      const y = time.getFullYear();
      const m = time.getMonth() + 1;
      const d = time.getDate();
      return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
    },
    // 打开说明
    goPayNote() {
      window.open('https://discuss.sharemoe.net/d/10');
    },
    // 打开购买页面
    goAilPay() {
      window.open('https://shop126810115.taobao.com/');
    },
    goWeChatPay() {
      window.open('https://weidian.com/?userid=1676062924');
    },
    // 提交燃料
    submitCode() {
      this.$api.user.putPlusCode(this.user.id, this.code).then(
        (res) => {
          if (res.status === 200) {
            this.$message.closeAll();
            this.$message.success(res.data.message);
            this.$store.dispatch('setUser', res.data.data);
            this.$store.dispatch('vipProxyServer');
            window.location.reload();
            this.handleClose();
          } else {
            this.code = '';
            this.$message.closeAll();
            this.$message.info(res.data.message);
          }
        },
      );
    },
    // 处理窗口关闭
    handleClose() {
      this.$emit('update:payVisible', false);
    },
  },
};
</script>

<style scoped lang="less">

</style>
