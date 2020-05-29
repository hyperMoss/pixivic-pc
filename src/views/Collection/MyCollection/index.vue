<!--
 * @Author: gooing
 * @since: 2020-05-20 01:09:48
 * @lastTime: 2020-05-29 22:35:10
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

    <div
      v-infinite-scroll="getCollections"
      class="list-grid"
      infinite-scroll-delay="2000"
      infinite-scroll-distance="10"
      infinite-scroll-immediate
    >
      <el-card
        v-for="(item) in collectionList"
        :key="item.id"
        :body-style="{ padding: '0px' }"
        @click.native="goInfoPage(item)"
      >
        <el-image
          v-if="item.cover"
          :src="item.cover.imageUrls[0].medium | replaceSmall"
          class="image"
          fit="cover"
          lazy
        >
          <div
            slot="placeholder"
            class="image-slot"
          >
            加载中
            <span class="dot">...</span>
          </div>
          <div
            slot="error"
            class="image-slot"
          >
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <el-image
          v-else
          class="image"
          fit="cover"
          lazy
          src="https://pic.cheerfun.dev/40655.png?t=1590334915989"
        />
        <div style="padding: 14px;">
          <span>{{ item.title }}</span>
          <div class="bottom clearfix">
            <time class="time">{{ item.createTime.split('T')[0] }}</time>
            <el-dropdown style="padding: 0;float: right;">
              <span>
                <i class="el-icon-setting" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="modifyCollect(item)">修改</el-dropdown-item>
                <el-dropdown-item @click.native="deletCollect(item)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>
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
import CreateCollect from 'components/Collections/CreateCollect.vue';
export default {
  name: 'Collection',
  components: {
    CreateCollect
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
    deletCollect(item) {
      const collectionId = item.id;
      this.$confirm('确定删除该画集吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.collect
            .deleteCollections(collectionId)
            .then(res => {
              if (res.data && res.data.data) {
                this.$message.info('删除画集成功');
                this.collectionList.splice(
                  this.collectionList.findIndex(e => e.id === collectionId),
                  1
                );
              } else {
                this.$message.info('删除画集失败');
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    modifyCollect(item) {
      this.collectData = item;
      this.createCollectBoolean = !this.createCollectBoolean;
    },
    getList() {
      this.page.page = 1;
      this.getCollections();
    },
    handleAddSuccess(e) {
      this.handleStartCollect();
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
    },
    goInfoPage(item) {
      this.$router.push({ path: `/collect/collectionsillust/${item.id}`, query: { collectionId: item.id }});
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
    .image {
        width: 400px;
        height: 400px;
        display: block;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }
    .list-grid {
        list-style: none;
        display: grid;
        gap: 24px;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fit, 400px);
        -webkit-box-pack: center;
        justify-content: center;
        margin: 20px 0;
        margin-bottom: 20px;
        padding: 0px;
    }
}
</style>
