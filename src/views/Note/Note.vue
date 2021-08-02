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
/*          title: '关于',
          content: [
            '出生于2018-10-01，是一位兴趣使然的工具酱。',
            '她天然，精致（ui统一），敏捷（前后分离&纯js）。',

            '她希望能在茫茫互联网留下一些存在的痕迹，翘首以盼大家能通过各大搜索引擎访问她（将有助于提升她的搜索排名），搜索关键词：Pixiv、pixiv、P站、p站。',
            '前端项目地址 https://github.com/cheer-fun/pixivic-pc',
            '后端项目地址 https://github.com/OysterQAQ/Pixiv-Illustration-Collection-Backend',
          ],
        },*/
        {
          title: '浏览器的使用',
          content: [
            '诸如chrome(谷歌浏览器)，uc浏览器，qq浏览器等的主流浏览器。',

          ],
        },
        {
          title: '联系方式',
          content: ['联系邮箱：oysterqaq@gmail.com'],
        }

      ],
      // 开发人员
/*      devsInfo: [
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
      ],*/
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
