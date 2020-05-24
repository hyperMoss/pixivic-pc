<!--
 * @Author: gooing
 * @since: 2020-05-24 12:16:50
 * @lastTime: 2020-05-24 23:29:04
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\components\Collections\CreateCollect.vue
 * @message:
-->
<template>
  <div class="createCollect">
    <el-dialog
      :close-on-click-modal="false"
      :visible="showBoolean"
      title="新建画集"
      width="30%"
      @close="closeModal"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-position="left"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input v-model="ruleForm.title" />
        </el-form-item>
        <el-form-item
          label="简介"
          prop="caption"
        >
          <el-input
            v-model="ruleForm.caption"
            :maxlength="10"
          />
        </el-form-item>
        <el-form-item
          label="标签(最多4个)"
          prop="tagList"
        >
          <CreateTagList @emit-data="sendTagsLsit" />
        </el-form-item>
        <el-form-item
          label="是否公开"
        >
          <el-switch
            v-model="ruleForm.isPublic"
            active-color="#13ce66"
            :active-value="1"
            inactive-color="#ff4949"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          label="允许评论"
        >
          <el-switch
            v-model="ruleForm.forbidComment"
            active-color="#13ce66"
            :active-value="1"
            inactive-color="#ff4949"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          label="色情警告"
        >
          <el-switch
            v-model="ruleForm.pornWarning"
            active-color="#13ce66"
            :active-value="1"
            inactive-color="#ff4949"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div style="    justify-content: flex-end;display: flex;">
        <el-button
          :loading="loading"
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CreateTagList from './CreateTagList';
import { mapGetters } from 'vuex';
export default {
  name: 'StartCollect',
  components: { CreateTagList },
  props: ['show-boolean'],
  data() {
    // 邮箱验证函数
    var checkEmail = (rule, value, callback) => {
      const patrn = /[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
      if (!value) {
        return callback(new Error('标题不能为空'));
      }
      if (patrn.test(value)) {
        return callback(new Error('标题不能包含特殊字符'));
      }
      callback();
    };
    // 用户名验证函数
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('简介不能为空'));
      }
      callback();
    };
    // 用户名验证函数
    var checkTags = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error('标签不能为空'));
      }
      callback();
    };
    // 密码验证
    return {
      loading: false,
      // 表格数据
      ruleForm: {
        title: '',
        caption: '',
        isPublic: 0,
        forbidComment: 0,
        pornWarning: 0,
        tagList: []
      },
      // 验证规则
      rules: {
        title: [{ validator: checkEmail, trigger: 'blur' }],
        caption: [{ validator: checkName, trigger: 'blur' }],
        tagList: [{ validator: checkTags, trigger: 'blur' }]

      }
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {},
  mounted() {},
  methods: {
    // 为列表复制
    sendTagsLsit(list) {
      this.ruleForm.tagList = [...list];
    },
    // 关闭弹窗
    closeModal() {
      this.$emit('close-modal');
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createCollectAjax();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    createCollectAjax() {
      const params = Object.assign(this.ruleForm, { username: this.user.username });
      this.$api.collect
        .postCollection(params)
        .then(res => {
          if (res.status === 200) {
            this.$message({
              message: '新建画集成功',
              type: 'success'
            });
            this.closeModal();
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            });
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
.createCollect {
}
</style>
