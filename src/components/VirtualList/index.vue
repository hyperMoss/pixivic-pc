<!--
 * @Author: Dongzy
 * @since: 2020-06-17 23:01:27
 * @lastTime: 2020-06-18 07:43:17
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\VirtualList\index.vue
 * @message: 
--> 

<template>
  <div class="index">
    <div
      class="container"
      ref="container"
    />
  </div>
</template>

<script>
import mixin from './mixin';
import { getScrollTop, getScrollHeight, getWindowHeight } from './tool';
export default {
  mixins: [mixin],
  name: 'VirtualList',
  data() {
    return {};
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    init() {
      //获取组件父级宽
      const contWidth = this.$refs['container'].clientWidth;
      //通过组件宽获取列宽
      this.setColumnsWidth(contWidth);

      //获取可视区域高度
      this.setWindowHeight(document.documentElement.clientHeight);

      //获取left坐标
      this.setlocationLeft();

      //定位初始化top值
      this.setInitTop(this.maxcolumns);

      this.getNewImg().then(() => (window.onscroll = () => this.scrollAction()));
    },
    //新资源
    getNewImg(getNoShowRobotListNum) {
      return this.getNewImgData(this.requestImgNum).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          //获取机器人id
          let robotId = this.generatorId({ i, getNoShowRobotListNum });
          let beyond = this.positioning(res.data[i], robotId);
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
      //屏幕总数
      let screenAllNum = this.screenAllNum;
      //定位与列数一直时 换行
      this.state.positioningNum == this.maxcolumns ? (this.state.positioningNum = 0) : null;
      //图片原始宽度
      const imgWidth = element.width;
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
      this.upContainerHeight(topNum);
      //获取所放置的屏幕号 下标
      let srceenIng = screenAllNum - 1;
      //创建
      this.addlocationInfo(element, robotId, srceenIng);
      //增长
      this.state.positioningNum++;
      //top大于当前屏幕高度 则增加屏幕
      if (element.top > this.windowViewHeight * screenAllNum) {
        //超出高度 则不管了
        return 'beyond';
      }
    },

    scrollAction() {
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

        //获取未显示的机器人屏幕下标
        const getNoShowRobotListNum = this.screenAllNum - 4;

        this.getNewImg(getNoShowRobotListNum < 1 ? undefined : getNoShowRobotListNum - 1);
      }
    },
    //随机id
    performanceId() {
      return performance
        .now()
        .toString()
        .substring(0, 6);
    },

    /**
     * 生成机器人id
     */
    generatorId(getInfo) {
      //没有给已知下标，则新建
      if (!getInfo.getNoShowRobotListNum && getInfo.getNoShowRobotListNum != 0) {
        return this.performanceId();
      }

      const getNoShowRobotListNum = getInfo.getNoShowRobotListNum.toString();

      const i = getInfo.i.toString();

      const domInfo = this.locationInfo([getNoShowRobotListNum, i]);

      return domInfo ? domInfo.robotid : this.performanceId();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="less">
.index {
}
</style>
