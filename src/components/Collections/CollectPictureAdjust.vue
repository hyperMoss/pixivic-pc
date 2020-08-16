
<template>
  <div class="CollectPictureAdjust">
    <el-dialog
      :close-on-click-modal="false"
      :visible="showBoolean"
      title="编辑画集内容"
      width="400px"
      @close="closeModal"
    >
      <div class="md-body">
        <draggable v-model="localPictureList" class="dragable-box">
          <transition-group>
            <div v-for="item in localPictureList" :key="item.id">
              <div class="item-line">
                <div class="item-info">
                  <el-image
                    :src="item.imageUrls[0].medium | replaceSmall"
                    fit="cover"
                    style="height: 40px; width: 40px;"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                    <div slot="placeholder" class="image-slot">
                      <span class="dot">...</span>
                    </div>
                  </el-image>
                  <div class="pic-name">{{ item.title }}</div>
                </div>
                <el-popconfirm
                  title="确定将该画作移出画集吗？"
                  @onConfirm="removePicture(item)"
                >
                  <i slot="reference" class="action-icon el-icon-delete" />
                </el-popconfirm>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>

      <div slot="footer" style="    justify-content: flex-end;display: flex;">
        <el-button type="text" @click="closeModal">取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="submit"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'CollectPictureAdjust',
  components: {
    draggable
  },
  props: ['show-boolean', 'picture-list'],
  data() {
    return {
      loading: false,
      localPictureList: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.localPictureList = this.$props.pictureList;
  },
  methods: {
    // 提交
    submit() {
      this.$api.collect
        .orderCollections({
          picIdList: this.localPictureList.map(e => e.id),
          collectionId: this.$route.query.collectionId
        })
        .then(res => {
          if (res.data.data) {
            this.$message.success('排序画集成功');
            this.$emit('on-success', this.localPictureList);
          } else {
            this.$message.error('排序画集失败');
          }
        });
    },
    // 关闭弹窗
    closeModal() {
      this.$emit('close-modal', this.localPictureList);
    },
    // 移除画作
    removePicture(e) {
      this.$api.collect
        .deleteCollectionsIllust({
          illustId: e.id,
          collectionId: this.$route.query.collectionId
        })
        .then(res => {
          if (res.data.data) {
            this.$message.success('画作移出画集成功');
            this.localPictureList.splice(
              this.localPictureList.findIndex(item => item.id === e.id),
              1
            );
          } else {
            this.$message.error('移出画集失败');
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
.md-body {
  margin-bottom: 20px;
  .dragable-box {
    .item-line {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      padding: 0 10px;
      .item-info {
        display: flex;
        .pic-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          box-sizing: border-box;
          text-align: left;
          width: 100px;
        }
      }

      .action-icon {
        cursor: pointer;
      }
    }
  }
}
.CollectPictureAdjust {
}
</style>
