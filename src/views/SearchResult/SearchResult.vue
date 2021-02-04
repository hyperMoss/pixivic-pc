<template>
  <div class="search-result">
    <virtual-list
      v-if="searchKeyType!=='artist'"
      :identifier="identifier"
      :list="pictureList"
      @infinite="infinite"
    >
      <Tags
        :data="[...tags, ...exclusive]"
        class="search-tag"
        @handleClick="clickTag"
      />
    </virtual-list>
    <artist-list
      v-if="artistList.length"
      :artist-list="artistList"
      @on-scroll="serachArtists"
      @follow-artist="follow"
    />
  </div>
</template>

<script>
import VirtualList from '@/components/Virtual-List/VirtualList';
import Tags from '@/components/PublicComponents/Tags';
import ArtistList from 'components/PublicComponents/ArtistList/index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'SearchResult',
  components: {
    VirtualList,
    Tags,
    ArtistList,
  },
  data() {
    return {
      isSearchByImg: false,
      identifier: +new Date(),
      pictureList: [],
      date: [],
      keyword: this.$route.query.tag || '',
      // 画作类型
      searchKeyType: this.$route.query.illustType || 'illust',
      // 搜索图片质量
      searchType: 'original',
      minWidth: 0, // 最小宽度
      minHeight: 0, // 最小高度
      beginDate: null, // 画作发布日期限制
      endDate: null, // 画作发布日期限制
      xRestrict: 0,
      maxSanityLevel: 3,
      page: 1,
      tags: [],
      exclusive: [],
      artistPage: { page: 1, pageSize: 20 },
      artistList: [],
      listMap: new Map(),
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus']),
  },
  watch: {
    followStatus(val) {
      const { artistId, follow } = val;
      const item = this.listMap.get(artistId);
      if (item) {
        this.$set(item, 'isFollowed', follow);
      }
    },
  },
  mounted() {
    if (this.searchKeyType === 'artist') {
      this.serachArtists();
      return;
    }
    //this.getTags(this.keyword);
    this.getExclusive(this.keyword);
  },
  methods: {
    getTags(param) {
      this.$api.search.getTags(param).then((res) => {
        this.tags = res.data.data || [];
      });
    },
    getExclusive(param) {
      this.$api.search.getExclusive(param).then((res) => {
        this.exclusive = res.data.data || [];
      });
    },
    clickTag(val) {
      //this.getTags(val.keyword);
      this.getExclusive(val.keyword);
      this.$router.push({
        path: '/keywords',
        query: {
          tag: val.keyword,
          illustType: this.searchKeyType,
        },
      });
    },
    optionsParams() {
      const data = {
        illustType: this.searchKeyType,
        searchType: this.searchType,
        minWidth: 0,
        minHeight: 0,
        beginDate: this.date[0] || '',
        endDate: this.date[1] || '',
        xRestrict: this.xRestrict, // 0关 1开
        maxSanityLevel: this.maxSanityLevel, // 16禁
      };
      Object.keys(data).forEach((item) => {
        if (!data[item]) {
          delete data[item];
        }
      });
      return data;
    },
    infinite($state) {
      if (this.isSearchByImg) {
        return $state.complete();
      }
      this.$api.search
        .getSearch({
          ...this.optionsParams(),
          page: this.page++,
          keyword: this.keyword,
        })
        .then((res) => {
          const { data } = res.data;
          if (!data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(data);
            $state.loaded();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    serachArtists() {
      if (this.artistList.length < this.artistPage.page * this.artistPage.pageSize && this.artistPage.page !== 1) {
        this.$message.info('已经到底了');
        return;
      }
      this.$api.search
        .searchArtists({
          artistName: this.keyword,
          page: this.artistPage.page++,
          pageSize: this.artistPage.pageSize,
        })
        .then((res) => {
          const {
            data: { data },
          } = res;
          if (!data) {
            this.$message.info('已经到底了');
          } else {
            this.artistList = this.artistList.concat(data);
            for (const item of data) {
              this.listMap.set(item.id, item);
            }
          }
        });
    },
    follow(item) {
      const val = this.listMap.get(item.id);
      const data = {
        artistId: val.id,
        userId: this.user.id,
        username: this.user.username,
      };
      if (val.isFollowed) {
        val.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then((res) => {})
          .catch(() => {
            val.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      } else {
        val.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then((res) => {})
          .catch(() => {
            val.isFollowed = false;
            this.$message.info('关注失败');
          });
      }
    },
  },
};
</script>

<style scoped lang="less">
.search-result {
  height: calc(~"100vh - 60px");
  overflow: hidden;
  .search-tag {
    width: 80vw;
    margin: 0 auto;
  }
}
</style>
