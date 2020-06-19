<!--
 * @Author: Dongzy
 * @since: 2020-06-17 23:01:27
 * @lastTime: 2020-06-18 22:54:46
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\VirtualList\index.vue
 * @message:
-->

<template>
  <div class="index">
    <div
      ref="container"
      class="container"
      :style="{height:containerHeight}"
    >
      <Item v-for="item in renderRobot" :key="item.id" :column="item" @handleLike="handleLike" @handle-collect="setCollect" />
    </div>
    <slot />
    <infinite-loading :identifier="identifier" @infinite="infiniteHandler">
      <div slot="no-more" />
      <div slot="no-results" style="marginTop: 50px;">
        <svg font-size="160" class="icon" aria-hidden="true">
          <use xlink:href="#pickongtai1" />
        </svg>
        <p style="color: #E3F2FA; font-size: 20px;">没有内容</p>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import dayjs from 'dayjs';
import mixin from './mixin';
import Item from './Item';
import { getScrollTop, getScrollHeight, getWindowHeight } from './tool';
import { randomColor, replaceBigImg, replaceSmallImg } from '@/util';
export default {
  name: 'VirtualList',
  components: { Item, InfiniteLoading },
  mixins: [mixin],
  props: {
    listWidth: {
      type: Number,
      default: 0,
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
      columnHeight: [],
    };
  },
  computed: {
    renderRobot() {
      const loadingScreen = this.loadingScreen;

      let robotList = null;
      //遍历当前应该显示的屏幕下标号
      loadingScreen.forEach(element => {
        //通过屏幕号码获取信息
        const locationInfo = this.locationInfo[element.toString()];

        //排除undefined
        if (!locationInfo) {
          return;
        }
        robotList = robotList ? robotList.concat(locationInfo) : locationInfo;
      });
      return robotList;
    }
  },
  watch: {
    list: {
      handler(val, old) {
        try {
          if (val.length === 0) {
            this.columnHeight = new Array(this.column).fill(0);
          } else {
            this.handleList(val);
          }
        } catch (error) {
          console.log(error, '*******');
        }
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleLike() {},
    setCollect() {},
    //显示屏幕号 change
    changeScreen(screenNumIng) {
      //update oldScreen
      this.changeOldNum(this.numIng);

      //update screenIng
      this.changeScreen(screenNumIng);

      if (screenNumIng > this.oldNum) {
        const newShowScreenNum = screenNumIng + 2;

        (this.loadingScreen.indexOf(newShowScreenNum) === -1)
          ? this.downChange(screenNumIng)
          : null;
      } else if (screenNumIng < this.oldNum) {
        const newShowScreenNum = screenNumIng - 2;

        (this.loadingScreen.indexOf(newShowScreenNum) === -1)
          ? this.upChange(screenNumIng)
          : null;
      }
    },
    // 触发加载
    infiniteHandler($state) {
      const windowHeight = getWindowHeight();

      const scrollTop = getScrollTop() + windowHeight;

      const screenNumIng = Math.floor(scrollTop / windowHeight) - 1;

      if (screenNumIng !== this.numIng) {
        this.changeScreen(screenNumIng);
      }

      if (scrollTop === getScrollHeight()) {
        //增加下一个屏幕的元素队列
        this.addlocationInfoNum(this.screenAllNum);

        //增加屏幕
        this.addScreen();

        //增加当前加载的屏幕队
        this.addloadingScreen(this.screenAllNum);
        this.$emit('infinite', $state);
      }
    },
    // 处理数据
    handleList(list) {
      for (let i = 0; i < list.length; i++) {
        try {
          const tmp = list[i];
          const robotId = tmp.id;
          if (tmp['_handled']) {
            continue;
          } else {
            tmp['src'] = replaceSmallImg(tmp.imageUrls[0].medium);
            tmp['setu'] = false;
            tmp['style'] = {
              backgroundColor: randomColor(),
            };
            tmp['avatarSrc'] = replaceBigImg(tmp.artistPreView.avatar);
            tmp['createDate'] = dayjs(tmp.createDate).format('YYYY-MM-DD');
            tmp['originalSrc'] = replaceBigImg(tmp.imageUrls[0].original);
            tmp['isad'] = tmp.type === 'ad_image' || tmp.type === 'donate';
            tmp['_handled'] = true;
          }
          const beyond = this.positioning(tmp, robotId);
          if (beyond) {
            break;
          }
        } catch (error) {
          console.log(error, '!!!!!!!!!!!');
        }
      }
    },
    // 初始化
    init() {
      //获取组件父级宽
      const contWidth = this.$refs['container'].clientWidth;
      //通过组件宽获取列宽
      this.setColumnsWidth(contWidth);

      //获取可视区域高度
      this.setWindowHeight(document.documentElement.clientHeight);

      //获取left坐标
      this.setLocationLeft();

      //定位初始化top值
      this.initTop(this.maxcolumns);

      // window.onscroll = () => this.scrollAction();
      // this.getNewImg().then(window.onscroll = () => this.scrollAction());
    },

    /**
     * 获取新资源
     */
    getNewImg(getNoShowRobotListNum) {
      return this.$api.rank
        .getRank({
          page: this.page++,
          date: this.date,
          mode: this.mode
        }).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            const beyond = this.positioning(res.data[i], robotId);

            if (beyond) {
              break;
            }
          }
        });
    },
    /**
     * 增加的时候开始 定位
     */
    positioning(element, robotId) {
      try {
        //屏幕总数
        const screenAllNum = this.screenAllNum;
        //定位与列数一直时 换行
        this.positioningNum === this.maxcolumns ? (this.positioningNum = 0) : null;
        //图片原始宽度
        const imgWidth = element.width || 200;
        //列宽限定
        const columnsWidth = this.columnsWidth;
        //计算出图片在进入dom后的高度
        const imgHeight = (columnsWidth / imgWidth) * element.height;

        element.domHeight = imgHeight;
        //宽
        element.domWidth = columnsWidth;
        const robotTopLocation = this.robotTopLocation;
        //获取top数组中最小的座位下标
        const minTopNum = robotTopLocation.indexOf(Math.min.apply(Math, robotTopLocation));
        //获取top值
        element.top = robotTopLocation[minTopNum];
        //获取left值
        element.left = this.locationLeft[minTopNum];
        //位列一行中第几位
        element.columnsNum = minTopNum;
        //设定下一个同列图片的top
        this.setTop(minTopNum, imgHeight);
        const topNum = this.robotTopLocation[minTopNum];
        this.updateContainerHeight(topNum);
        //获取所放置的屏幕号 下标
        const srceenIng = screenAllNum - 1;
        //创建
        this.addlocationInfo({ imgData: element, robotId, screenNumIng: srceenIng });
        //增长
        this.positioningNum++;
        //top大于当前屏幕高度 则增加屏幕
        if (element.top > this.windowViewHeight * screenAllNum) {
        //超出高度 则不管了
          return 'beyond';
        }
      } catch (error) {
        console.log(error, '???????');
      }
    },

    scrollAction() {

    },
  }
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  position: relative
}
.index{
  width:100%;
}
</style>
