<template>
  <div />
</template>

<script>

export default {
  name: 'Oauth',
  components: {},
  data() {
    return {};
  },
  computed: {
  },
  watch: {},
  async mounted() {
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
  methods: {
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
