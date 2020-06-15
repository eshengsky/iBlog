<template>
  <div class="profile-settings">
    <div class="page-header">
      关于管理
    </div>
    <div class="page-body">
      <a-form :form="form" :self-update="true">
        <a-form-item :colon="false">
          <span slot="label">
            头像
          </span>
          <a-upload
            v-decorator="['avatar']"
            name="avatar"
            :show-upload-list="false"
            list-type="picture-card"
            :before-upload="beforeUpload"
            accept="image/*"
            @change="uploadChange"
          >
            <img v-if="avatar" :src="avatar" alt="image">
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            英文名
          </span>
          <a-input v-decorator="['enName']" placeholder="请输入英文名" allow-clear />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            中文名
          </span>
          <a-input
            v-decorator="['cnName', {
              rules: [
                {
                  required: true,
                  message: '中文名不能为空！'
                }
              ]
            }]"
            placeholder="请输入中文名"
            allow-clear
          />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            自我介绍
          </span>
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
          </div>
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            GitHub地址
          </span>
          <a-input
            v-decorator="['github', {
              rules: [{
                type: 'url',
                message: '请输入合法的URL'
              }]
            }]"
            placeholder="请输入GitHub地址"
            allow-clear
          />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            Email地址
          </span>
          <a-input
            v-decorator="['email', {
              rules: [{
                type: 'email',
                message: '请输入合法的Email'
              }]
            }]"
            placeholder="请输入Email地址"
            allow-clear
          />
        </a-form-item>
      </a-form>
      <a-button class="btn-save" type="primary" @click="save">
        <font-awesome-icon :icon="['far', 'save']" style="margin-right: 4px;" />保存设置
      </a-button>
    </div>
    <a-modal v-model="mcsShow" title="Markdown 语法速查" width="640px">
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
import Vue from 'vue';
import MdCheatSheet from '@/components/MdCheatSheet.vue';
import { IResp } from '@/types';
import { IProfile } from '@/types/schema';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';
import editorEmojiPlugin from '../../static/editor-emoji-plugin';
import '@/static/article.less';
export default Vue.extend({
  name: 'PageProfileSettings',
  layout: 'admin',
  components: {
    MdCheatSheet
  },
  data () {
    return {
      form: this.$form.createForm(this),
      imgLoading: false,
      avatar: '',
      mcsShow: false
    };
  },
  computed: {
    editorOptions (): object {
      if (process.server) {
        return {};
      }

      const escape = function (html, encode) {
        return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      };
      const Editor = require('@toast-ui/editor');
      const codeBlockPlugin = function () {
        Editor.codeBlockManager.createCodeBlockHtml = (lang, str) => {
          let showLang = '';
          let code = '';
          if (lang) {
            showLang = lang.toUpperCase();
            if (showLang === 'JS') {
              showLang = 'JAVASCRIPT';
            } else if (showLang === 'TS') {
              showLang = 'TYPESCRIPT';
            }
            const langObj = hljs.getLanguage(lang);
            if (langObj) {
              try {
                code = hljs.highlight(lang, str, true).value;
              } catch (err) {}
            }
          }
          if (!code) {
            code = escape(str, false);
          }

          // 特殊：信息代码块
          if (showLang === 'INFO') {
            return `<pre class="hljs info"><code><svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-info-circle"><path fill="currentColor" d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z" class=""></path></svg>${code}</code></pre>`;
          }

          // 特殊：警告代码块
          if (showLang === 'ALERT') {
            return `<pre class="hljs alert"><code><svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="exclamation-triangle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-exclamation-triangle"><path fill="currentColor" d="M270.2 160h35.5c3.4 0 6.1 2.8 6 6.2l-7.5 196c-.1 3.2-2.8 5.8-6 5.8h-20.5c-3.2 0-5.9-2.5-6-5.8l-7.5-196c-.1-3.4 2.6-6.2 6-6.2zM288 388c-15.5 0-28 12.5-28 28s12.5 28 28 28 28-12.5 28-28-12.5-28-28-28zm281.5 52L329.6 24c-18.4-32-64.7-32-83.2 0L6.5 440c-18.4 31.9 4.6 72 41.6 72H528c36.8 0 60-40 41.5-72zM528 480H48c-12.3 0-20-13.3-13.9-24l240-416c6.1-10.6 21.6-10.7 27.7 0l240 416c6.2 10.6-1.5 24-13.8 24z" class=""></path></svg>${code}</code></pre>`;
          }

          // 特殊：以冒号开头的，视为特殊代码块
          if (showLang.startsWith(':')) {
            const header = showLang.substring(1);
            return `<pre class="hljs custom"><div class="pre-header">${header}</div><code>${code}</code></pre>`;
          }
          return (
            '<pre class="hljs"><div class="pre-header"><div class="pre-header-left"><div></div><div></div><div></div></div><div class="pre-header-right">' +
                    showLang +
                    '</div></div><code>' +
                    code +
                    '</code></pre>'
          );
        };
      };

      return {
        hideModeSwitch: true,
        usageStatistics: false,
        language: 'zh-CN',
        placeholder: '请输入自我介绍',
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
        plugins: [[codeSyntaxHighlight, { hljs }], codeBlockPlugin, [editorEmojiPlugin, { index: 14 }]]
      };
    }
  },
  async mounted () {
    const { code, data }: IResp = await this.$axios.$get('/api/profile');
    if (code === 1 && data.profile) {
      const profile: IProfile = data.profile;
      this.avatar = profile.avatar;
      this.form.setFieldsValue({
        enName: profile.enName,
        cnName: profile.cnName,
        github: profile.github,
        email: profile.email
      });
      this.$nextTick(() => {
        (this.$refs.editor as any).invoke('setMarkdown', profile.introduction);
      });
    }
  },
  methods: {
    beforeUpload (file) {
      const isImg = file.type.indexOf('image/') === 0;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error('只允许上传图片！');
      } else if (!isLt2M) {
        this.$message.error('图片体积不能大于2M！');
      }
      return isImg && isLt2M;
    },

    onEditorLoad () {
      (document.querySelector(
        '.profile-settings .comment-btn-wrap'
      ) as HTMLElement).style.display = 'flex';
    },

    getBase64 (img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    },

    uploadChange (info) {
      if (info.file.status === 'uploading') {
        this.imgLoading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.avatar = imageUrl;
          this.imgLoading = false;
        });
      }
    },
    save () {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const data = values;
          data.avatar = this.avatar;
          data.introduction = (this.$refs.editor as any).invoke('getMarkdown');
          this.$axios.$put('/api/admin/profile', data).then(resp => {
            if (resp.code === 1) {
              this.$message.success('保存成功！');
            } else {
              console.error(resp.message);
              this.$message.error('操作失败！');
            }
          });
        }
      });
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
</style>
<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #777;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.profile-settings .btn-save {
  margin-top: 15px;
}

.profile-settings .te-tab {
  line-height: 1;
}
</style>
