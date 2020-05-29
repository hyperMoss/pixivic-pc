<!--
 * @Author: gooing
 * @since: 2020-05-27 23:21:43
 * @lastTime: 2020-05-29 22:17:30
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\components\Collections\CollectPictureAdjust.vue
 * @message:
-->
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
        <draggable
          v-model="localPictureList"
          class="dragable-box"
        >
          <transition-group>
            <div
              v-for="element in localPictureList"
              :key="element.id"
            >
              <div class="item-line">
                <span class="pic-name">{{ element.title }}</span>
                <el-popconfirm
                  title="确定将该画作移出画集吗？"
                  @onConfirm="removePicture(element)"
                >
                  <i
                    slot="reference"
                    class="action-icon el-icon-delete"
                  />
                </el-popconfirm>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>

      <div slot="footer" style="    justify-content: flex-end;display: flex;">
        <el-button
          type="text"
          @click="closeModal"
        >取消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="closeModal"
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
            padding: 0 10px;;
            .pic-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: block;
                box-sizing: border-box;
                width: 280px;
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
