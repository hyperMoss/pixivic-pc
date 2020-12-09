
<template>
  <div class="CollectPIcture">
    <el-dialog
      v-if="$store.getters.collectBoolean"
      :close-on-click-modal="false"
      :visible="$store.getters.collectBoolean"
      title="添加画作至画集"
      width="30%"
      @close="closeModal"
    >
      <div class="colletlist-bd">
        <div class="colletlist-preview">
          <el-image
            :src="readyCollectItem.imageUrls[0].medium | replaceSmall"
            fit="cover"
            style="height: 140px; width: 140px;"
          >
            <div
              slot="error"
              class="image-slot"
            >
              <i class="el-icon-picture-outline" />
            </div>
            <div
              slot="placeholder"
              class="image-slot"
            >
              加载中
              <span class="dot">...</span>
            </div>
          </el-image>
          <p class="item-title">
            {{ readyCollectItem.title }}
          </p>
        </div>
        <div class="colletlist-content">
          <div class="md-item">
            <div class="item-hd">
              <h3>选择画集</h3>
            </div>
            <div
              v-infinite-scroll="getCollections"
              infinite-scroll-immediate
              class="select-list"
              infinite-scroll-delay="2000"
            >
              <div
                v-for="collect of collectionList"
                :key="collect.id"
                :class="[collect.id === collectionId ? 'selected' : '']"
                class="select-item"
                @click="selectCollect(collect)"
              >
                {{ collect.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        slot="footer"
        style="    justify-content: flex-end;display: flex;"
      >
        <el-button
          type="text"
          @click="closeModal"
        >
          取消
        </el-button>
        <el-button
          :disabled="!collectionId"
          type="primary"
          @click="collectAjax"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'CollectPicture',
  components: {},
  data() {
    return {
      page: { page: 1, pageSize: 20, total: 0 },
      collectionList: [],
      isPublic: 0,
      collectionId: ''
    };
  },
  computed: {
    ...mapGetters(['readyCollectItem', 'user'])
  },
  watch: {
    '$store.getters.collectBoolean': function(val) {
      if (val) {
        this.collectionId = '';
        this.getCollections();
      }
    }
  },
  mounted() {},
  methods: {
    selectCollect(collect) {
      this.collectionId = collect.id;
    },
    typeChange() {
      this.loginType = !this.loginType;
    },
    getCollections() {
      if (
        this.collectionList.length < this.page.page * this.page.pageSize &&
        this.page.page !== 1
      ) {
        return;
      }
      this.$api.collect
        .getUserCollections({
          page: this.page.page++,
          pageSize: this.page.pageSize,
          userId: this.user.id
        })
        .then(res => {
          const {
            data: { data }
          } = res;
          if (data && data.length) {
            this.collectionList = data;
          } else {
            this.$message.info('画集列表已到底');
          }
        });
    },
    closeModal() {
      this.$store.dispatch('setCollectBoolean');
    },
    collectAjax() {
      this.$api.collect
        .postCollectionsIllust({
          illust_id: this.readyCollectItem.id,
          collectionId: this.collectionId
        })
        .then(res => {
          if (res.data.data) {
            this.closeModal();
            this.$message.success('加入画集成功');
          } else {
            this.$message.error('加入画集失败');
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0;
}
.colletlist-bd {
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  .colletlist-preview {
    width: 140px;
    float: left;
    padding: 0 20px;
    margin: 70px 0;
    text-align: center;
    font-size: 15px;
    color: #666;
    word-wrap: break-word;
    .item-title {
      margin: 1em 0 0 0;
      overflow: hidden;
      max-height: 44px;
      height: auto;
      text-overflow: ellipsis;
      text-overflow: -o-ellipsis-lastline;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .colletlist-content {
    flex: auto;
    border-left: 1px solid #e5e5e5;
    padding-bottom: 10px;
    overflow: hidden;
    .md-item {
      padding: 20px;
      .item-hd {
        margin-bottom: 10px;
        h3 {
          display: inline-block;
          background: none;
          margin: 0 10px 0 0;
          font-size: 15px;
          line-height: 26px;
          color: #666;
        }
      }
      .select-list {
        height: 200px;
        font-size: 13px;
        overflow-y: auto;
        user-select: none;
        -webkit-user-select: none;
        .select-item {
          vertical-align: middle;
          line-height: 21px;
          width: 85px;
          box-sizing: border-box;
          width: 100%;
          padding: 7px 9px;
          border-radius: 3px;
        }
        .select-item:hover {
          background: rgb(217, 236, 255);
        }
        .selected {
          background: #409eff;
          color: #fff;
        }
        .selected:hover{
          background: #409EFF;
        }
      }
    }
  }
}
.CollectPIcture {
}
</style>
