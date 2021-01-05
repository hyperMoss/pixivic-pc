<template>
  <div class="QQauth">
    绑定中请等待
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import { mapGetters } from 'vuex';

export default {
  name: 'QQauth',
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {},
  mounted() {
    const qqAccessToken = this.$route.hash.split('=')[1].split('&')[0];
    const isLogin = Cookie.get('jwt');
    if (isLogin) {
      // 绑定qq
      this.$api.user.qqAccess({
        userId: this.user.id,
        qqAccessToken,
      })
        .then((res) => {
          if (res.status === 200) {
            this.$router.push('/');
          }
        });
    } else {
      // qq登录
      this.$api.user.qqLogin({ qqAccessToken })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('user', JSON.stringify(res.data.data));
            this.$store.dispatch('setUser', res.data.data);
            this.$router.push('/');
          } else {
            this.$message.info(res.data.message);
            this.$router.push('/');
          }
        });
    }
  },
  methods: {},
};
</script>

<style scoped lang="less">

.QQauth{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
