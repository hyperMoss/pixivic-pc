import {
  collectIllust, deleteCollect, followArtist, getVipProxyServer,
} from '@/api/modules/user';
import { serverAddress } from '@/store/getters';
import { Message } from 'element-ui';
import * as types from './mutation-types';

export const setUser = ({
  commit,
}, user) => {
  commit(types.SET_USER, user);
  const { permissionLevelExpireDate = Date.now(), permissionLevel = 1 } = user;
  if (permissionLevel >= 3 && new Date(permissionLevelExpireDate).valueOf() > Date.now()) {
    getVipProxyServer().then(
      (res) => {
        if (res.status === 200) {
          const currentApi = res.data.data[Math.floor(
            serverAddress.length * Math.random(),
          )].serverAddress;
          localStorage.setItem('serverAddress', currentApi);
        } else {
          this.$message.closeAll();
          this.$message.info(res.data.message);
        }
      },
    );
  }
};

export const clearCurrentState = ({
  commit,
}) => {
  localStorage.removeItem('user');
  commit(types.SET_USER, null);
};

export const changeTab = ({
  commit,
}, flag) => {
  commit(types.SHOW_TAB, flag);
};

// 收藏画作
export const handleCollectIllust = ({
  commit,
}, data) => new Promise((resolve, reject) => {
  collectIllust(data)
    .then((res) => {
      if (res.status === 200) {
        const status = {
          illustId: data.illustId,
          like: true,
        };
        commit(types.SET_LIKE_STATUS, status);
        resolve(res);
      } else {
        reject(res);
      }
    })
    .catch((err) => {
      reject(err);
    });
});

// 取消收藏
export const deleteCollectIllust = ({
  commit,
}, data) => new Promise((resolve, reject) => {
  deleteCollect(data)
    .then((res) => {
      if (res.status === 200) {
        const status = {
          illustId: data.illustId,
          like: false,
        };
        commit(types.SET_LIKE_STATUS, status);
        resolve(res);
      } else {
        reject(res);
      }
    })
    .catch((err) => {
      reject(err);
    });
});

// 关注画师
export const handleFollowArtist = ({
  commit,
}, data) => new Promise((resolve, reject) => {
  followArtist(data)
    .then((res) => {
      if (res.status === 200) {
        const status = {
          artistId: data.artistId,
          follow: data.follow,
        };
        commit(types.SET_FOLLOW_STATUS, status);
        resolve();
      } else {
        reject();
      }
    })
    .catch((err) => {
      reject(err);
    });
});

export const setDetail = ({
  commit,
}, data) => {
  commit(types.SET_DETAIL, data);
};
export const setLoginBoolean = ({ commit }, data) => {
  commit(types.SET_LOGIN_BOOLEAN, data);
};
export const setCollectBoolean = ({ commit }, data) => {
  commit(types.SET_COOLECT_BOOLEAN, data);
};
export const setCollectInfo = ({ commit }, data) => {
  commit(types.SET_COOLECT_INFO, data);
};

export const vipProxyServer = ({ commit }) => new Promise((resolve, reject) => {
  getVipProxyServer()
    .then((res) => {
      if (res.status === 200 && res.data.data) {
        const { data } = res.data;
        const url = data[Math.floor((Math.random() * data.length))];
        localStorage.setItem('serverAddress', url.serverAddress);
        commit(types.SET_PROXY_LIST, url.serverAddress);
        Message.success({ message: '您正在享受原图加速服务' });
        resolve();
      } else {
        Message.error({ message: '原图加速服务暂时失效 请稍后刷新重试' });
        localStorage.removeItem('serverAddress');
        reject();
      }
    })
    .catch((err) => {
      reject(err);
    });
});
export const setPhoneBoolean = ({ commit }, data) => {
  commit(types.SET_PHONE_BOOLEAN, data);
};
