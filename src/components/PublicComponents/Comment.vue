<template>
  <div class="container">
    <div
      class="write-reply"
      @click="showCommentInput()"
    >
      <i class="el-icon-edit" />
      <span class="add-comment">添加新评论</span>
    </div>
    <transition name="fade">
      <div
        v-if="showItemId === 'new'"
        class="input-wrapper"
      >
        <el-input
          v-model="inputComment"
          :disabled="isSticker"
          class="gray-bg-input"
          type="textarea"
          :rows="3"
          autofocus
          placeholder="写下你的评论..."
        />
        <div class="btn-control">
          <span
            class="cancel"
            @click="cancel"
          >取消</span>
          <el-popover
            placement="right"
            trigger="click"
          >
            <StickerTab @submit="submitSticker" />
            <el-button
              slot="reference"
              style="margin-right: 20px;"
              type="primary"
              icon="el-icon-edit"
              circle
            />
          </el-popover>
          <el-button
            class="btn"
            type="primary"
            round
            @click="submitComment()"
          >
            确定
          </el-button>
        </div>
      </div>
    </transition>
    <div
      v-for="item in comments"
      :key="item.id"
      class="comment"
    >
      <div
        class="info"
        @click="goUserHomePage(item.replyFrom)"
      >
        <img
          class="avatar"
          :src="
            item.replyFrom
              ? `${staticUrl}${item.replyFrom}.jpg`
              : ''
          "
          width="36"
          height="36"
          alt="user"
        >
        <div class="right">
          <div class="name">
            {{ item.replyFromName }}
          </div>
          <div class="date">
            {{ item.createDate | dateFormat }} {{ ' '+ item.platform?item.platform:'' }}
          </div>
        </div>
      </div>
      <div style="padding-left:44px;">
        <Sticker
          v-if="pathJSON.hasOwnProperty(item.content)"
          :code="item.content"
          width="100"
        />
        <div
          v-else
          class="content"
        >
          {{ item.content }}
        </div>
        <div class="control">
          <span
            class="like"
            :class="{active: item.isLike}"
            @click="likeClick(item)"
          >
            <i class="iconfont icon-like" />
            <span class="like-num"> <i class="el-icon-caret-top" />
              {{ item.likedCount > 0 ? item.likedCount + '人赞' : '赞' }}</span>
          </span>
          <span
            class="comment-reply"
            @click="showCommentInput(item, 1)"
          >
            <i class="iconfont el-icon-chat-square" />
            <span>回复</span>
          </span>
        </div>
      </div>

      <div class="reply">
        <template v-if="item.subCommentList">
          <div
            v-for="reply in item.subCommentList"
            :key="reply.id"
            class="comment-item"
          >
            <div class="reply-content">
              <span class="from-name">{{ reply.replyFromName }}</span><span>: </span>
              <span class="to-name">@{{ reply.replyToName }}</span>
              <Sticker
                v-if="pathJSON.hasOwnProperty(reply.content)"
                :code="item.content"
                width="100"
              />
              <span v-else>{{ reply.content }}</span>
            </div>
            <div class="reply-bottom">
              <!--              <span>{{ reply.date }}</span>-->
              <span>{{ reply.platform }}</span>
              <span
                class="reply-text"
                @click="showCommentInput(item, 1)"
              >
                <i class="iconfont el-icon-chat-square" />
                <span>回复</span>
              </span>
            </div>
          </div>
        </template>
        <transition name="fade">
          <div
            v-if="showItemId === item.id"
            class="input-wrapper"
            style="padding-left:44px;"
          >
            <el-input
              v-model="inputComment"
              :disabled="isSticker"
              class="gray-bg-input"
              type="textarea"
              :rows="3"
              autofocus
              placeholder="写下你的评论..."
            />
            <div class="btn-control">
              <span
                class="cancel"
                @click="cancel"
              >取消</span>
              <el-popover
                placement="right"
                trigger="click"
              >
                <StickerTab @submit="submitSticker" />
                <el-button
                  slot="reference"
                  style="margin-right: 20px;"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                />
              </el-popover>
              <el-button
                class="btn"
                type="primary"
                round
                @click="submitComment(item)"
              >
                确定
              </el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div>
      <el-pagination
        style="display: flex;justify-content: center;"
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pageIndex"
        @current-change="getCommentsList"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StickerTab from 'components/PublicComponents/StickerTab';
