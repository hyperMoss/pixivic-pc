<!--
 * @Author: Dongzy
 * @since: 2020-06-17 23:01:27
 * @lastTime: 2020-06-18 00:27:36
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\components\VirtualList\index.vue
 * @message: 
--> 

<template>
  <div class="index"></div>
</template>

<script>
export default {
  name: 'VirtualList',
  data() {
    return {
      arrangeProperties: {
        //列数
        maxColumns: 5,
        //间距(像素)
        spacing: 10,
        //最后一列属性
        finalColumns: null,
        //父级容器宽度
        parentWidth: null,
        //机器人父级容器高度
        containerHeight: 0,
        //列宽
        columnsWidth: null,
        //可视区域高度 160为默认值
        windowViewHeight: 0,
        //left 值
        locationLeft: null,
        //请求图片数量
        requestImgNum: 40,
      },
      robot: {
        /**
         * key 屏幕下标
         * value 元素队列
         */
        locationInfo: {
          ['0']: [],
        },

        /**
         * 机器人的top位置，每次排列一排之后完成后，根据这一排的信息获取下一排的top
         * null为初始状态，根据父级组件完成渲染后而改变
         */
        robotTopLocation: null,
      },
      screen: {
        //屏幕总数量 个数
        allNum: 1,
        //当前第几屏幕 下标
        numIng: 0,
        //上一次所在屏幕 下标
        oldNum: 0,
        //当前加载的屏幕队
        loadingScreen: [0],
      },
    };
  },
  computed: {},
  components: {},
  watch: {},
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="less">
.index {
}
</style>
