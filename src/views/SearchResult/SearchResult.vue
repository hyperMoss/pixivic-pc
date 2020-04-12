<!--
 * @Author: gooing
 * @since: 2020-02-11 12:45:23
 * @lastTime: 2020-04-07 23:35:06
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\SearchResult\SearchResult.vue
 * @message:
 -->
<template>
  <div class="search-result">
    <virtual-list
      :identifier="identifier"
      :list="pictureList"
      @infinite="infinite"
    >
      <Tags class="search-tag" :data="[...tags, ...exclusive]" @handleClick="clickTag" /></virtual-list>
  </div>
</template>

<script>
import VirtualList from '@/components/Virtual-List/VirtualList';
import Tags from '@/components/PublicComponents/Tags';
export default {
  name: 'SearchResult',
  components: {
    VirtualList,
    Tags
  },
  data() {
    return {
      isSearchByImg: false,
      identifier: +new Date(),
      pictureList: [],
      date: [],
      keyword: this.$route.query.tag || '',
      // 画作类型
      illustType: 'illust',
      // 搜索图片质量
      searchType: 'original',
      minWidth: 0, // 最小宽度
      minHeight: 0, // 最小高度
      beginDate: null, // 画作发布日期限制
      endDate: null, // 画作发布日期限制
      xRestrict: 0,
      maxSanityLevel: 6,
      page: 1,
      tags: [],
      exclusive: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getTags(this.keyword);
    this.getExclusive(this.keyword);
  },
  methods: {
    getTags(param) {
      this.$api.search
        .getTags(param)
        .then(res => {
          this.tags = res.data.data || [];
        });
    },
    getExclusive(param) {
      this.$api.search
        .getExclusive(param)
        .then(res => {
          this.exclusive = res.data.data || [];
        });
    },
    clickTag(val) {
      this.getTags(val.keyword);
      this.getExclusive(val.keyword);
      // this.page = 1;
      // this.pictureList = [];
      // this.identifier += 1;
      this.$router.push({
        path: `/keywords`,
        query: {
          tag: val.keyword,
          illustType: this.$route.query.illustType || this.illustType
        }
      });
    },
    optionsParams() {
      const data = {
        illustType: this.$route.query.illustType || this.illustType,
        searchType: this.searchType,
        minWidth: 0,
        minHeight: 0,
        beginDate: this.date[0] || '',
        endDate: this.date[1] || '',
        xRestrict: this.xRestrict, // 0关 1开
        maxSanityLevel: this.maxSanityLevel // 16禁
      };
      Object.keys(data).forEach(item => {
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
          keyword: this.keyword
        })
        .then(res => {
          const data = res.data.data;
          if (!data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(data);
            $state.loaded();
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped lang="less">
.search-result {
	height: calc(~'100vh - 60px');
	overflow-y: hidden;
	width: calc(~'100%');
	display: flex;
  justify-content: center;
  .search-tag{
    width: 80vw;
    margin: 0 auto;
  }
}
</style>