import Sticker from 'components/PublicComponents/Sticker';
import pathJSON from '@/assets/sticker/path.json'
export default {
  components: {StickerTab,Sticker},
  props: {
    pid: {
      type: String,
      required: true
    },
    commentType: {
      type: String,
      default: 'illusts'
    }
  },
  data() {
    return {
      pathJSON:pathJSON,
      isSticker:false,
      staticUrl:process.env.VUE_APP_STATIC_API,
      comments: [],
      copyComment: '',
      inputComment: '',
      showItemId: '',
      total: 0,
      pageSize: 20,
      pageIndex: 1,
      replyParam:{platform:this.getPlatform()}
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'followStatus', 'detail'])
  },
  created() {
    this.getCommentsList();
  },
  methods: {
    // 提交评论
    submitSticker(e){
      this.isSticker=true
      this.inputComment=e
    },
    // GET UA INFO
    getPlatform() {
      const ua = navigator.userAgent.toLowerCase();
     const uaRules={
       osRule:[
         {patterns: /(mac\sos\sx)\s?([\w\s.]+\w)*/i,name:'MacOS'},
       {patterns:/microsoft\s(windows)\s(vista|xp)/i,name:'Windows'},
       {patterns:/(hurd|linux)\s?([\w.]+)*/i,name:'Linux'}
       ],
      browserRules:[{
         patterns:/(chromium|Chrome)\/([\w.-]+)/i,name:'Chrome'
      },{
         patterns: /(edge|edgios|edgea)\/((\d+)?[\w.]+)/i,name: 'Edge',
      },{
        patterns: /(opera\smini)\/([\w.-]+)/i,name: 'Opera',
      },{
        patterns: /(trident).+rv[:\s]([\w.]+).+like\sgecko/i,name: 'IE11',
      },{
        patterns: /version\/([\w.]+).+?(mobile\s?safari|safari)/i,name: 'Safari',
      }
      ]
     }
      return uaRules.osRule.find(e=>e.patterns.exec(ua)).name+' '+uaRules.browserRules.find(e=>e.patterns.exec(ua)).name
    },
    // 跳转用户主页
    goUserHomePage(id) {
      this.$router.push(`/users/home-page/${id}`);
    },
    // 等待后端分页处理
    getCommentsList() {
      this.$api.comment.getComments({
        commentAppType: this.$props.commentType,
        commentAppId: this.pid,
        pageSize: 10,
        page: this.pageIndex
      })
        .then(res => {
          if (res.status === 200) {
            this.comments = res.data.data || [];
            this.total = res.data.total || 0;
          }
        });
    },
    // 点赞ajax
    likeCommentAjax(reqBody, item, cb) {
      this.$api.comment.likeComments(reqBody)
        .then(res => {
          cb && cb(res, item);
        });
    },
    // 取消点赞ajax
    unLikeCommentAjax(reqBody, item, cb) {
      this.$api.comment.unLikeComments(reqBody)
        .then(res => {
          cb && cb(res, item);
        });
    },
    /**
     * 点赞
     */
    likeClick(item) {
      const reqBody = {
        commentAppType: this.$props.commentType,
        commentAppId: this.pid,
        commentId: item.id
      };
      if (item.isLike === false) {
        this.likeCommentAjax(reqBody, item, (res, item) => {
          if (res.status === 200) {
            item.likedCount++;
            item.isLike = true;
          }
        });
      } else {
        if (item.isLike) {
          this.unLikeCommentAjax(reqBody, item, (res, item) => {
            if (res.status === 200) {
              item.likedCount--;
              if (!item.likedCount) {
                item.isLike = false;
              }
            }
          });
        } else {
          this.likeCommentAjax(reqBody, item, (res, item) => {
            if (res.status === 200) {
              item.likedCount++;
            }
          });
        }
      }
    },

    /**
     * 点击取消按钮
     */
    cancel() {
      this.isSticker=false;
      this.showItemId = '';
    },
    // 提交评论
    submitComment(item) {
      if (this.inputComment === this.copyComment) {
        this.$message('请输入评论');
        return;
      }
      if(!this.isSticker){
        this.inputComment = this.inputComment.substring(this.copyComment.length);
      }
      let data = {
        commentAppType: this.$props.commentType,
        commentAppId: this.pid,
        parentId: item && item.id || 0, // 父级评论id,顶级就是0
        replyTo: item && item.replyFrom || 0, // 回复者，没有就是0
        replyFromName: this.user.username, // 评论者用户名
        replyToName: item && item.replyFromName || '', // 回复者用户名
        content: this.inputComment// 内容
      };
      data = Object.assign(data, this.replyParam);
      this.$api.comment.makeComments(data)
        .then(res => {
          if (res.status === 200) {
            const params = { ...data, createDate: new Date(), replyFrom: this.user.id, id: Math.random() };
            if (params.parentId === 0) {
              this.comments.unshift(params);
              this.total++;
            } else {
              const item = this.comments.find(item => item.id === params.parentId);
              if (item.subCommentList) {
                item.subCommentList.push(params);
              } else {
                item.subCommentList = [params];
              }
            }
            this.cancel();
            this.inputComment = '';
          }
        });
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput(item, reply) {
      if (!this.user.id) {
        this.$message.closeAll();
        this.$message.info('请先登录');
        return;
      }
      if (reply) {
        this.copyComment = '@' + item.replyFromName + ' ';
        this.inputComment = '@' + item.replyFromName + ' ';
        this.showItemId = item.id;
      } else {
        this.copyComment = '';
        this.inputComment = '';
        this.showItemId = 'new';
      }
    }
  }
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;

  .write-reply {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: @text-minor;
    padding: 10px;
    cursor: pointer;

    &:hover {
      color: @text-main;
    }

    .el-icon-edit {
      margin-right: 5px;
    }
  }

  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid @border-fourth;

    .info {
      display: flex;
      align-items: center;

      .avatar {
        border-radius: 50%;
      }

      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        .name {
          font-size: 16px;
          color: @text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .date {
          font-size: 12px;
          color: @text-minor;
        }
      }
    }

    .content {
      font-size: 16px;
      color: @text-main;
      line-height: 20px;
      padding: 10px 0;
    }

    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: @text-minor;

      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;

        &.active,
        &:hover {
          color: @color-main;
        }

        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }

      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          color: @text-333;
        }

        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }

    .reply {
      margin: 10px 44px;
      border-left: 2px solid @border-first;

      .comment-item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed @border-third;

        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: @text-main;

          .from-name {
            color: @color-main;
          }

          .to-name {
            color: @color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
        }

        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: @text-minor;

          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;

            &:hover {
              color: @text-333;
            }

            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }


      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
    }
  }

  .input-wrapper {
    padding: 10px;

    .gray-bg-input,
    .el-input__inner {
      /*background-color: #67C23A;*/
    }

    .btn-control {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 10px;

      .cancel {
        font-size: 16px;
        color: @text-normal;
        margin-right: 20px;
        cursor: pointer;

        &:hover {
          color: @text-333;
        }
      }

      .confirm {
        font-size: 16px;
      }
    }
  }
}
</style>
