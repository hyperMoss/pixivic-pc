<!--
 * @Author: gooing
 * @since: 2020-01-28 23:11:51
 * @lastTime: 2020-06-21 23:40:18
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\views\DailyRank\DailyRank.vue
 * @message:
 -->
<template>
  <div class="DailyRank">
    <virtual-list
      v-if="fatherMounted"
      :key="identifier"
      :get-data-ajax="getData"
      @infinite="infinite"
    >
      <el-popover
        placement="left"
        style="position:fixed;z-index:999;right:40px;bottom:20px;"
        trigger="hover"
        width="300"
      >
        <div style="text-align:center;width:100%;height:100%;">
          <el-radio v-model="modeFather" label="0">综合排行</el-radio>
          <el-radio v-model="modeFather" label="1">漫画排行</el-radio>
          <el-radio-group
            v-model="mode"
            size="mini"
            style="padding: 20px 0;"
            @change="resetData"
          >
            <el-radio-button
              v-for="radioItem of modeList[modeFather].children"
              :key="radioItem.name"
              :label="radioItem.value"
            >{{ radioItem.name }}</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="value2"
            :picker-options="pickerOptions"
            align="right"
            placeholder="选择日期"
            type="date"
            value-format="yyyy-MM-dd"
            @change="selectDate"
          />
        </div>
        <div slot="reference">
          <svg :aria-hidden="true" class="icon" font-size="40">
            <use xlink:href="#picshizhong1" />
          </svg>
        </div>
      </el-popover>
    </virtual-list>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import VirtualList from '@/components/VirtualList/index';

export default {
  name: 'DailyRank',
  components: {
    VirtualList
  },
  data() {
    return {
      fatherMounted: false,
      modeFather: '0',
      modeList: [
        {
          name: '综合排行',
          children: [
            { name: '日', value: 'day' },
            { name: '周', value: 'week' },
            { name: '月', value: 'month' },
            { name: '女性', value: 'female' },
            { name: '男性', value: 'male' }
          ]
        },
        {
          name: '漫画排行',
          children: [
            { name: '日排行', value: 'day_manga' },
            { name: '周排行', value: 'week_manga' },
            { name: '月排行', value: 'month_manga' },
            { name: '新秀周排行', value: 'week_rookie_manga' }
          ]
        }
      ],
      page: 1,
      mode: 'day',
      date: dayjs(new Date())
        .add(-3, 'days')
        .format('YYYY-MM-DD'),
      pictureList: [],
      identifier: +new Date(),
      value2: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    localStorage.setItem('waterfull-column', 4);
    this.fatherMounted = true;
  },
  methods: {
    infinite($state) {
      this.$api.rank
        .getRank({
          page: this.page++,
          date: this.date,
          mode: this.mode
        })
        .then(res => {
          if (!res.data.data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(res.data.data);
            $state.loaded();
          }
        });
    },
    changeData(e) {
      console.log(e);
    },
    getData() {
      return this.$api.rank
        .getRank({
          page: this.page++,
          date: this.date,
          mode: this.mode
        });
    },
    resetData() {
      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;
    },
    selectDate(date) {
      this.date = date;
      this.resetData();
    },
    selectMode() {
      this.resetData();
    }
  }
};
</script>

<style scoped lang="less">
.DailyRank {
  height: calc(~"100vh - 60px");
  overflow-y: hidden;
  width: calc(~"100%");
  display: flex;
  justify-content: center;
}
</style>
