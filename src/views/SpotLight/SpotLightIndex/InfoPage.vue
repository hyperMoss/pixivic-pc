<template>
  <div class="InfoPage">
    <ul
      v-for="item of pictureList"
      :key="item.id"
      class="pic-list"
    >
      <li>
        <div class="artist-info">
          <el-avatar
            :src="item.artistPreView.avatarSrc"
            size="large"
            @click="goArtistPage(item.artistPreView)"
          />
          <h2 @click="goArtistPage(item.artistPreView)">
            {{ item.artistPreView.name }}
          </h2>
        </div>
        <h2>{{ item.title }}</h2>
        <el-image
          :src="item.imageUrls[0].large | replaceBig"
          class="image"
          :style="{height:item.height}"
          fit="cover"
          lazy
          @click.native="goDeatil(item)"
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
        <el-divider />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'InfoPage',
  components: {},
  data() {
    return {
      pictureList: [],
      id: this.$route.query.id,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSpotLightsIllust();
  },
  methods: {
    getSpotLightsIllust() {
      this.$api.spot.getSpotLightsIllust(this.id).then((res) => {
        this.pictureList = this.pictureList.concat(res.data.data) || [];
      });
    },
    goDeatil(data) {
      if (data.isad) {
        window.open(data.link);
      }
      this.$store.dispatch('setDetail', data);
      this.$router.push(`/illusts/${data.id}`);
    },
    goArtistPage(data) {
      this.$router.push(`/artist/${data.id}`);
    },
  },
};
</script>

<style scoped lang="less">
.InfoPage {

  background: #fff;
  .pic-list {
    list-style: none;
    width: 900px;
    margin: 0 auto;
    justify-content: center;
    .artist-info {
      display: flex;
      align-items: center;
      h2 {
        font-size: 1em;
        font-weight: bold;
        margin-left: 6px;
        word-break: break-all;
        color: #1f1f1f;
        text-decoration: none;
      }
    }
    .image {
      width: 100%;
      max-width: 800px;
    }
  }}
</style>
