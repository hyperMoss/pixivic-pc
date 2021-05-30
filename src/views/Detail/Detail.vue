<!--
 * @Author: gooing
 * @since: 2020-02-02 14:52:15
 * @lastTime: 2020-07-10 23:23:18
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\views\Detail\Detail.vue
 * @message:
 -->
<template>
  <div
    v-if="illustDetail"
    class="detail"
  >
    <div class="page-padding">
      <main class="detail-content">
        <figure class="detail-content__figure">
          <img
            v-if="illustDetail.xrestrict==0&&illustDetail.sanityLevel<=(user ? 3 : 3)"
            :src="illustDetail.originalSrc"
            style="width:100%;height:80vh;object-fit: contain"
          >
        </figure>
        <div class="detail-content__action">
          <el-image
            :preview-src-list="srcList"
            class="showScreenImg"
            alt=""
            :src="require('assets/images/image.svg')"
          />
          <div
            :class="['like', { 'is-like': illustDetail.isLiked }]"
            @click="handleLike(illustDetail)"
          />
        </div>
        <figcaption class="detail-content__info">
          <div class="card">
            <h1>{{ illustDetail.title }}</h1>
            <div
              class="disc"
              v-html="illustDetail.caption"
            />
            <div class="tags">
              <ul>
                <li
                  v-for="item of illustDetail.tags"
                  :key="item.id"
                  :title="item.translatedName"
                  @click="openTag(item)"
                >
                  #{{ item.name }}
                </li>
              </ul>
            </div>
            <ul class="populor">
              <li title="阅读数">
                <i class="el-icon-view" />
                {{ illustDetail.totalView }}
              </li>
              <li title="收藏数">
                <i class="el-icon-star-off" />
                {{ illustDetail.totalBookmarks }}
              </li>
            </ul>
            <div
              class="date"
              title="投稿时间"
            >
              {{ illustDetail.createDate }}
            </div>
          </div>
        </figcaption>
        <figcaption class="detail-content__comment">
          <Comment :pid="pid" />
        </figcaption>
        <figcaption class="detail-content__relate">
          <h2 class="relate-title">
            {{ $t('relateContent') }}
          </h2>
          <div>
            <ul
              v-infinite-scroll="reqRelatedIllust"
              infinite-scroll-immediate
              class="relate-info"
              infinite-scroll-distance="10"
              infinite-scroll-delay="1000"
            >
              <li
                v-for="item in relatedPictureList"
                :key="item.id"
              >
                <Item
                  :illust="item"
                  style="height: 20vh;width: 20vh"
                  @handleLike="handleLike"
                  @handle-collect="setCollect"
                />
                <!-- <el-image :src="url" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image> -->
              </li>
            </ul>
          </div>
        </figcaption>
      </main>
      <!-- 作者信息 -->
      <aside class="detail-author">
        <section
          class="artist-info"
          @click="goArtistPage"
        >
          <el-avatar
            :src="illustDetail.avatarSrc"
            size="medium"
          />
          <h2>{{ illustDetail.artistPreView.name }}</h2>
        </section>
        <section style="margin:10px 20px;text-align:center;">
          <el-button
            round
            size="small"
            type="primary"
            @click="followArtist"
          >
            {{
              illustDetail.artistPreView.isFollowed ? $t('followed') : $t('follow')
            }}
          </el-button>
        </section>
        <section class="artist-preview">
          <template v-for="item in pictureList">
            <el-image
              :key="item.id"
              :src="item.imageUrls[0].medium | replaceSmall"
              fit="cover"
              class="small-img"
              lazy
              @click.native="goDetail(item)"
            >
              <div
                slot="placeholder"
                class="image-slot"
              >
                加载中<span class="dot">...</span>
              </div>
              <div
                slot="error"
                class="image-slot"
              >
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { replaceBigImg, replaceSmallImg } from '@/util';
import dayjs from 'dayjs';
import Item from '@/components/Virtual-List/MyItem';
import Comment from '@/components/PublicComponents/Comment';

