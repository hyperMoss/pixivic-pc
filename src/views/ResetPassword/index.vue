
<template>
  <div class="index">
    <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm" label-position="left">
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" :maxlength="20" show-password type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" :maxlength="20" show-password type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button @click="submitResetForm">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  components: {},
  data() {
    // 密码验证
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        if (value.length < 8) {
          callback(new Error('密码应为8-20位'));
        }
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 表格数据
      ruleForm: {
        password: '',
        checkPass: '',
      },
      // 验证规则
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 提交重置密码表单
    submitResetForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.resetPasswordAjax();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // AJAX

    // 重置密码
    resetPasswordAjax() {
      let data = this.$route.query;
      delete data.VNK;
      data = { ...data, password: this.ruleForm.password };
      this.$api.user.resetPassword(data)
        .then(res => {
          if (res.status === 200) {
            this.$message.info('重置成功，等待返回首页');
            window.location.href = 'https://pixivic.com/';
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  },
};
</script>

<style scoped lang="less">
.index{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

