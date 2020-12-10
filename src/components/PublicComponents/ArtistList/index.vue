
<template>
  <div class="artist-list-index">
    <div
      v-infinite-scroll="load"
      class="artist-list"
      infinite-scroll-immediate
      infinite-scroll-delay="1000"
    >
      <div
        v-for="artistItem in artistList"
        :key="artistItem.id"
        class="artist-item"
      >
        <div class="avatar" @click="goArtist(artistItem.id)">
          <el-avatar :size="80" :src="artistItem.avatar | replaceBig" />
        </div>
        <div class="info">
          <div class="name">{{ artistItem.name }}</div>
          <div class="desc">{{ artistItem.comment }}</div>
          <div class="followed-button">
            <el-button round type="primary" @click="follow(artistItem)">
              {{ artistItem.isFollowed ? $t('followed') : $t('follow') }}
            </el-button>
          </div>
        </div>
        <div class="picture">
          <ul class="picture-array">
            <li
              v-for="(item, index) in artistItem.recentlyIllustrations.filter(
                item => item.xrestrict === 0 && item.sanityLevel <= (user ? 5 : 4)
              )"
              :key="index"
              class="picture-item"
              @click="goDetail(item)"
            >
              <el-image
                :src="item.imageUrls[0].squareMedium | replaceImg"
                class="small-img"
                fit="cover"
                lazy
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div class="title">{{ item.title }}</div>
            </li>
          </ul>
        </div>
      </div>
      <p v-if="loading" class="bottom">加载中...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Index',
  components: {},
  filters: {
    replaceImg(val) {
      return (
        'https://img.pixivic.net/c/360x360_70/img-master' +
        val.split('img-master')[1]
      );
    }
  },
  props: {
    artistList: {
      require: true,
      default: () => {
        return [];
      },
      type: Array
    },
    loading: {
      require: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {},
  mounted() {},
  methods: {
    goArtist(id) {
      this.$router.push(`/artist/${id}`);
    },
    goDetail(data) {
      if (data.isad) {
        window.open(data.link);
      }
      this.$store.dispatch('setDetail', data);
      this.$router.push(`/illusts/${data.id}`);
    },
    follow(artistItem) {
      this.$emit('follow-artist', artistItem);
    },
    load() { this.$emit('on-scroll'); }
  }
};
</script>

<style scoped lang="less">
.artist-list-index {
  .bottom{
text-align: center;
  }
  .artist-list {
    max-height: calc(100vh - 60px);
    padding: 0px;
    justify-content: center;
    overflow: auto;
    .artist-item {
      width: 1044px;
      margin: 0 auto;
      display: flex;
      align-items: flex-start;
      list-style: none;
      padding: 24px 0px;
      border-bottom: 1px solid rgb(235, 235, 235);
      .info {
        width: 296px;
        margin-left: 16px;
        .name {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          text-decoration: none;
        }
        .desc {
          margin-top: 5px;
          word-break: break-all;
          font-size: 14px;
          line-height: 20px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .followed-button {
          margin-top: 14px;
        }
      }
      .picture {
        flex-shrink: 0;
        margin-left: 24px;
        .picture-array {
          display: flex;
          list-style: none;
          padding: 0;
          .picture-item {
            margin-right: 24px;
            .small-img {
              width: 180px;
              height: 180px;
            }
            .title {
              display: block;
              max-width: 180px;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 22px;
              font-size: 14px;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.88);
              overflow: hidden;
              text-decoration: none;
              transition: color 0.2s ease 0s;
            }
          }
        }
      }
    }
  }
}
</style>
