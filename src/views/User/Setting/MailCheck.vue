
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

