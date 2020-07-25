/*
 * @Author: Dongzy
 * @since: 2020-06-18 07:43:03
 * @lastTime: 2020-07-08 20:07:28
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\VirtualList\mixin.js
 * @message:
 */

export default {
  data() {
    return {
      // 视口区数据
      // 列数
      maxColumns: 4,
      // 间距(像素)
      spacing: 20,
      // 最后一列属性
      finalColumns: null,
      // 父级容器宽度
      parentWidth: null,
      // 画作父级容器高度
      containerHeight: 0,
      // 列宽
      columnsWidth: null,
      // 可视区域高度 160为默认值
      windowViewHeight: 0,
      // left 值
      locationLeft: null,
      // 请求图片数量
      requestImgNum: 40,

      // 画作数据

      /**
       * key 屏幕下标
       * value 元素队列
       */
      locationInfo: {
        '0': []
      },

      targetContainer: [],
      /**
       * 画作的top位置，每次排列一排之后完成后，根据这一排的信息获取下一排的top
       * null为初始状态，根据父级组件完成渲染后而改变
       */
      targetTopLocation: null,

      /**
       * 屏幕数据
       */

      // 屏幕总数量 个数
      screenAllNum: 1,
      // 当前第几屏幕 下标
      numIng: 0,
      // 上一次所在屏幕 下标
      oldNum: 0,
      // 当前加载的屏幕队
      loadingScreen: [0]
    };
  },
  mounted() {},
  methods: {
    // 添加到画集
    setCollect() {},
    /**
     * 通过父级组件的宽获取列宽
     */
    setColumnsWidth(width) {
      this.columnsWidth = Math.floor(
        (width - this.spacing * this.maxColumns) / this.maxColumns
      );
    },
    /**
     * 计算每列，中每个图片绝对定位下的left值
     */
    setLocationLeft() {
      this.columnsWidth += this.spacing;
      const newLeftLocation = [];
      for (let i = 0; i < this.maxColumns; i++) {
        newLeftLocation.push(this.columnsWidth * i + this.spacing / 2);
      }
      this.locationLeft = newLeftLocation;
      console.log(this.locationLeft);
    },
    /**
     * 当前文档流高度扩容
     */
    setWindowHeight(height) {
      this.windowViewHeight += height;
    },
    /**
     * 当前视窗容器高度扩容
     */
    updatecontainerHeight(height) {
      this.containerHeight = Math.max(this.containerHeight, height);
    },

    /**
     * 增加屏幕
     */
    addScreen() {
      this.screenAllNum++;
    },
    /**
     * 增加当前加载的屏幕队
     */
    addloadingScreen(screenAllNum) {
      const subscript = screenAllNum - 1;

      // 最多显示4个屏幕
      for (let i = 0; i < 4; i++) {
        const showScreen = subscript - i;
        if (showScreen < 0) {
          break;
        }
        // 用数组变异方法给当前屏幕加载队列赋值
        this.loadingScreen.splice(i, 1, showScreen);
      }
      // 返回新的显示数组
      return this.loadingScreen;
    },
    /**
     * 更新上一次的屏幕号
     */
    updataOldScreen(data) {
      this.oldNum = data;
    },
    /**
     * 更新现在的屏幕号
     */
    updateScreen(data) {
      this.numIng = data;
    },
    /**
     * 下滑改变屏幕队列
     */
    changeDownChange(data) {
      this.loadingScreen.splice(0, 1, data - 1);
      this.loadingScreen.splice(1, 1, data);
      this.loadingScreen.splice(2, 1, data + 1);
      this.loadingScreen.splice(3, 1, data + 2);
      return this.loadingScreen;
    },

    /**
     * 上滑改变屏幕队列
     */
    changeUpChange(data) {
      this.loadingScreen.splice(0, 1, data - 2);
      this.loadingScreen.splice(1, 1, data - 1);
      this.loadingScreen.splice(2, 1, data);
      this.loadingScreen.splice(3, 1, data + 1);
      return this.loadingScreen;
    },

    /**
     * 画作部分函数
     */

    /**
     * 添加画作
     */
    addlocationInfo(data) {
      const { screenNumIng, imgData } = data;
      this.locationInfo[screenNumIng.toString()].push(imgData);
    },
    /**
     * 容器存储画作
     */
    setTargetContainer(data) {
      const getTarget = data.map(item => {
        return { targetId: item.targetId, positionInfo: item };
      });
      return this.targetContainer.concat(getTarget);
    },
    /**
     * 初始化top
     */
    initTop(data) {
      this.targetTopLocation = new Array(data).fill(0);
    },
    /**
     * 更新top值
     */
    setTop(columnsNum, height) {
      this.targetTopLocation.splice(
        columnsNum,
        1,
        this.targetTopLocation[columnsNum] + height
      );
      return this.targetTopLocation;
    },
    /**
     * 添加位置信息
     */
    addlocationInfoNum(data) {
      this.$set(this.locationInfo, data.toString(), []);
      return this.locationInfo;
    }
  }
};
