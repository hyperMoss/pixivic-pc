
<template>
  <div class="CardList">
    <div
      v-if="!collectionList.length"
      style="margin:50px auto;width:200px;text-align:center;"
    >
      <svg
        font-size="160"
        class="icon"
        aria-hidden="true"
      >
        <use xlink:href="#pickongtai1" />
      </svg>
      <p style="color: #E3F2FA; font-size: 20px;">
        没有内容
      </p>
    </div>
    <div
      v-infinite-scroll="getCollections"
      class="list-grid"
      infinite-scroll-delay="1000"
      infinite-scroll-immediate
    >
      <div
        v-for="item in collectionList"
        :key="item.id"
        :body-style="{ padding: '0px' }"
      >
        <div class="card-body">
          <div
            class="image-area"
            @click="goInfoPage(item)"
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
              lazy
              fit="cover"
              :src="`${staticUrl}40655.jpg?t=1590334915989`"
            />
          </div>

          <div class="text-area">
            <time class="time">{{ item.createTime.split("T")[0] }}</time>
            <h3 @click="goInfoPage(item)">
              {{ item.title }}
            </h3>
            <div>
              <p class="desc">
                {{ item.caption }}
              </p>
              <p class="tag-list">
                <el-tag
                  v-for="tag in item.tagList"
                  :key="tag.tagName"
                  :disable-transitions="false"
                  @click="clickTag(tag)"
                >
                  {{ tag.tagName }}
                </el-tag>
              </p>
              <el-dropdown
                v-if="powerFlag"
                class="setting"
              >
                <span>
                  <i class="el-icon-setting" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="modifyCollect(item)"
                  >
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="deletCollect(item)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateCollect
      v-if="createCollectBoolean"
      :collect-data="collectData"
      :show-boolean="createCollectBoolean"
      @on-cancel="handleStartCollect"
      @on-success="handleAddSuccess"
    />
  </div>
</template>

<script>
import CreateCollect from 'components/Collections/CreateCollect.vue';
export default {
  name: 'CardList',
  components: { CreateCollect },
  props: ['collectionList', 'powerFlag'],
  data() {
    return { createCollectBoolean: false, collectData: null,staticUrl:process.env.VUE_APP_STATIC_API };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    clickTag(val) {
      this.$router.push({
        path: `/keywords`,
        query: {
          tag: val.tagName
        }
      });
    },
    handleAddSuccess(e, flag) {
      this.handleStartCollect();
      if (flag === 2) {
        let target = this.collectionList[
          this.collectionList.findIndex(item => item.id === e.id)
        ];
        target = Object.assign(target, e);
      }
    },
    handleStartCollect() {
      this.collectData = null;
      this.createCollectBoolean = !this.createCollectBoolean;
    },
    goInfoPage(item) {
      this.$store.dispatch('setCollectInfo', item);
      this.$router.push({
        path: `/collect/collectionsillust/${item.id}`,
        query: { collectionId: item.id }
      });
    },
    getCollections() {
      this.$emit('on-scroll');
    },
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
    }
  }
};
</script>

<style scoped lang="less">
.CardList {
  .card-body {
    position: relative;
    display: flex;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.6s;
    &:hover {
      box-shadow: 0 5px 10px 5px rgba(110, 110, 110, 0.4);
      .image {
        transform: scale(1.1);
        pointer-events: none;
      }
    }
    &:in-range {
      transform: scale(1.1);
    }

    .image-area {
      width: 400px;
      height: 300px;
      display: block;
      overflow: hidden;
      .image {
        width: 100%;
        height: 100%;
        transition: all 0.6s linear;
      }
    }
    .text-area {
      width: 198px;
      margin: 10px 20px;
      .time {
        color: #888;
        font-size: 12px;
      }
      h3 {
        margin: 18px 0;
        &:hover {
          color: @color-main;
        }
      }
      .desc {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        height: 60px;
        overflow: hidden;
      }
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        height: 80px;
        .el-tag + .el-tag {
          margin-left: 10px;
        }
      }
    }
  }

  .setting {
    font-size: 20px;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .list-grid {
    list-style: none;
    display: grid;
    gap: 24px;
    flex-wrap: wrap;
    // grid-template-columns: repeat(auto-fit, 800px);
    grid-template-columns: repeat(auto-fill, 500px);
    -webkit-box-pack: center;
    justify-content: center;
    margin: 20px;
    padding: 0px;
  }
}
</style>
