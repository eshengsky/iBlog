<template>
  <div class="comments-wrap">
    <div class="comments-top">
      <div class="comments-top-left">
        <span v-if="count === 0">暂无{{ commentName }}</span>
        <span v-else>
          <span style="margin: 0 1px;">{{ count }}</span>
          条{{ commentName }}
        </span>
      </div>
    </div>
    <div class="comments-panel">
      <div class="gituser-wrap">
        <div class="avatar-wrap">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-if="getAvatar()" class="avatar" v-html="getAvatar()" />
          <div v-else class="default-avatar" />
        </div>
        <div class="editor-wrap">
          <div class="form-wrap">
            <a-form :form="form">
              <a-row>
                <a-col :xs="24" :sm="24" :md="11">
                  <a-form-item>
                    <a-input
                      v-decorator="['username', usernameOpts]"
                      placeholder="你的昵称"
                      allow-clear
                      class="username-input"
                      :disabled="!!$auth.user"
                    >
                      <template slot="addonBefore">
                        <font-awesome-icon :icon="['far', 'user']" />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="{ span: 11, offset: 2 }">
                  <a-form-item>
                    <a-input
                      v-decorator="['website', websiteOpts]"
                      placeholder="昵称链接"
                      allow-clear
                    >
                      <template slot="addonBefore">
                        <font-awesome-icon :icon="['fas', 'link']" />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <client-only>
            <editor
              ref="editor"
              height="150px"
              preview-style="tab"
              :options="editorOptions"
              @load="onEditorLoad"
            />
          </client-only>
          <div class="comment-btn-wrap">
            <a-tooltip>
              <template slot="title">
                打开Markdown语法速查
              </template>
              <a @click="mcsShow = true">
                <font-awesome-icon
                  :icon="['fab', 'markdown']"
                  style="font-size: 14px"
                />
                <span>支持Markdown语法</span>
              </a>
            </a-tooltip>
            <a-button type="primary" @click="postComment">
              <span>发表{{ commentName }}</span>
            </a-button>
          </div>
        </div>
      </div>
      <div class="comment-list">
        <ul>
          <li v-for="comment in comments" :key="comment._id" class="comment-li">
            <comment-item
              :comment="comment"
              :avatar="getAvatar(comment.username)"
              @referenceReply="referenceReply"
            />
          </li>
        </ul>
        <div v-if="hasNext" class="btn-next-wrap">
          <a-button size="large" @click="loadNext">
            查看更多
          </a-button>
        </div>
      </div>
    </div>

    <a-modal v-model="mcsShow" title="Markdown 语法速查" width="640px">
      <a-alert
        type="warning"
        message="评论及留言的内容不支持1-4级标题。"
        show-icon
        style="margin-bottom: 10px;"
      />
      <md-cheat-sheet />
      <div slot="footer">
        <a-button type="primary" @click="mcsShow = false">
          关闭
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';
import 'lazysizes';
import CommentItem from '@/components/CommentItem.vue';
import MdCheatSheet from '@/components/MdCheatSheet.vue';
import { IComment } from '@/types/schema';
import { IResp } from '@/types';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';
import editorEmojiPlugin from '../static/editor-emoji-plugin';
export default Vue.extend({
  components: {
    CommentItem,
    MdCheatSheet
  },
  props: {
    from: {
      type: Number,
      default: 1
    } as PropOptions<1 | 2>,
    articleId: {
      type: String,
      default: ''
    } as PropOptions<string>
  },
  data () {
    return {
      comments: [] as Array<IComment>,
      page: 1,
      pageSize: this.$store.state.settings.commentPageSize,
      mcsShow: false,
      isLoading: false,
      count: 0,
      hasNext: false,
      usernameOpts: {
        rules: [
          {
            required: true,
            message: '昵称不能为空！'
          },
          {
            min: 3,
            message: '昵称太短了！'
          },
          {
            max: 20,
            message: '昵称太长了！'
          }
        ]
      },
      websiteOpts: {
        rules: [
          {
            pattern: /^http/,
            message: '链接必须以http开头！'
          }
        ]
      }
    };
  },
  computed: {
    form (): any {
      return this.$form.createForm(this);
    },
    isGuestbook (): boolean {
      return this.from === 1;
    },
    commentName (): string {
      return this.isGuestbook ? '留言' : '评论';
    },
    editorOptions (): object {
      return {
        hideModeSwitch: true,
        usageStatistics: false,
        language: 'zh-CN',
        placeholder: `输入${this.commentName}内容`,
        previewHighlight: false,
        toolbarItems: [
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          'divider',
          'image',
          'table',
          'link',
          'divider',
          'code',
          'codeblock'
        ],
        hooks: {
          addImageBlobHook: (this as any).onAddImageBlob
        },
        plugins: [[codeSyntaxHighlight, { hljs }], [editorEmojiPlugin, { index: 14 }]]
      };
    }
  },
  created () {
    this.getComments();
  },
  mounted () {
    const userInfo = localStorage.getItem('commentUserInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        this.form.setFieldsValue(user);
      } catch (err) {}
    }
    if (this.$auth.user) {
      this.form.setFieldsValue({
        username: 'Admin'
      });
    }
  },
  methods: {
    async getComments () {
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get(
        `/api/${this.isGuestbook ? 'guestbook' : 'comments'}`,
        {
          params: {
            articleId: this.articleId,
            pageIndex: this.page,
            pageSize: this.pageSize
          }
        }
      );

      if (code === 1) {
        this.comments.push(...data.comments);
        this.hasNext = data.hasNext;
        this.count = data.count;
      }
      this.isLoading = false;
    },
    postComment () {
      this.form.validateFieldsAndScroll(async (error, values) => {
        if (!error) {
          const content = (this.$refs.editor as any)
            .invoke('getMarkdown')
            .trim();
          if (!content) {
            (this.$refs.editor as any).invoke('focus');
            return;
          }
          const { code, data, message } = await this.$axios.$post(
            `/api/${this.isGuestbook ? 'guestbook' : 'comment'}`,
            {
              articleId: this.articleId,
              content,
              ...values
            }
          );
          if (code === 1) {
            this.comments.unshift(data.comment);
            this.count++;
            (this.$refs.editor as any).invoke('setMarkdown', '');
          } else {
            this.$message.error(message || `${this.commentName}失败`);
          }
          localStorage.setItem('commentUserInfo', JSON.stringify(values));
        }
      });
    },

    onAddImageBlob (blob, callback) {
      if (process.client && blob) {
        const formData = new FormData();
        formData.append('file', blob);
        this.$axios.$post('/api/uploadImage', formData).then(resp => {
          if (resp.code === 1) {
            callback(resp.data.url, '');
          } else {
            console.error(resp.message);
            this.$message.error(resp.message);
          }
        });
      }
    },

    onEditorLoad () {
      (document.querySelector(
        '.gituser-wrap .comment-btn-wrap'
      ) as HTMLElement).style.display = 'flex';
    },

    referenceReply ({ username, content }) {
      let refText = content.replace(/^.*(\n+|$)/gm, text => '> ' + text);
      refText = `@${username}\n` + refText + '\n\n';
      (this.$refs.editor as any).invoke('setMarkdown', refText);
      const editorComp = this.$refs.editor as any;
      editorComp.invoke('focus');

      if (this.isGuestbook) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      } else {
        editorComp.$el.scrollIntoViewIfNeeded();
      }
    },

    loadNext () {
      this.page++;
      this.getComments();
    },
    getAvatar (username: string | undefined) {
      if (!username) {
        username = this.form.getFieldValue('username');
      }
      if (!username) {
        return '';
      }
      return new Avatars(sprites).create(username);
    }
  }
});
</script>
<style scoped>
.comment-btn-wrap {
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-color: #e5e5e5;
  border-style: solid;
  border-width: 0 1px 1px;
  align-items: center;
  padding: 6px 10px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  user-select: none;
  display: none;
}

