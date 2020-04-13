<!--
 * @Author: gooing
 * @since: 2020-02-11 12:29:14
 * @lastTime: 2020-04-10 12:33:21
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\Artist\Artist.vue
 * @message:
 -->
<template>
  <div class="artist">
    <keep-alive>
      <virtual-list
        :key="type"
        :identifier="identifier"
        :list="type === 'illust' ? IllustList : mangaList"
        @infinite="infinite"
      ><dir v-if="artistDetail" class="artist_property">
        <div class="artist-base">
          <div class="artist-one">
            <div class="artist-name">
              <div class="avatar">
                <img :src="artistDetail.avatarSrc" alt>
              </div>
              <div class="name-line">
                <div class="name">
                  <h1>{{ artistDetail.name }}</h1>
                </div>
                <div class="follow">
                  <el-button
                    style="width:160px"
                    round
                    size="small"
                    @click="followArtist"
                  >
                    {{ artistDetail.isFollowed ? "已关注" : "添加关注" }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="artist-one">
            <div class="artist-focus">
              <span style="color: #999;">
                <em
                  style="font-style:normal;color: #5C5C5C;font-weight: bold;"
                >
                  {{ artistDetail.totalFollowUsers }} </em>关注
              </span>
            </div>
          </div>
          <div class="artist-one" style="padding: 0 0 32px;">
            <div class="artist-focus">
              <span v-if="artistDetail.region">
                <i class="el-icon-location-outline" />
                {{ artistDetail.region }}
              </span>
            </div>
            <div class="artist-link">
              <i
                v-if="artistDetail.webPage"
                class="el-icon-s-home icon"
                @click="windowOpen(artistDetail.webPage)"
              />
              <i
                v-if="artistDetail.twitterUrl"
                class="el-icon-chat-dot-round icon"
                @click="windowOpen(artistDetail.twitterUrl)"
              />
              <i class="el-icon-share icon" />
            </div>
            <div class="artist-focus">
              <div class="comment">{{ artistDetail.comment }}</div>
              <el-popover
                placement="bottom"
                trigger="click"
                :content="artistDetail.comment"
                :width="400"
              >
                <div slot="reference" class="end">查看全部</div>
              </el-popover>
            </div>
          </div>
          <div class="tabs" @change="getArtistList">
            <el-radio-group v-model="type">
              <el-radio-button label="illust" name="插画" />
              <el-radio-button label="manga" name="漫画" />
            </el-radio-group>
          </div>
        </div>
      </dir>
      </virtual-list>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { replaceBigImg } from '@/util';
import VirtualList from '@/components/Virtual-List/VirtualList';
export default {
  name: 'Artist',
  components: {
    VirtualList
  },
  props: {
    artistId: {
      required: true,
      type: [String, Number]
    }
  },
  data() {
    return {
      artistDetail: null,
      page: 1,
      type: 'illust',
      identifier: +new Date(),
      illustSum: 0,
      mangaSum: 0,
      IllustList: [],
      mangaList: []
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus'])
  },
  watch: {
    followStatus(val) {
      if (val.artistId === this.artistDetail.id) {
        this.artistDetail.isFollowed = val.follow;
      }
    }
  },
  mounted() {
    this.getArtistInfo();
    this.getSummary();
  },
  methods: {
    getArtistList() {
      this.page = 1;
    },
    windowOpen(url) {
      window.open(url);
    },
    // 取画家信息
    getArtistInfo() {
      this.$api.detail.reqArtist(this.artistId).then(res => {
        const {
          data: { data }
        } = res;
        this.artistDetail = {
          ...data,
          avatarSrc: replaceBigImg(data.avatar)
        };
      });
    },
    getSummary() {
      this.$api.detail.reqSummary(this.artistId).then(res => {
        const {
          data: { data }
        } = res;
        for (const item of data) {
          if (item.type === 'illust') {
            this.illustSum = item.sum;
          } else if (item.type === 'manga') {
            this.mangaSum = item.sum;
          }
        }
      });
    },
    handleClick() {
      this.$router.back();
    },
    infinite($state) {
      this.$api.detail
        .reqArtistIllust({
          page: this.page++,
          artistId: this.artistId,
          type: this.type
        })
        .then(res => {
          if (res.data.data) {
            const {
              data: { data }
            } = res;
            if (this.type === 'illust') {
              this.IllustList = this.IllustList.concat(data);
            } else {
              this.mangaList = this.mangaList.concat(data);
            }
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    followArtist() {
      if (!this.user.id) {
        this.$message.info('请先登录');
        this.$store.dispatch('setLoginBoolean');
        return;
      }
      const data = {
        artistId: this.artistId,
        userId: this.user.id,
        username: this.user.username
      };
      if (!this.artistDetail.isFollowed) {
        this.artistDetail.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {
            this.artistDetail.totalFollowUsers++;
          })
          .catch(() => {
            this.artistDetail.isFollowed = false;
            this.$message.info('关注失败');
          });
      } else {
        this.artistDetail.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {
            this.artistDetail.totalFollowUsers--;
          })
          .catch(() => {
            this.artistDetail.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      }
    }
  }
};
</script>

<style scoped lang="less">
.artist {
  height: calc(~"100vh - 60px");
  overflow: hidden;
  .artist_property {
    margin: 0 auto;
    width: 100%;
    padding-top: 60px;
    padding-left: 0px;
    .artist-base {
      position: sticky;
      bottom: 0px;
      background: rgb(255, 255, 255);
      .artist-one {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-box-align: end;
        -webkit-align-items: flex-end;
        align-items: flex-end;
        width: 810px;
        margin: 0 auto;
        .artist-name {
          display: -webkit-box;
          display: -webkit-flex;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          align-items: center;
          -webkit-box-pack: justify;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          height: 50px;
          padding-top: 9px;
          width: 686px;
          .avatar {
            margin-left: -124px;
            width: 124px;
            height: 100px;
            transition: all 0.2s ease-in-out 0s;
            img {
              display: block;
              width: 96px;
              height: 96px;
              position: relative;
              border-radius: 50%;
              flex: 0 0 auto;
              overflow: hidden;
              border-width: 2px;
              border-style: solid;
              border-color: rgb(255, 255, 255);
              border-image: initial;
              margin: -2px;
              border-radius: 150px;
            }
          }
          .name-line {
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            justify-content: space-between;
            width: 100%;
            .name {
              h1 {
                font-size: 20px;
                font-weight: bold;
                line-height: 1;
                color: rgba(0, 0, 0, 0.88);
                margin-right: 8px;
              }
            }

            .follow {
              display: -webkit-box;
              display: -webkit-flex;
              display: flex;
            }
          }
        }
        .artist-focus {
          margin-top: -4px;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 22px;
          height: 22px;
          width: 568px;
          padding-right: 118px;
          color: #999;
          display: flex;
        }
      }
      .artist-link {
        margin: 10px;
        text-align: center;
        display: flex;
        margin-bottom: 16px;
        width: 686px;
      }
    }
  }
  .artist_illu {
    display: block;
    padding-top: 36px;
    padding-bottom: 64px;
    max-width: 1224px;
    margin: 0px auto;
  }
  .icon {
    font-size: 30px;
    height: 36px;
    width: 36px;
    color: #5e6d82;
    cursor: pointer;
  }
  .tabs {
    text-align: center;
  }
  .comment {
    flex-basis: 100%;
    position: relative;
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.64);
    white-space: nowrap;
    overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      width: 32px;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgb(255, 255, 255)
      );
    }
  }
}
.end {
      cursor: pointer;
      text-align: right;
      color: #999;
      white-space: nowrap;
    }
</style>
