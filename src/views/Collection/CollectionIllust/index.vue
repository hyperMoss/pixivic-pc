<!--
 * @Author: gooing
 * @since: 2020-05-27 21:42:07
 * @lastTime: 2020-06-07 23:26:12
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\Collection\CollectionIllust\index.vue
 * @message:
-->
<template>
  <div class="collectionsIllust">
    <VirtualList
      :identifier="identifier"
      :list="illustList"
      @infinite="infinite"
    >
      <div class="collectionsIllust-btns">
        <el-button type="primary" @click="handleModifyList">列表排序</el-button>
      </div>
      <div class="collectionsIllust-comment">
        <Comment v-if="collectInfo.forbidComment" :pid="collectInfo.id+''" comment-type="collections" />
        <div v-else style="margin:50px auto;width:200px;text-align:center;">
          <svg font-size="160" class="icon" aria-hidden="true">
            <use xlink:href="#pickongtai1" />
          </svg>
          <p style="color: #E3F2FA; font-size: 20px;">未开启评论</p>
        </div>
      </div>
    </VirtualList>
    <CollectPictureAdjust
      v-if="modifyListBoolean"
      :picture-list="CopyillustList"
      :show-boolean="modifyListBoolean"
      @close-modal="handleModifyListClose"
      @on-success="handleAdjust"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VirtualList from '@/components/Virtual-List/VirtualList';
import CollectPictureAdjust from 'components/Collections/CollectPictureAdjust.vue';
import Comment from '@/components/PublicComponents/Comment';
export default {
  name: 'CollectionsIllust',
  components: { VirtualList, CollectPictureAdjust, Comment },
  props: {
    collectionId: {
      required: true,
      type: [String, Number]
    }
  },
  data() {
    return {
      page: 1,
      illustList: [],
      identifier: +new Date(),
      modifyListBoolean: false,
      CopyillustList: []
    };
  },
  computed: {
    ...mapGetters(['collectInfo', 'user'])
  },
  watch: {},
  mounted() {},
  methods: {
    infinite($state) {
      this.$api.collect
        .getCollections({
          page: this.page++,
          collectionId: this.$route.query.collectionId
        })
        .then(res => {
          if (!res.data.data) {
            $state.complete();
          } else {
            this.illustList = this.illustList.concat(res.data.data);
            $state.loaded();
          }
        });
    },
    handleModifyList() {
      this.CopyillustList = [...this.illustList];

      this.modifyListBoolean = !this.modifyListBoolean;
    },
    handleModifyListClose(e) {
      this.illustList = e;
      this.modifyListBoolean = !this.modifyListBoolean;
    },
    handleAdjust(list) {
      this.modifyListBoolean = false;
      this.illustList = list;
      this.illustList.splice(1, 0);
    }
  }
};
</script>

<style scoped lang="less">
.collectionsIllust {
  height: calc(~"100vh - 60px");
  overflow: hidden;
  /deep/.water-content {
    margin: 0 auto 0 20px;
  }
  &-btns {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
  &-comment {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
    float: right;
    width: 600px;
    border: 1px solid;
  }
}
</style>
