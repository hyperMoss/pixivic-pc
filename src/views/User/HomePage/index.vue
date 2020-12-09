
<template>
  <div class="home-page">
    <div
      v-if="userInfo"
      class="artist_property"
    >
      <div class="artist-base">
        <div class="artist-one">
          <div class="artist-name">
            <div class="avatar">
              <img
                :src="computerUserUrl"
                alt
              >
            </div>
            <div class="name-line">
              <div class="name">
                <h1>{{ userInfo.username }}</h1>
              </div>
              <!-- <div class="follow">
                <el-button
                  style="width:160px"
                  round
                  size="small"
                  @click="followArtist"
                >
                  {{ artistDetail.isFollowed ? $t('followed') : $t('follow') }}
                </el-button>
              </div> -->
            </div>
          </div>
        </div>
        <div class="artist-one">
          <div class="artist-focus">
            <span style="color: #999;">
              <em style="font-style:normal;color: #5C5C5C;font-weight: bold;">
                {{ userInfo.createDate.split("T")[0] }} </em>注册
            </span>
          </div>
        </div>
        <!-- <div class="artist-one" style="padding: 0 0 32px;">
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
              <div slot="reference" class="end">{{$t('openAll')}}</div>
            </el-popover>
          </div>
        </div> -->
        <!-- <div class="tabs" @change="getArtistList">
          <el-radio-group v-model="type">
            <el-radio-button label="illust" name="插画" />
            <el-radio-button label="manga" name="漫画" />
          </el-radio-group>
        </div> -->
        <CardList
          :collection-list="publicCollectionList"
          :power-flag="false"
          @on-scroll="getCollections"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CardList from 'components/Collections/CardList.vue';
export default {
  name: 'HomePage',
  components: { CardList },
  props: {
    userId: {
      required: true,
      type: [String]
    }
  },
  data() {
    return {
      type: '',
      userInfo: null,
      page: { publicPage: 1, pageSize: 10, total: 0 },
      publicCollectionList: []
    };
  },
  computed: { ...mapGetters(['user']) },
  watch: {},
  async mounted() {
    await this.getUsersInfo();
    this.getCollections();
  },
  methods: {
    computerUserUrl(){
      this.user.id
        ? `${process.env.VUE_APP_STATIC_API}${
          this.userInfo.id
        }.jpg`
        : ''
    },
    getArtistList() {},
    getUsersInfo() {
      this.$api.user.getUsers(this.userId).then(res => {
        const {
          data: { data }
        } = res;
        this.userInfo = data;
      });
    },
    getCollections() {
      this.$api.collect
        .getUserCollections({
          page: this.page.publicPage++,
          pageSize: this.page.pageSize,
          userId: this.userId,
          isPublic: 1
        })
        .then(res => {
          if (res.data.data) {
            this.publicCollectionList = this.publicCollectionList.concat(
              res.data.data
            );
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
.home-page {
  .tabs {
    text-align: center;
  }
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
}
</style>