export default {
  name: 'Detail',
  components: {
    Item,
    Comment,
  },
  props: {
    pid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      srcList: [],
      illustDetail: null,
      imageList: [],
      isLiked: false,
      type: 'illust',
      pictureList: [],
      relatedPictureList: [],
      likeUsers: [],
      fakeTime: 0,
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'followStatus', 'detail']),
  },
  watch: {
    // 详情去画师那里更改点赞状态 然后后退回来详情 状态也要变
    likeStatus(val, old) {
      const { illustId, like } = val;
      if (illustId === this.illustDetail.id) {
        this.illustDetail.isLiked = like;
      }
    },
    followStatus(val) {
      if (val.artistId === this.illustDetail.artistPreView.id) {
        this.illustDetail.artistPreView.isFollowed = val.follow;
      }
    },
  },
  mounted() {
    if (this.detail) {
      this.illustDetail = this.handleData(JSON.parse(JSON.stringify(this.detail)));
    } else {
      this.getIllustDetail();
    }
    this.bookmarkedUsers();
    this.fakeLoading();
  },
  methods: {
    // 打开弹窗
    setCollect(column) {
      if (!this.user.id) {
        this.$message.closeAll();
        this.$message.info('请先登录');
        return;
      }
      this.$store.dispatch('setCollectBoolean', column);
    },
    fakeLoading() {
      const interval = setInterval(() => { if (this.fakeTime === 98) { clearInterval(interval); } this.fakeTime++; }, 200);
    },
    // 处理图片数据
    handleData(data) {
      if (this.user.id) {
        this.getArtistIllust(data.artistId);
      }
      this.srcList = data.imageUrls.map((e) => replaceBigImg(e.original)) || [];
      return {
        ...data,
        itemHeight: data.itemHeight || parseInt((data.height / data.width) * document.body.clientWidth, 10),
        originalSrc: replaceBigImg(data.imageUrls[0].original),
        src: data.src || replaceSmallImg(data.imageUrls[0].medium),
        avatarSrc: data.avatarSrc || replaceBigImg(data.artistPreView.avatar),
        createDate: dayjs(data.createDate).format('YYYY-MM-DD'),
        imgs: data.imgs || data.imageUrls.reduce((pre, cur) => pre.concat(replaceBigImg(cur.original)), []),
      };
    },
    // 跳转到搜藏用户
    goUsers() {},
    // 书签用户
    bookmarkedUsers() {
      this.$api.detail
        .bookmarkedUsers({
          illustId: this.pid,
          pageSize: 3,
        })
        .then((res) => {
          this.likeUsers = res.data.data;
        });
    },
    // 跳转详情
    goDetail(data) {
      if (data.isad) {
        window.open(data.link);
      }
      this.$store.dispatch('setDetail', data);
      if (localStorage.getItem('openNew') === 'true') {
        const routeUrl = this.$router.resolve(`/illusts/${data.id}`);
        window.open(routeUrl.href, '_blank');
      } else {
        this.$router.push(`/illusts/${data.id}`);
      }
    },
    goArtistPage() {
      this.$router.push(`/artist/${this.illustDetail.artistId}`);
    },
    handleLike(data) {
      this.$message.closeAll();
      if (!this.user.id) {
        this.$message.info('请先登录');
        return;
      }
      const flag = data.isLiked;
      data.isLiked = !data.isLiked;
      const params = {
        userId: this.user.id,
        illustId: data.id,
        username: this.user.username,
      };
      if (!flag) {
        this.$store.dispatch('handleCollectIllust', params)
          .then((e) => {
            this.$message.success(e.data.message);
          })
          .catch((e) => {
            data.isLiked = !data.isLiked;
            this.$message.error(e.data.message);
          });
      } else {
        this.$store.dispatch('deleteCollectIllust', params)
          .then((e) => {
            this.$message.success(e.data.message);
          })
          .catch((e) => {
            data.isLiked = !data.isLiked;
            this.$message.error(e.data.message);
          });
      }
    },
    openTag(item) {
      this.$router.push({
        path: '/keywords',
        query: {
          tag: item.name,
          illustType: this.type,
        },
      });
    },
    // 请求数据
    getIllustDetail() {
      this.$api.detail.reqIllustDetail(this.pid).then((res) => {
        if (res.status !== 200) { return; }
        const { data } = res.data;
        this.illustDetail = this.handleData(data);
      });
    },
    followArtist() {
      if (!this.user.id) {
        this.$message.info('请先登录');
        this.$store.dispatch('setLoginBoolean');
        return;
      }
      const data = {
        artistId: this.illustDetail.artistPreView.id,
        userId: this.user.id,
        username: this.user.username,
      };
      if (!this.illustDetail.artistPreView.isFollowed) {
        this.illustDetail.artistPreView.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then((res) => {})
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = false;
            this.$message.info('关注失败');
          });
      } else {
        this.illustDetail.artistPreView.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then((res) => {})
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      }
    },
    // 获取画家信息
    getArtistIllust(artistId) {
      this.$api.detail
        .reqArtistIllust({
          page: 1,
          artistId,
          type: this.type,
          pageSize: 10,
        })
        .then((res) => {
          if (res?.data?.data) {
            const {
              data: { data },
            } = res;
            this.pictureList = this.pictureList.concat(data).filter((item) => item.xrestrict === 0 && item.sanityLevel <= (this.user ? 3 : 3));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    reqRelatedIllust() {
      this.$api.detail
        .reqRelatedIllust({
          page: this.page++,
          illustId: this.pid,
        })
        .then((res) => {
          if (!res.data.data) {
            this.$message.info('到底了');
          } else {
            this.relatedPictureList = this.relatedPictureList.concat(
              res.data.data.filter((item) => !(item.xrestrict === 1 || item.sanityLevel > (this.user && this.user.id ? 3 : 3))),
            );
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
@keyframes heart {
  0% {
    background-position: left;
  }

  100% {
    background-position: right;
  }
}
.detail {
  max-height: calc(~"100vh - 60px");
  display: flex;
  justify-content: center;
  .page-padding {
    padding: 20px;
    display: flex;
  }
  &-content {
    width: 80%;
    flex:1  0 auto;
    background-color: #fff;
    &__figure {
      margin: 20px;
    }
    &__action {
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 0 20px;
      .users {
        display: flex;
      }
      .like {
        width: 80px;
        height: 40px;
        background: url("../../assets/images/like.png") no-repeat;
        background-position: left;
        background-size: 2900%;
      }
      .is-like {
        background-position: right;
        animation: heart 0.8s steps(28);
      }
    }
  &__comment{
      padding: 48px 16px;
     margin: 0 auto;
    }
    &__info {
      padding: 48px 16px;
      display: flex;
      margin: 0 auto;
      background: #fff;
      .card {
        width: 800px;
        h1 {
          color: rgb(28, 28, 28);
          font-size: .25rem;
          line-height: 24px;
          font-weight: bold;
          margin: 0px 0px 8px;
        }
        .disc {
          color: rgb(92, 92, 92);
          line-height: 1.33;
          margin: 0px;
          overflow: hidden;
        }
        .tags {
          display: flex;
          color: rgb(61, 118, 153);
          line-height: 18px;
          margin: 16px 0px;
          ul {
            margin: 0 -6px 0 0;
            list-style: none;
            padding-left: 0;
            word-break: break-all;
            li {
              display: inline;
              margin: 0 12px 0 0;
              cursor: pointer;
            }
          }
        }
        .populor {
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          margin: 16px -4px;
          list-style: none;
          padding: 0px;
          li {
            flex: 0 0 auto;
            margin: 0 0.5em;
            display: list-item;
            text-align: -webkit-match-parent;
            font-size: 0.75rem;
            color: rgb(173, 173, 173);
          }
        }
        .date {
          color: rgb(173, 173, 173);
          font-size: 0.75rem;
          line-height: 1;
        }
      }
    }
    &__relate {
      padding: 0px 16px;
      .relate-title {
        font-size: .25rem;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.64);
        margin: 0px;
      }
      .relate-info {
        list-style: none;
        display: grid;
        gap: 2em;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fit, 20vh);
        -webkit-box-pack: center;
        justify-content: flex-start;
        margin-bottom: 2em;
        padding-inline-start: 0;
      }
    }
  }
  &-author {
    width: 20%;
    flex: 1 0 auto;
    background: #fdfdfd;
    .artist-info {
      display: flex;
      padding: 1em;
      border-radius: 0.5em;
      align-items: center;
      h2 {
        font-size: 1rem;
        font-weight: bold;
        margin-left: 6px;
        word-break: break-all;
        color: rgb(31, 31, 31);
        text-decoration: none;
      }
    }
    .artist-preview {
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      .small-img {
        width: 80px;
        height: 80px;
      }
    }
  }

  .showScreenImg {
    position: relative;
    left: -2px;
    width: 18px;
    height: 18px;
    z-index: 999;
    padding-right: 96px;
  }
  .showScreenImg:after{
    position: absolute;
    display: inline-block;
    left: 28px;
    top: -1px;
    content: '大图';
    width: 88px;
    height: 18px;
  }
  /deep/ .showScreenImg .el-image__inner.el-image__preview {
    position: relative;
    z-index: 9999;
    padding-right: 96px;
    width: 18px;
    height: 18px;
  }
}

</style>
