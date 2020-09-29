
<template>
  <div class="index">
    <div
      v-infinite-scroll="getSpotLights"
      class="list-grid"
      infinite-scroll-delay="2000"
      infinite-scroll-distance="10"
      infinite-scroll-immediate
    >
      <el-card
        v-for="(item) in soptList"
        :key="item.id"
        :body-style="{ padding: '0px' }"
        @click.native="goInfoPage(item)"
      >
        <el-image
          :src="item.thumbnail | replaceBig"
          fit="cover"
          class="image"
          lazy
        >
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <div style="padding: 14px;">
          <span>{{ item.title }}</span>
          <div class="bottom clearfix">
            <time class="time">{{ item.publishDate }}</time>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spotlight',
  components: {},
  data() {
    return {
      page: { page: 1, pageSize: 10 },
      soptList: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSpotLights();
  },
  methods: {
    getSpotLights() {
      if (
        this.soptList.length < this.page.page * this.page.pageSize &&
        this.page.page !== 1
      ) {
        this.$message.info('合辑列表已到底');
        return;
      }
      this.$api.spot
        .getSpotLights({
          page: this.page.page++,
          pageSize: this.page.pageSize
        })
        .then(res => {
          const {
            data: { data }
          } = res;
          if (!data) {
            this.$message.info('合辑列表已到底');
          } else {
            this.soptList = this.soptList.concat(data);
          }
        });
    },
    goInfoPage(item) {
      this.$router.push({ path: '/spot-light/info-page/', query: { id: item.id }});
    }
  }
};
</script>

<style scoped lang="less">
.index {

  overflow-y: scroll;
  background: #fff;
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
