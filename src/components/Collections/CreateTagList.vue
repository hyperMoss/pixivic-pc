
<template>
  <div class="CreateTagList">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag.tagName"
      :disable-transitions="false"
      closable
      @close="handleClose(tag)"
    >{{ tag.tagName }}</el-tag>
    <el-autocomplete
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      :debounce="300"
      :fetch-suggestions="querySearch"
      :maxlength="30"
      :trigger-on-focus="false"
      class="input-new-tag"
      placeholder="搜索标签"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @select="handleSelect"
    />
    <el-button
      v-else-if="dynamicTags.length<4"
      class="button-new-tag"
      size="small"
      @click="showInput"
    >+新标签</el-button>
  </div>
</template>

<script>
export default {
  name: 'CreateTagList',
  components: {},
  props: ['tag-list'],
  data() {
    return {
      keywords: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    };
  },
  computed: {},
  watch: {
    'dynamicTags': {
      handler: 'emitData'
    }
  },
  mounted() {
    this.dynamicTags = this.tagList;
  },
  methods: {
    // 删除
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.findIndex(e => e.tagName === tag.tagName), 1);
    },
    // 显示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 确认
    handleInputConfirm() {
      const item = { tagName: this.inputValue, id: '' };
      if (!this.inputValue.trim()) { return; }
      if (this.dynamicTags.findIndex(e => e.tagName.toLowerCase() === item.tagName.toLowerCase()) === -1) {
        this.dynamicTags.push(item);
      } else {
        this.$message({
          message: '请勿添加相同标签',
          type: 'warning'
        });
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 选中
    handleSelect(item) {
      if (this.dynamicTags.findIndex(e => e.tagName.toLowerCase() === item.tagName.toLowerCase()) === -1) {
        delete item.value;
        this.dynamicTags.push(item);
      } else {
        this.$message({
          message: '请勿添加相同标签',
          type: 'warning'
        });
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 获取关键词
    getKeywords() {
      this.$api.search
        .getKeyword(this.params.keyword)
        .then(({ data: { data }}) => {
          this.keywords = data.keywordList || [];
        });
    },
    // 搜索相关信息
    querySearch(queryString, cb) {
      this.$api.collect
        .collectionsTags(this.inputValue)
        .then(({ data }) => {
          if (data.data) {
            const result = data.data;
            result.forEach(e => {
              e.value = e.tagName;
            });
            cb(result);
          } else {
            cb([]);
          }
        });
    },
    emitData() {
      this.$emit('emit-data', this.dynamicTags);
    }
  }
};
</script>

<style scoped lang="less">
.CreateTagList {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
