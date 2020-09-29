
<template>
  <div class="createCollect">
    <el-dialog
      :close-on-click-modal="false"
      :visible="showBoolean"
      :title="`${modifyFlag?'修改':'新建'}画集`"
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
          <CreateTagList :tag-list="ruleForm.tagList" @emit-data="sendTagsLsit" />
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
      <div slot="footer" style="    justify-content: flex-end;display: flex;">
        <el-button
          :loading="loading"
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
        <el-button
          type="text"
          @click="closeModal"
        >取消</el-button>
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
  props: ['show-boolean', 'collect-data'],
  data() {
    // 邮箱验证函数
    var checkTitle = (rule, value, callback) => {
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
      // if (!value.length) {
      //   return callback(new Error('标签不能为空'));
      // }
      callback();
    };
    // 密码验证
    return {
      modifyFlag: false,
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
      collectId: '',
      // 验证规则
      rules: {
        title: [{ validator: checkTitle, trigger: 'blur' }],
        caption: [{ validator: checkName, trigger: 'blur' }],
        tagList: [{ validator: checkTags, trigger: 'blur' }]

      }
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {},
  mounted() {
    if (this.collectData) {
      this.modifyFlag = true;
      const sourceData = Object.assign({}, this.collectData);
      this.ruleForm.title = sourceData.title;
      this.ruleForm.caption = sourceData.caption;
      this.ruleForm.isPublic = sourceData.isPublic;
      this.ruleForm.tagList = sourceData.tagList;
      this.ruleForm.forbidComment = sourceData.forbidComment;
      this.ruleForm.pornWarning = sourceData.pornWarning;
      this.collectId = sourceData.id;
    }
  },
  methods: {
    // 为列表复制
    sendTagsLsit(list) {
      this.ruleForm.tagList = [...list];
    },
    // 关闭弹窗
    closeModal() {
      this.$emit('on-cancel');
    },
    // 成功添加画集
    success(data, flag) {
      this.$emit('on-success', data, flag);
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.modifyFlag) {
            this.createCollectAjax();
          } else {
            this.modifyCollectAjax();
          }
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
            this.success(params, 1);
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            });
          }
        });
    },
    modifyCollectAjax() {
      const params = Object.assign(this.ruleForm, { username: this.user.username, id: this.collectId });
      this.$api.collect
        .putCollections(params)
        .then(res => {
          if (res.status === 200) {
            this.$message({
              message: '修改画集成功',
              type: 'success'
            });
            this.success(params, 2);
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