.comment-btn-wrap div {
  font-size: 12px;
  color: #666;
}

.comments-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.gituser-wrap {
  display: flex;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.avatar-wrap {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  flex: none;
  margin-right: 16px;
  border: 1px solid #ddd;
  padding: 3px;
}

.default-avatar {
  height: 100%;
  background: url(data:image/png;base64,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)
    center no-repeat #ccc;
  background-size: 30px;
  border-radius: 3px;
}

.editor-wrap {
  flex: auto;
}

.comments-panel {
  background: #fff;
  border-radius: 5px;
  padding: 20px;
}

.comments-wrap {
  margin-top: 20px;
}

.comment-list {
  margin-left: 56px;
  margin-top: 20px;
}

.comments-top-left {
  font-size: 16px;
  font-weight: 600;
}

.comments-top-right {
  font-size: 14px;
}

.btn-next-wrap {
  margin-left: -56px;
  margin-top: 25px;
}

.btn-next-wrap button {
  width: 100%;
  font-size: 15px;
}

.lazyload,
.lazyloading {
  opacity: 0;
}

.lazyloaded {
  opacity: 1;
}

.editor-wrap .ant-form-inline .ant-form-item-with-help {
  margin-bottom: 5px;
}

.username-input input {
  font-weight: 500;
}

.form-wrap .ant-form-item {
  margin-bottom: 10px;
}

@media (max-width: 576px) {
  .avatar-wrap {
    display: none;
  }

  .comment-list {
    margin-left: 0;
  }

  .comments-top {
    margin-left: 20px;
    margin-top: -10px;
  }

  .comments-panel {
    border-radius: 0;
  }
}
</style>
<style>
.comments-wrap .avatar {
  height: 100%;
  user-select: none;
  transition: transform 0.5s, opacity 1.5s;
}

.comments-wrap .avatar:hover {
  transform: scale(1.3);
}

.comments-wrap .tui-editor-contents img {
  max-height: 150px;
}
</style>
