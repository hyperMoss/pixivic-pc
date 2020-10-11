
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
          :placeholder="$t('search')"
          @keyup.enter.native="handleSearch"
          @select="handleSelect"
        >
          <el-select
            slot="prepend"
            v-model="params.illustType"
            @change="handleSelect"
          >
            <el-option
              v-for="item of typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-autocomplete>
        <el-popover placement="bottom" style="margin-left:10px" trigger="hover">
          <i slot="reference" class="el-icon-s-flag" style="color:#409EFF" />
          <ImgTags
            v-if="hotTags.length"
            :tagslist="hotTags"
            @on-click="handleClickTag"
          />
        </el-popover>
      </el-col>
      <el-select :value="$i18n.locale" @change="changeLocaleLang">
        <el-option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{
          lang
        }}</el-option>
      </el-select>
      <el-col class="header-info">
        <!-- <el-badge :value="3">
          <el-button size="small">消息</el-button>
        </el-badge>-->
        <div style="margin-left:20px;">
          <el-dropdown
            v-if="user.id"
            trigger="click"
            @command="clickMenu"
          >
            <el-avatar
              :src="user.id? `https://static.pixivic.net/avatar/299x299/${user.id}.jpg?t=${new Date().getTime()}`: ''"
              fit="cover"
              shape="square"
            />
            <el-dropdown-menu slot="dropdown">
              <template>
                <el-dropdown-item
                  v-for="item of MenuList"
                  :key="item.handler"
                  :command="item.handler"
                  :divided="item.divided"
                >{{ item.name }}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <div
            v-else
          ><span class="button-text" @click="login">{{ $t('login') }}</span>  <span class="button-text" @click="signUp">{{ $t('signUp') }}</span></div>
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
import cookie from 'js-cookie';
import { mapGetters } from 'vuex';
import SetDialog from './Setting/index';
import ImgTags from './ImgTags';
export default {
  name: 'HeaderBar',
  components: {
    SetDialog,
    ImgTags
  },
  data() {
    return {
      langs: ['zh', 'en'],
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
      // 热门搜索模块
      hotTags: []
    };
  },
  computed: {
    // 辅助函数取出x内用户信息
    ...mapGetters(['user']),
    MenuList() {
      return [
        {
          name: this.$t('followed'),
          handler: 'followed'
        },
        {
          name: this.$t('bookmarked'),
          handler: 'bookmarked'
        },
        // {
        //   name: '画集',
        //   handler: 'mycollect'
        // },
        {
          name: this.$t('spotLight'),
          handler: 'spotLight'
        },
        {
          name: this.$t('setting'),
          handler: 'setting'
        },
        {
          name: this.$t('logout'),
          handler: 'logout',
          divided: true
        }
      ];
    },
    typeList() {
      return [
        {
          name: this.$t('illust'),
          value: 'illust'
        },
        {
          name: this.$t('manga'),
          value: 'manga'
        },
        {
          name: this.$t('artist'),
          value: 'artist'
        }
      ];
    }
  },
  watch: {
    'params.keyword': {
      handler: 'getKeywords'
    }
  },
  mounted() {
    this.params.illustType = this.$route.query.illustType || 'illust';
    this.params.keyword = this.$route.query.tag;
    this.getHotTag();
  },
  methods: {
    changeLocaleLang(val) {
      this.$i18n.locale = val;
      cookie.set('lang', val, {
        expires: 365
      });
    },
    // 点击 用户模块
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
        case 'mycollect':
          this.toMycollect();
          break;
        case 'logout':
          this.logout();
          break;
        case 'spotLight':
          this.toSpotLight();
          break;
        default:
          break;
      }
    },
    // 获取标签数据
    getHotTag() {
      this.$api.search.getHotTag().then(res => {
        this.hotTags = res.data.data.splice(0, 9);
      });
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
    toMycollect() {
      this.$router.push({
        path: '/collect/mycollection',
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
    toSpotLight() {
      this.$router.push({
        path: '/spot-light/index'
      });
    },
    // 设置弹窗
    setModal() {
      this.settingVisible = !this.settingVisible;
    },
    // 退出登录
    logout() {
      this.$confirm(this.$t('user.logoutMessage'))
        .then(_ => {
          this.$message.info(this.$t('user.logoutSuc'));
          cookie.remove('jwt');
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
          if (data && data.keywordList) {
            this.keywords = data.keywordList || [];
          }
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
    // 点击tag
    handleClickTag(d) {
      this.$router.push({
        path: `/keywords`,
        query: {
          tag: d.name,
          illustType: this.params.illustType
        }
      });
    },
    // 打卡用户系统
    signUp() {
      if (!cookie.get('jwt')) {
        this.$store.dispatch('setLoginBoolean', false);
      }
    },
    login() {
      if (!cookie.get('jwt')) {
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
.button-text{
    user-select: none;
    transition: background 20ms ease-in 0s;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 3px;
    flex-shrink: 0;
    font-size: 15px;
    margin-left: 2px;
    margin-right: 2px;
    font-weight: 500;
    width: auto;
    &:hover{
      background: rgba(55, 53, 47, 0.16);
    }
}
</style>
