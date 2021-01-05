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
            '将提供以下有限的服务：pixiv日排行的浏览与免费高级会员热门排序搜索。',
            '她希望能在茫茫互联网留下一些存在的痕迹，翘首以盼大家能通过各大搜索引擎访问她（将有助于提升她的搜索排名），搜索关键词：Pixiv、pixiv、P站、p站。',
            '前端项目地址 https://github.com/cheer-fun/pixivic-pc',
            '后端项目地址 https://github.com/OysterQAQ/Pixiv-Illustration-Collection-Backend',
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
        {
          title: '图片版权',
          content: [
            '本站服务器不会存放任何图片文件，搜索模块仅是实时转发p站图片，排行图片则是托管于各大图床。',
            '已在详情页标注出插画作者以及介绍信息，点击大图可跳转该作品在pixiv的所属页面',
            '由于精力有限不可能逐一询问画师是否愿意转载，若有侵权行为还请告知',
            '（邮箱：oysterqaq@gmail.com），出示证明后侵权部分将会被删除。',
          ],
        },
        {
          title: '商务合作、广告投放（不接受广告联盟）',
          content: [
            '联系QQ：392822872',
          ],
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
