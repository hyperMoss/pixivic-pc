
<template>
  <div class="Donate">
    <div class="code">
      <div @click="goMall">
        点我购买燃料
      </div>
      <el-input
        v-model="code"
        placeholder="请输入燃料"
      />
      <el-button @click="submitCode">
        自然选择，前进四
      </el-button>
    </div>
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
import {mapGetters} from 'vuex'
export default {
  name: 'Donate',
  components: {},
  data() {
    return {code:''};
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {},
  mounted() {},
  methods: {
    //打开购买页面
    goMall(){
      window.open('https://mall.pixivic.net/product/')
    },
    // 提交燃料
    submitCode(){
      if(!this.user.id||this.code.trim()){
        this.$message.closeAll();
        this.$message.warning('请输入有效的燃料');
      }
      this.$api.user.putPlusCode(this.user.id,this.code).then(
        res=>{
          if(res.status===200){
            this.$message.closeAll();
            this.$message.success(res.data.message);
            this.$api.user.getUsers(this.user.id).then(
              res=>{
                if(res.status===200){
                  localStorage.setItem('user', JSON.stringify(res.data.data));
                  this.$store.dispatch('setUser', res.data.data);
                }else {
                  this.$message.closeAll();
                  this.$message.info('请重新登录刷新用户数据');
                }
              }
            )
          }else {
            this.$message.closeAll();
            this.$message.info(res.data.message);
          }
        }
      )
    }
  }
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
