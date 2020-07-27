/*
 * @Author: gooing
 * @since: 2020-01-26 11:47:00
 * @lastTime: 2020-06-20 11:28:16
 * @LastAuthor: Dongzy
 * @FilePath: \pixiciv-pc\src\main.js
 * @message:
 */
/*
 * @Author: gooing
 * @since: 2020-01-24 15:59:31
 * @lastTime     : 2020-01-26 10:20:04
 * @LastAuthor   : gooing
 * @文件相对于项目的路径: \pixivic-pc\src\main.js
 * @message:
 */
import Vue from 'vue';
import api from './api';
import App from './App.vue';
import router from './router.js';
import store from './store/';
import './styles/reset.less';
import './styles/public-style.less';
import VuePageStack from 'vue-page-stack';
import 'element-ui/lib/theme-chalk/index.css';
import { replaceBigImg, replaceSmallImg } from '@/util';
import i18n from './i18n';
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Slider,
  Icon,
  Upload,
  Spinner,
  Badge,
  Card,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Avatar,
  Footer,
  Divider,
  Image,
  Calendar,
  Backtop,
  CascaderPanel,
  Loading,
  MessageBox,
  Message,
  Notification,
  InfiniteScroll
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(Avatar);
Vue.use(Row);
Vue.use(Col);
Vue.use(InfiniteScroll);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Spinner);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Divider);
Vue.use(Image);
Vue.use(Calendar);
Vue.use(Backtop);
Vue.use(CascaderPanel);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
Vue.use(VuePageStack, { router, keyName: 'VNK' });
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  try {
    if (isChunkLoadFailed) {
      const LoadingChunk = window.sessionStorage.getItem('LoadingChunk');
      if (LoadingChunk) {
        window.sessionStorage.setItem('LoadingChunk', LoadingChunk - 0 + 1);
      } else {
        window.sessionStorage.setItem('LoadingChunk', 1);
      }
      if (LoadingChunk - 0 > 1) {
        // 防止 死循环
        return false;
      }
      router.replace(targetPath);
      window.sessionStorage.setItem('LoadingChunkPath', targetPath);
      const sa = window.sa;
      if (sa && sa.track) {
        sa.track('element_click', {
          page_title: 'LoadingChunk',
          element_type: 'view',
          page_source: targetPath, // 当前路由
          element_name: `刷新页面${LoadingChunk - 0}次` // 尝试 打开次数
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
router.onReady(vm => {
  try {
    const LoadingChunkPath = window.sessionStorage.getItem('LoadingChunkPath');
    const path = vm.path;
    if (LoadingChunkPath) {
      if (path !== LoadingChunkPath && path !== '/') {
        window.sessionStorage.setItem('LoadingChunkPath', vm.path);
        router.replace(vm.path);
      } else {
        router.replace(LoadingChunkPath);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
Vue.filter('dateFormat', val => {
  const time = new Date(val);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
});
Vue.filter('replaceBig', val => replaceBigImg(val));
Vue.filter('replaceSmall', val => replaceSmallImg(val));
Vue.filter('replaceAvatar', val => `https://pic.cheerfun.dev/${val}.png`);
Vue.filter('replaceSquare', val => 'https://img.cheerfun.dev:233/c/360x360_70/img-master' + val.split('img-master')[1]);

Vue.prototype.$api = api;
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
