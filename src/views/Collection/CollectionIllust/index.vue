<!--
 * @Author: gooing
 * @since: 2020-05-27 21:42:07
 * @lastTime: 2020-05-29 22:11:28
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
      <div class="collectionsIllust-btns"><el-button type="primary" @click="handleModifyList">列表排序</el-button></div>

    </VirtualList>
    <CollectPictureAdjust
      v-if="modifyListBoolean"
      :show-boolean="modifyListBoolean"
      :picture-list="CopyillustList"
      @close-modal="handleModifyListClose"
    />
  </div>
</template>

<script>
import VirtualList from '@/components/Virtual-List/VirtualList';
import CollectPictureAdjust from 'components/Collections/CollectPictureAdjust.vue';
export default {
  name: 'CollectionsIllust',
  components: { VirtualList,
    CollectPictureAdjust },
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
  computed: {},
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
    }
  }
};
</script>

<style scoped lang="less">

.collectionsIllust{
    height: calc(~"100vh - 60px");
  overflow: hidden;
  &-btns {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
