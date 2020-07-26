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
      :visible="$store.getters.loginBoolean"
      width="600px"
      :title="`${loginOrSign?$t('login'):$t('signUp')}`"
      center
      @close="$store.dispatch('setLoginBoolean')"
    >
      <login-form v-show="loginOrSign" />
      <register-form v-show="!loginOrSign" />

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
  computed: {
    loginOrSign() {
      return this.$store.getters.loginOrSign;
    }
  }
};
</script>

