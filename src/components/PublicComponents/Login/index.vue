<!--
 * @Author: gooing
 * @since: 2020-03-13 22:45:40
 * @lastTime: 2020-07-08 19:52:29
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\PublicComponents\Login\index.vue
 * @message:
 -->
<template>
  <div class="login">
    <el-dialog
      v-if="$store.getters.loginBoolean"
      :close-on-click-modal="false"
      title="Login"
      :visible="$store.getters.loginBoolean"
      width="600px"
      center
      @close="$store.dispatch('setLoginBoolean')"
    >
      <login-form v-show="loginType" @typeChange="typeChange" />
      <register-form v-show="!loginType" @typeChange="typeChange" />

    </el-dialog>
  </div>
</template>

<script>
import LoginForm from './Login';
import RegisterForm from './Register';

export default {
  name: 'Login',
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      loginType: true

    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    typeChange() {
      this.loginType = !this.loginType;
    }
  }
};
</script>

<style scoped lang="less">

.login{}
</style>

