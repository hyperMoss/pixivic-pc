<template>
  <div class="register">
    <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
    >
      <el-form-item
          :label="$t('email')"
          prop="email"
      >
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item
          :label="$t('username')"
          prop="username"
      >
        <el-input
            v-model="ruleForm.username"
            :maxlength="10"
        />
      </el-form-item>
      <el-form-item
          :label="$t('password')"
          prop="password"
      >
        <el-input
            v-model="ruleForm.password"
            :maxlength="20"
            show-password
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item
          :label="$t('checkPassword')"
          prop="checkPass"
      >
        <el-input
            v-model="ruleForm.checkPass"
            :maxlength="20"
            show-password
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item
          :label="$t('verifyCode')"
          prop="verifyCode"
      >
        <el-row
            type="flex"
            justify="space-between"
            :gutter="16"
        >
          <el-col>
            <el-input
                v-model="ruleForm.verifyCode"
                :maxlength="4"
            >
              <template slot="append">
                <img
                    style="width:100px"
                    :src="`data:image/bmp;base64,${imageBase64}`"
                    @click.stop="getCode"
                >
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
          :label="$t('phone')"
          prop="phone"
      >
        <el-row
            type="flex"
            justify="space-between"
            :gutter="16"
        >
          <el-col>
            <el-input
                v-model="ruleForm.phone"
                placeholder="手机号"
                :maxlength="11"
            >
              <template slot="append">
                <el-button
                    :disabled="isOvertime"
                    type="primary"
                    :loading="loading"
                    @click="getPhoneCode"
                >
                  {{ word }}
                </el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
          :label="$t('getPhoneCode')"
          prop="phoneCode"
      >
        <el-row
            type="flex"
            justify="space-between"
            :gutter="16"
        >
          <el-col>
            <el-input
                v-model="ruleForm.phoneCode"
                placeholder="短信验证码(需手机获取)"
                :maxlength="6"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
          :label="$t('inviteCode')"
          prop="inviteCode"
      >
        <el-row
            type="flex"
            justify="space-between"
            :gutter="16"
        >
          <el-col>
            <el-input
                v-model="ruleForm.inviteCode"
            >
              <template slot="append">
                <el-link
                    type="primary"
                    href="https://weidian.com/item.html?itemID=4335762096"
                    target="_blank"
                >
                  <!--                  {{ $t('get') }}-->微店获取
                </el-link>
                &nbsp;&nbsp;

                <el-link
                    type="primary"
                    href="https://item.taobao.com/item.htm?id=644850272586"
                    target="_blank"
                >
                  <!--                  {{ $t('get') }}-->淘宝获取
                </el-link>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <div style="display: flex;justify-content: center">
        <el-button
            type="primary"
            :loading="loading"
            @click="submitForm('ruleForm')"
        >
          {{ $t('registered') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  username: 'Register',
  components: {},
  data() {
    // 邮箱验证函数
    const checkEmail = (rule, value, callback) => {
      const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (!value) {
        return callback(new Error('邮箱不能为空'));
      }
      if (!pattern.test(value)) {
        return callback(new Error('邮箱格式错误'));
      }
      this.$api.user.checkEmail(value)
          .then((res) => {
            if (res.status !== 200) {
              callback(new Error('邮箱已被注册'));
            }
          });
      callback();
    };
    // 用户名验证函数
    const checkName = (rule, value, callback) => {
      const patrn = /[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }
      if (patrn.test(value)) {
        return callback(new Error('用户名不能包含特殊字符'));
      }
      if (value.length < 4) {
        return callback(new Error('用户名应为4-10位'));
      }
      this.$api.user.checkUser(value)
          .then((res) => {
            if (res.status !== 200) {
              callback(new Error('此用户名已被注册'));
            } else {
              callback();
            }
          });
    };
    // 密码验证
    const validatePass = (rule, value, callback) => {
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
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const checkCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'));
      } else {
        callback();
      }
    };
    const checkInviteCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入食用码'));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      const patrn = /^[1]([3-9])[0-9]{9}$/;
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (value.length !== 11 || !patrn.test(value)) {
        callback(new Error('请输入合法手机号'));
      } else {
        this.$api.user.checkPhone(value)
            .then((res) => {
              if (res.status !== 200) {
                callback(new Error('此手机号不可用'));
              } else {
                callback();
              }
            });
      }
    };
    return {
      word: '发送验证码',
      isOvertime: false,
      // 验证码数据
      imageBase64: null,
      // 登录加载
      loading: false,
      vid: '',
      // 表格数据
      ruleForm: {
        password: '',
        checkPass: '',
        email: '',
        username: '',
        verifyCode: '',
        phoneCode: '',
        inviteCode: '',
        phone: '',
      },
      // 验证规则
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' },
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' },
        ],
        username: [
          { validator: checkName, trigger: 'blur' },
        ],
        verifyCode: [
          { validator: checkCode, trigger: 'blur' },
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' },
        ],
        inviteCode: [
          { validator: checkInviteCode, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCode();
  },
  methods: {
    // 获取验证码
    getCode() {
      this.$api.user.verificationCode()
          .then((res) => {
            const { data: { data } } = res;
            this.imageBase64 = data.imageBase64;
            this.vid = data.vid;
          });
    },
    // 获取手机验证码
    getPhoneCode() {
      if (!this.ruleForm.verifyCode) {
        this.$refs.ruleForm.validateField('verifyCode');
        return;
      }
      const getMessage = (v) => {
        if (v) { return; }
        this.$api.user.getPhoneCode({
          vid: this.vid,
          value: this.ruleForm.verifyCode,
          phone: this.ruleForm.phone,
        })
            .then((res) => {
              if (res.status !== 200) {
                this.$message.error(res.data.message);
              }
              this.$message.success(res.data.message);
              let time = 60;
              const sendTimer = setInterval(() => {
                this.isOvertime = true;
                time -= 1;
                this.word = `重新发送${time}`;
                if (time < 0) {
                  this.isOvertime = false;
                  clearInterval(sendTimer);
                  this.word = '获取验证码';
                }
              }, 1000);
            });
      };
      this.$refs.ruleForm.validateField('phone', getMessage);
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register();
          return true;
        }
        return false;
      });
    },
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 注册
    register() {
      this.$confirm('请仔细确认信息，确认无误后按确定完成注册', '确认信息', {
        distinguishCancelAndClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '放弃',
      })
          .then(() => {
            const reqBody = {
              userInfo: {
                username: this.ruleForm.username.trim(),
                email: this.ruleForm.email,
                password: this.ruleForm.password,
                exchangeCode: this.ruleForm.inviteCode,
              },
              vid: this.ruleForm.phone,
              value: this.ruleForm.phoneCode,
            };
            this.$api.user.register(reqBody)
                .then((res) => {
                  if (res.status === 200) {
                    this.$store.dispatch('setUser', res.data.data);
                    this.$store.dispatch('setLoginBoolean');
                    this.$message.success(res.data.message);
                  } else {
                    this.$message.closeAll();
                    this.$message.warning(res.data.message);
                    this.ruleForm.phoneCode='';
                    this.ruleForm.verifyCode='';
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            this.loading = false;
            this.getCode();
          }).catch(() => {

      });
    },
  },
};
</script>

<style scoped lang="less">

.register{}
</style>
