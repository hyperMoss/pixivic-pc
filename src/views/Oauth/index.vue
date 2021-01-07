<template>
  <div />
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Oauth',
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    '$store.state.user.id': {
      handler(n, o) {
        if (n) {
          this.jump();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.user.id) {
      this.$store.dispatch('setLoginBoolean');
    }
  },
  methods: {
    async  jump() {
      this.$loading({
        lock: true,
        text: '登陆中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const oauthQuery = window.location.href.split('authorize')[1];
      const { headers: { location } } = await this.$api.user.oauth(oauthQuery);
      window.location.href = location;
    },
  },
};
</script>

<style scoped lang="less">

.QQauth{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
