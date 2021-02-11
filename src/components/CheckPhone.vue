<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="100px"
    class="demo-ruleForm"
    label-position="left"
  >
    <el-dialog
      v-if="$store.getters.phoneBoolean"
      :close-on-click-modal="false"
      :visible="$store.getters.phoneBoolean"
      width="600px"
      title="绑定手机号"
      center
      @close="$store.dispatch('setPhoneBoolean')"
    >
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
      <div style="display: flex;justify-content: center">
        <el-button @click="$store.dispatch('setPhoneBoolean')">
          {{ $t('cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm('ruleForm')"
        >
          {{ $t('ok') }}
        </el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'CheckPhone',
  components: {
  },
  data() {
    const checkCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'));
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
      // 验证规则
      rules: {
        verifyCode: [
          { validator: checkCode, trigger: 'blur' },
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
      loading: false,
      dialogVisible: false,
      ruleForm: {
        verifyCode: '',
        phoneCode: '',
        phone: '',
      },
      isOvertime: false,
      word: '发送验证码', // 验证码数据
      imageBase64: null,
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.getCode();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkPhone();
          return true;
        }
        return false;
      });
    },
    // 获取验证码
    getCode() {
      this.$api.user.verificationCode()
        .then((res) => {
          const { data: { data } } = res;
          this.imageBase64 = data.imageBase64;
          this.vid = data.vid;
        });
    },
    checkPhone() {
      this.$api.user.verifyPhoneCode({
        vid: this.ruleForm.phone,
        value: this.ruleForm.phoneCode,
        userId: this.user.id,
      })
        .then((res) => {
          if (res.status === 200) {
            this.$store.dispatch('setUser', res.data.data);
            this.$store.dispatch('setPhoneBoolean');
          }
          this.$message.info(res.data.message);
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
  },
};
</script>
