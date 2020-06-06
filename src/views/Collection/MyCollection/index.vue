<!--
 * @Author: gooing
 * @since: 2020-05-20 01:09:48
 * @lastTime: 2020-06-06 22:12:06
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\Collection\MyCollection\index.vue
 * @message:
-->
<template>
  <div class="collection">
    <div class="header">
      <div>
        <el-radio-group
          v-model="isPublic"
          style="margin-right:10px;"
          @change="getList"
        >
          <el-radio-button
            :label="0"
            name="私有"
          >私有</el-radio-button>
          <el-radio-button
            :label="1"
            name="公开"
          >公开</el-radio-button>
        </el-radio-group>
      </div>
      <el-button @click="handleStartCollect">发起画集</el-button>
    </div>
    <CardList :collection-list="collectionList" :power-flag="true" @on-scroll="getCollections" />
    <CreateCollect
      v-if="createCollectBoolean"
      :show-boolean="createCollectBoolean"
      :collect-data="collectData"
      @on-cancel="handleStartCollect"
      @on-success="handleAddSuccess"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CardList from 'components/Collections/CardList.vue';
import CreateCollect from 'components/Collections/CreateCollect.vue';
export default {
  name: 'Collection',
  components: {
    CreateCollect,
    CardList
  },
  data() {
    return {
      page: { page: 1, pageSize: 10, total: 0 },
      collectionList: [],
      isPublic: 0,
      createCollectBoolean: false,
      collectData: null
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {},
  mounted() {
    this.getCollections();
  },
  methods: {
    getList() {
      this.page.page = 1;
      this.getCollections();
    },
    handleAddSuccess(e, flag) {
      this.handleStartCollect();
      this.getList();
    },
    getCollections() {
      this.$api.collect
        .getUserCollections({
          page: this.page.page++,
          pageSize: this.page.pageSize,
          userId: this.user.id,
          isPublic: this.isPublic
        })
        .then(res => {
          const {
            data: { data }
          } = res;
          if (data.length) {
            this.collectionList = data;
          }
        });
    },
    handleStartCollect() {
      this.collectData = null;
      this.createCollectBoolean = !this.createCollectBoolean;
    }
  }
};
</script>

<style scoped lang="less">
.collection {
    max-height: calc(~'100vh - 60px');
    overflow-y: auto;
    background: #fff;
     .header {
        height: 60px;
        padding: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

}
</style>
