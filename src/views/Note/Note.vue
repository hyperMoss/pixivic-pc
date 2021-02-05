<template>
  <div class="note">
    <div class="content-list">
      <el-card>
        <el-collapse
          v-model="activeNames"
          @change="handleChange"
        >
          <el-collapse-item
            v-for="(item, index) in noteInfo"
            :key="item.title"
            :name="index"
          >
            <template slot="title">
              <span class="title">{{ item.title }}</span>
            </template>
            <ul class="list">
              <li
                v-for="e in item.content"
                :key="e"
              >
                {{ e }}
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item :name="6">
            <template slot="title">
              <span class="title">开发人员</span>
            </template>
            <div class="devs">
              <a
                v-for="dev of devsInfo"
                :key="dev.herf"
                style="cursor: pointer;margin-right:20px;"
                :href="dev.href"
                target="_Blank"
              >
                <el-avatar
                  shape="square"
                  size="medium"
                  :src="dev.src"
                />
              </a>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Note',
  components: {},
  data() {
    return {
      activeNames: [0],
      // 相关信息
      noteInfo: [
        {
          title: '关于',
          content: [
            '出生于2018-10-01，是一位兴趣使然的工具酱。',
            '她天然，精致（ui统一），敏捷（前后分离&纯js）。',
            '',
            '',
            '',
          ],
        },
        {
          title: '浏览器的使用',
          content: [
            '诸如chrome(谷歌浏览器)，uc浏览器，qq浏览器等的主流浏览器。',
            '请勿使用百度知道App与任何应用的内置的浏览器访问本站点。',
          ],
        },
        {
          title: '搜索跳转的兼容性',
          content: [
            '首页直接搜索跳转的兼容性不佳，若在首页跳转后的搜索结果并不是你想要的，在该页面重新键入搜索词回车即可。',
          ],
        },
        {
          title: '关于日排行',
          content: [
            '默认最新一期为当前日期前天的排行数据，点击右下角工具可进行日期的选定。',
          ],
        },
        {
          title: '图片的浏览与保存',
          content: ['点击图片可查看原图，在原图上右键即可弹出保存菜单'],
        },

      ],
      // 开发人员
      devsInfo: [
        {
          href: 'https://www.oysterqaq.com/',
          src: require('@/assets/images/OysterQAQ.jpg'),
        },
        {
          href: 'https://github.com/kimliy',
          src: require('@/assets/images/kimliy.jpg'),
        },
        {
          href: 'https://www.ariussss.com/',
          src: require('@/assets/images/Arius.jpg'),
        },
        {
          href: 'https://github.com/hyperMoss',
          src: require('@/assets/images/tiger.jpg'),
        },
        {
          href: 'https://github.com/goblinM',
          src: require('@/assets/images/mmx.jpg'),
        },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="less">
.note {
  min-height: calc(~"100vh - 60px");
  max-height:calc(~"100vh - 60px");
  width: calc(~"100vw - 65px");
  overflow: auto;
  .content-list {
    width: 50%;
    margin: 20px auto;
    .list {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .title {
      font-size: 22px;
      font-weight: 400;
      color: #1f2d3d;
    }
    .devs {
      display: flex;
    }
  }
}
</style>
