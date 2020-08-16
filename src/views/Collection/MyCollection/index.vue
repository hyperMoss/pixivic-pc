
<template>
  <div class="collection">
    <div class="header">
      <div>
        <el-radio-group
          v-model="isPublic"
          style="margin-right:10px;"
          @change="getCollections"
        >
          <el-radio-button :label="0" name="私有">私有</el-radio-button>
          <el-radio-button :label="1" name="公开">公开</el-radio-button>
        </el-radio-group>
      </div>
      <el-button @click="handleStartCollect">发起画集</el-button>
    </div>
    <keep-alive>
      <CardList
        :collection-list="isPublic ? publicCollectionList : privateCollectList"
        :power-flag="true"
        @on-scroll="getCollections"
      />
    </keep-alive>

    <CreateCollect
      v-if="createCollectBoolean"
      :collect-data="collectData"
      :show-boolean="createCollectBoolean"
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
      page: { publicPage: 1, pageSize: 10, total: 0, privatePage: 1 },
      publicCollectionList: [],
      privateCollectList: [],
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
      this.getCollections();
    },
    handleAddSuccess(e, flag) {
      this.handleStartCollect();
      this.getList();
    },
    getCollections() {
      this.$api.collect
        .getUserCollections({
          page: this.isPublic
            ? this.page.publicPage++
            : this.page.privatePage++,
          pageSize: this.page.pageSize,
          userId: this.user.id,
          isPublic: this.isPublic
        })
        .then(res => {
          if (this.isPublic) {
            if (res.data.data) {
              this.publicCollectionList = this.publicCollectionList.concat(
                res.data.data
              );
            }
          } else {
            if (res.data.data) {
              this.privateCollectList = this.privateCollectList.concat(
                res.data.data
              );
            }
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
