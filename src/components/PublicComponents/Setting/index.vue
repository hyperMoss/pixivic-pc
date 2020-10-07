

<template>
  <div class="index">
    <el-dialog
      :visible.sync="localVisible"
      title="设置"
      width="500px"
      @close="handleClose"
    >
      <div class="modal-body">
        <div class="btn-list">
          <p>
            <el-button
              :disabled="isCheckEmail"
              @click="verifyEmail"
            >
              {{ isCheckEmail ? "已验证邮箱" : "验证邮箱" }}
            </el-button>
          </p>

          <p>
            <el-button
              :disabled="isConnectQQ"
              @click="bindQQ"
            >
              {{ isConnectQQ ? "已绑定QQ" : "绑定QQ" }}
            </el-button>
          </p>
          <p>
            <el-button @click="resetPassword">
              重置密码
            </el-button>
          </p>
          <p>
            <el-button
              :disabled="!isConnectQQ"
              @click="unLinkQQ"
            >
              解绑QQ
            </el-button>
          </p>
        </div>

        <div class="change-avatar">
          <vueCropper
            ref="cropper"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :img="option.img"
            :output-size="option.size"
            class="cropper"
          />
          <div class="upload">
            <el-button class="btn">
              上传图片
            </el-button>
            <input
              id="uploads"
              ref="fileHander"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              type="file"
              @change="handleLocalImg($event)"
            >
            <el-button
              :loading="loading"
              @click="saveAvatar"
            >
              确定头像
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import { QQ_LINK } from '@/util/constants';
export default {
  name: 'Index',
  components: { VueCropper },
  props: {
    settingVisible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: {
        img: `${process.env.VUE_APP_STATIC_API}53.jpg`,
        size: 0.1,
        autoCrop: true,
        fixed: true
      },
      dialog: false,
      loading: false,
      imageUrl: '',
      columns: ['自动', 1, 2, 3, 4],
      isCheckEmail: false,
      isConnectQQ: false,
      column: 1
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.settingVisible;
      },
      set() {}
    }
  },
  watch: {},
  mounted() {
    // 验证状态
    this.$api.user.getEmailIsCheck(this.user.id).then(res => {
      this.isCheckEmail = res.data.data;
    });
    this.$api.user.checkQQ(this.user.id).then(res => {
      this.isConnectQQ = res.data.data;
    });

    const column = parseInt(localStorage.getItem('waterfull-column'));
    this.column = column || '自动';
  },

  methods: {
    // 上传图片
    uploadFile() {
      this.$refs['fileHander'].onClick();
    },
    // 重置密码
    resetPassword() {
      this.$api.user.resetPasswordEmail(this.user.email).then(res => {
        if (res.status === 200) {
          this.$message.info('请注意邮箱内的重置密码邮件');
        } else {
          this.$message.error('重置密码发起错误');
        }
      });
    },
    // 处理本地图片
    handleLocalImg(e) {
      const file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.info('请选择正确的图片格式');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.info('图片大小不能超过5M');
        return false;
      }
      const reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      };
      reader.readAsArrayBuffer(file);
    },
    // 更新至服务器
    saveAvatar() {
      this.loading = true;
      this.$refs.cropper.getCropBlob(async data => {
        const type = data.type.split('/')[1];
        const files = new File([data], `${this.user.id}.${type}`, {
          type: data.type
        });
        const formData = new FormData();
        formData.append('file', files);
        const result = await this.$api.search.uploadImg(formData, {
          userId: this.user.id
        });
        if (result.status === 200) {
          this.$message.success('更新头像成功');
        } else {
          this.$message.error('更新失败，请重试');
        }
        this.loading = false;
      });
    },
    bindQQ() {
      window.open(QQ_LINK);
    },
    // 解绑qq
    unLinkQQ() {
      this.$api.user.unLinkQQ(this.user.id).then(res => {
        this.$message.success(res.data.message);
        this.isConnectQQ = false;
      });
    },
    verifyEmail() {
      this.$api.user.vertifyEmail(this.user.email).then(res => {
        this.$message.success(res.data.message);
      });
    },
    // 处理窗口关闭
    handleClose() {
      this.$emit('update:settingVisible', false);
    }
  }
};
</script>

<style scoped lang="less">
.modal-body {
  display: flex;
  justify-content: space-between;
}
.btn-list {
  width: 100px;
}
.change-avatar {
  width: 250px;
  .cropper {
    width: 200px;
    height: 200px;
  }
  .upload {
    position: relative;
    .btn {
      z-index: 0;
      width: 100px;
    }
    #uploads {
      height: 100%;
      width: 100px;
      cursor: pointer;
      z-index: 1;
      opacity: 0;
      position: absolute;
      left: 0;
    }
  }
}
</style>
