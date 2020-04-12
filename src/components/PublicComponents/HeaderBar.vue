<!--
 * @Author: gooing
 * @since: 2020-01-24 22:48:37
 * @lastTime: 2020-04-07 23:21:45
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\components\PublicComponents\HeaderBar.vue
 * @message:
 -->
<template>
  <div class="HeaderBar">
    <el-row
      align="middle"
      justify="space-around"
      style="width:100%;"
      type="flex"
    >
      <el-col>
        <a href="/">
          <img alt src="@/assets/images/icon.svg">
        </a>
      </el-col>
      <el-col>
        <el-autocomplete
          v-model="params.keyword"
          :debounce="300"
          :fetch-suggestions="querySearch"
          :maxlength="30"
          class="input-with-select"
          placeholder="搜索作品"
          @keyup.enter.native="handleSearch"
          @select="handleSelect"
        >
          <el-select slot="prepend" v-model="params.illustType" @change="handleSelect">
            <el-option
              v-for="item of typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-autocomplete>
      </el-col>
      <el-col class="header-info">
        <!-- <el-badge :value="3">
          <el-button size="small">消息</el-button>
        </el-badge> -->
        <div style="margin-left:20px;" @click="userOpen">
          <el-dropdown v-if="user.id" trigger="click" :disabled="!user.id" @command="clickMenu">
            <el-avatar fit="cover" :src="user.id ? `https://pic.cheerfun.dev/${user.id}.png?t=${new Date().getTime()}` : ''" shape="square" />
            <el-dropdown-menu slot="dropdown">
              <template>
                <el-dropdown-item
                  v-for="item of MenuList"
                  :key="item.handler"
                  :divided="item.divided"
                  :command="item.handler"
                >{{ item.name }}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-avatar v-else icon="el-icon-user-solid" fit="cover" shape="square" />
        </div>
      </el-col>
    </el-row>
    <SetDialog
      v-if="settingVisible"
      :setting-visible.sync="settingVisible"
      :user="user"
    />
  </div>
</template>

<script>
import cookieTool from 'js-cookie';
import { mapGetters } from 'vuex';
import SetDialog from './Setting/index';
export default {
  name: 'HeaderBar',
  components: {
    SetDialog
  },
  data() {
    return {
      // 用户中心数据
      MenuList: [
        {
          name: '关注',
          handler: 'followed'
        },
        {
          name: '收藏',
          handler: 'bookmarked'
        },
        {
          name: '设置',
          handler: 'setting'
        },
        {
          name: '退出登录',
          handler: 'logout',
          divided: true
        }
      ],
      // 设置控制显示
      settingVisible: false,
      // 搜索时延
      timeout: null,
      params: {
        keyword: '',
        illustType: 'illust'
      },
      keywords: [],
      squareUrl:
        'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      typeList: [
        {
          name: '插图',
          value: 'illust'
        },
        {
          name: '漫画',
          value: 'manga'
        },
        {
          name: '作者',
          value: 'artist'
        }
      ]
    };
  },
  computed: {
    // 辅助函数取出x内用户信息
    ...mapGetters(['user'])
  },
  watch: {
    'params.keyword': {
      handler: 'getKeywords'
    }
  },
  mounted() {},
  methods: {
    clickMenu(type) {
      switch (type) {
        case 'followed':
          this.toFollowed();
          break;
        case 'bookmarked':
          this.toBookmarked();
          break;
        case 'setting':
          this.setModal();
          break;
        case 'logout':
          this.logout();
          break;

        default:
          break;
      }
    },
    // 跳转关注页
    toFollowed() {
      this.$router.push({
        path: '/users/followed',
        query: {
          userId: this.user.id
        }
      });
    },
    // 跳转书签页
    toBookmarked() {
      this.$router.push({
        path: '/users/bookmarked'
      });
    },
    // 设置弹窗
    setModal() {
      this.settingVisible = !this.settingVisible;
    },
    // 退出登录
    logout() {
      this.$confirm('确认退出？')
        .then(_ => {
          this.$message.info('退出登录');
          cookieTool.remove('jwt');
          this.$store.dispatch('clearCurrentState');
          window.location.href = '/';
        })
        .catch(_ => {});
    },
    // 获取关键词
    getKeywords() {
      this.$api.search
        .getKeyword(this.params.keyword)
        .then(({ data: { data }}) => {
          this.keywords = data.keywordList || [];
        });
    },
    // 搜索相关信息
    querySearch(queryString, cb) {
      const result = this.keywords.map(e => {
        return { value: e };
      });
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(result);
      }, 1000);
    },
    // 选择
    handleSelect(e) {
      console.log('##########');

      this.handleSearch();
    },
    // 搜索跳转
    handleSearch() {
      const keyword = this.params.keyword;
      if (!keyword.trim()) {
        return;
      }
      this.$router.push({
        path: `/keywords`,
        query: {
          tag: keyword,
          illustType: this.params.illustType
        }
      });
    },
    // 打卡用户系统
    userOpen() {
      if (!cookieTool.get('jwt')) {
        this.$store.dispatch('setLoginBoolean');
      }
    }
  }
};
</script>

<style scoped lang="less">
.HeaderBar {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  /deep/.el-select .el-input {
    width: 80px;
  }
  /deep/.input-with-select {
    width: 25vw;
    background-color: #fff;
  }

  .input-with-select:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
  .header-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.user-tools {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 20px;
  .tool {
    height: 2rem;
    width: 2rem;
    border-radius: 2px;
    border: 1px solid #dcdfe6;
    text-align: center;
  }
}
</style>
