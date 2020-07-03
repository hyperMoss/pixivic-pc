<!--
 * @Author: Dongzy
 * @since: 2020-06-17 23:01:27
 * @lastTime: 2020-06-26 10:47:17
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\VirtualList\index.vue
 * @message:
-->

<template>
  <div ref="warp" class="index" @scroll="scrollAction">
    <slot />
    <div
      ref="container"
      v-infinite-scroll="scrollToDep"
      class="container"
      style="position: relative;width: 1000px;"
      :style="{height:containerHeight +'px'}"
      infinite-scroll-delay
      :infinite-scroll-disabled="isDone"
      infinite-scroll-immediate
    >

      <Item v-for="item in renderList" :key="item.id" :column="item" @handleLike="handleLike" @handle-collect="setCollect" />

      <div v-if="isDone" style="marginTop: 50px;">
        <svg font-size="160" class="icon" aria-hidden="true">
          <use xlink:href="#pickongtai1" />
        </svg>
        <p style="color: #E3F2FA; font-size: 20px;">没有内容</p>
      </div>
      <p
        v-if="isDone"
        style="position: absolute;bottom: 20px;text-align: center;width: 1000px;;"
      >没有更多了</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import mixin from './mixin';
import Item from './Item';
import { randomColor, replaceBigImg, replaceSmallImg } from '@/util';
export default {
  name: 'VirtualList',
  components: { Item },
  mixins: [mixin],
  props: {
    listWidth: {
      type: Number,
      default: 0,
    },
    getDataAjax: {
      type: Function,
      required: true
    },
    lsitHeight: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    identifier: {
      type: Number,
      default: +new Date(),
    },
  },
  data() {
    return {
      isDone: false,
      loading: false
    };
  },
  computed: {
    ...mapGetters(['user']),
    renderList() {
      const loadingScreen = this.loadingScreen;

      let targetList = null;
      //遍历当前应该显示的屏幕下标号
      loadingScreen.forEach(element => {
        //通过屏幕号码获取信息
        const locationInfo = this.locationInfo[element.toString()];
        //排除undefined
        if (!locationInfo) {
          return;
        }
        targetList = targetList ? targetList.concat(locationInfo) : locationInfo;
      });
      return targetList;
    },
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    // 点击收藏
    handleLike(data) {
      if (!this.user.id) {
        this.$message.closeAll();
        this.$message.info('请先登录');
        return;
      }
      const flag = data.isLiked;
      const params = {
        userId: this.user.id,
        illustId: data.id,
        username: this.user.username
      };
      if (!flag) {
        this.$set(data, 'isLiked', true); // 先强制视图更新 防止网络延迟不动
        this.$store.dispatch('handleCollectIllust', params)
          .then(() => {})
          .catch(() => {
            this.$set(data, 'isLiked', false); // 失败的话在改回去
            this.$message.closeAll();
            this.$message.error('收藏失败');
          });
      } else {
        this.$set(data, 'isLiked', false);
        this.$store.dispatch('deleteCollectIllust', params)
          .then(() => {})
          .catch(() => {
            this.$set(data, 'isLiked', true);
            this.$message.closeAll();
            this.$message.error('取消收藏失败');
          });
      }
    },
    //显示屏幕号 change
    localChangeScreen(screenNumIng) {
      //update oldScreen
      this.updataOldScreen(this.numIng);

      //update screenIng
      this.updateScreen(screenNumIng);

      if (screenNumIng > this.oldNum) {
        const newShowScreenNum = screenNumIng + 2;

        (this.loadingScreen.indexOf(newShowScreenNum) === -1)
          ? this.changeDownChange(screenNumIng)
          : null;
      } else if (screenNumIng < this.oldNum) {
        const newShowScreenNum = screenNumIng - 2;

        (this.loadingScreen.indexOf(newShowScreenNum) === -1)
          ? this.changeUpChange(screenNumIng)
          : null;
      }
    },
    // 初始化
    init() {
      //获取组件父级宽
      const contWidth = this.$refs['container'].clientWidth;
      //通过组件宽获取列宽
      this.setColumnsWidth(contWidth);

      //获取可视区域高度
      this.setWindowHeight(this.$refs['warp'].clientHeight);

      //获取left坐标
      this.setLocationLeft();

      //定位初始化top值
      this.initTop(this.maxColumns);
      // this.$refs['warp'].addEventListener('scroll', this.scrollAction, false);
      this.getNewImg();
    },
    async scrollAction($event) {
      const windowHeight = this.$refs['warp'].clientHeight;

      const scrollTop = $event.target.scrollTop + windowHeight;

      const screenNumIng = (Math.floor(scrollTop / windowHeight)) - 1;
      console.log(screenNumIng, this.numIng, this.loadingScreen, this.locationInfo);
      if (screenNumIng !== this.numIng) {
        this.localChangeScreen(screenNumIng);
      }
    },

    async scrollToDep() {
      //增加下一个屏幕的元素队列
      await this.addlocationInfoNum(this.screenAllNum);
      //增加屏幕
      await this.addScreen();
      //增加当前加载的屏幕队
      await this.addloadingScreen(this.screenAllNum);
      // 请求数据
      this.getNewImg();
    },
    /**
     * 获取新资源
     */
    getNewImg() {
      return this.getDataAjax().then(res => {
        if (!res.data.data) {
          this.isDone = true;
          this.screenAllNum--;
        } else {
          for (let i = 0; i < res.data.data.length; i++) {
            if(!!((res.data.data[i].xrestrict === 1 || res.data.data[i].sanityLevel >= 4))){
             continue;
            }
            const boyend = this.positioning(res.data.data[i], res.data.data[i].id);
            if (boyend) {
              break;
            }
          }
        }
      });
    },
    /**
     * 增加的时候开始 定位
     */
    positioning(element, targetId) {
      try {
        const screenAllNum = this.screenAllNum;
        //定位与列数一直时 换行
        this.positioningNum === this.maxColumns ? (this.positioningNum = 0) : null;
        //图片原始宽度
        const imgWidth = element.width || 200;
        //列宽限定
        const columnsWidth = this.columnsWidth;
        //计算出图片在进入dom后的高度
        const imgHeight = (columnsWidth / imgWidth) * element.height;
        element.domHeight = imgHeight - 10;
        //宽
        element.domWidth = columnsWidth - 10;
        const targetTopLocation = this.targetTopLocation;
        //获取top数组中最小的座位下标
        const minTopNum = targetTopLocation.indexOf(Math.min.apply(Math, targetTopLocation));
        //获取top值
        element.top = Math.floor(targetTopLocation[minTopNum]);
        //获取left值
        element.left = this.locationLeft[minTopNum];
        //位列一行中第几位
        element.columnsNum = minTopNum;
        //设定下一个同列图片的top
        this.setTop(minTopNum, imgHeight);
        const topNum = this.targetTopLocation[minTopNum];
        this.updatecontainerHeight(topNum);
        //获取所放置的屏幕号 下标
        const srceenIng = screenAllNum - 1;
        if (!element['_handled']) {
          element['src'] = replaceSmallImg(element.imageUrls[0].medium);
          element['setu'] = false;
          element['style'] = {
            backgroundColor: randomColor(),
          };
          element['id'] = targetId;
          element['avatarSrc'] = replaceBigImg(element.artistPreView.avatar);
          element['createDate'] = dayjs(element.createDate).format('YYYY-MM-DD');
          element['originalSrc'] = replaceBigImg(element.imageUrls[0].original);
          if (element.type === 'ad_image' || element.type === 'donate') {
            element['isad'] = true;
            element['id'] = element.id + Date.now().toString();
          }
          element['_handled'] = true;
        }
        //创建
        this.addlocationInfo({ imgData: element, screenNumIng: srceenIng });
        //增长
        this.positioningNum++;
        //top大于当前屏幕高度 则增加屏幕
        if (element.top > this.windowViewHeight * screenAllNum) {
          //超出高度 则不管了
          return true;
        }
      } catch (error) {
        console.log(error, '???????');
      }
    },

  }
};
</script>

<style scoped lang="less">
.container {

}
.index{
  height: 100%;
  width: 100%;
  display:flex;
  position: relative;
  overflow-y: auto;
  justify-content: center;
}
</style>
