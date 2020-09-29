
<template>
  <div class="followed">
    <artist-list
      v-if="artistList.length"
      :loading="loading"
      :artist-list="artistList"
      @on-scroll="getFollowArtists"
      @follow-artist="follow"
    />
    <div v-else style="margin: 50px auto 0; width:300px;text-align: center;">
      <svg font-size="160" class="icon" aria-hidden="true">
        <use xlink:href="#pickongtai1" />
      </svg>
      <p style="color: #E3F2FA; font-size: 20px;">没有内容</p>
    </div>
    <!-- <div class="pix-page">
      <el-pagination
        :current-page="page.page"
        background
        layout="prev, pager, next"
        :total="10"
        @current-change="handlePageChange"
      />
    </div> -->
  </div>
</template>

<script>
import ArtistList from 'components/PublicComponents/ArtistList/index.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'Followed',
  components: { ArtistList },
  data() {
    return {
      page: { page: 0, pageSize: 10 },
      artistList: [],
      listMap: new Map(),
      height: 0,
      loading: false
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus'])
  },
  watch: {
    followStatus(val) {
      const { artistId, follow } = val;
      const item = this.listMap.get(artistId);
      if (item) {
        this.$set(item, 'isFollowed', follow);
      }
    }
  },
  mounted() {
    this.getFollowArtists();
  },
  created() {},
  methods: {
    handlePageChange(v) {
      this.page = v;
      this.getFollowArtists();
    },
    // 获取关注列表
    getFollowArtists() {
      this.loading = true;
      this.$api.user
        .getArtists({
          page: ++this.page.page,
          pageSize: this.page.pageSize,
          userId: this.user.id
        })
        .then(res => {
          this.loading = false;
          const {
            data: { data }
          } = res;
          if (!data) {
            this.$message.info('关注列表已到底');
          } else {
            this.artistList = this.artistList.concat(data);
            for (const item of data) {
              this.listMap.set(item.id, item);
            }
          }
          // this.loading = false;
        });
    },
    follow(item) {
      const val = this.listMap.get(item.id);
      const data = {
        artistId: val.id,
        userId: this.user.id,
        username: this.user.username
      };
      if (val.isFollowed) {
        val.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {})
          .catch(() => {
            val.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      } else {
        val.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {})
          .catch(() => {
            val.isFollowed = false;
            this.$message.info('关注失败');
          });
      }
    }
  }
};
</script>

<style scoped lang="less">
.followed {
  height: calc(~"100vh - 60px");
  overflow: hidden;
  overflow-y: scroll;
  background: #fff;
}
</style>
