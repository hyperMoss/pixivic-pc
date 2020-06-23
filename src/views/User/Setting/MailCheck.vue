<!--
 * @Author: Dongzy
 * @since: 2020-06-23 21:20:50
 * @lastTime: 2020-06-23 21:40:21
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\views\User\Setting\MailCheck.vue
 * @message:
-->
<template>
  <div />
</template>

<script>
export default {
  name: 'MailCheck',
  data() {
    return {

    };
  },
  mounted() { this.checkEmail(); },
  methods: {
    checkEmail() {
      const query = this.$route.query;
      delete query.VNK;
      this.$api.user.setEmail(query)
        .then(res => {
          alert(res.data.message);
          setTimeout(() => { window.location.href = '/'; }, 1000);
        });
    }
  },
};
</script>

