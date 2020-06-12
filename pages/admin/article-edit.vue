<template>
  <div class="article-edit">
    <div class="page-header">
      {{ pageHeader }}
    </div>
    <div class="page-body">
      <a-form :form="form" :self-update="true">
        <div class="title-line">
          <a-form-item label="标题" :colon="false">
            <a-input
              ref="titleInput"
              v-decorator="['title', titleOpts]"
              placeholder="请输入标题"
              allow-clear
            />
          </a-form-item>
          <a-form-item :colon="false">
            <span slot="label">
              分类
              <a class="link-dark" @click="refreshCategories">
                <font-awesome-icon :icon="['fas', 'sync-alt']" :spin="categoryLoading" />
              </a>
            </span>
            <a-select v-decorator="['category', categoryOpts]">
              <a-select-option
                v-for="(item, index) in categories"
                :key="index"
                :value="item._id"
              >
                {{ item.cateName }}
              </a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <a
                  href="/admin/category-manage"
                  target="_blank"
                  class="link-category-btn"
                >
                  <font-awesome-icon
                    :icon="['fas', 'plus']"
                    style="margin-right: 4px;"
                  />新的分类
                </a>
              </div>
            </a-select>
          </a-form-item>
        </div>
        <a-form-item label="来源" :colon="false">
          <a-radio-group
            v-decorator="['isLocal', isLocalOpts]"
            name="isLocalGroup"
            @change="isLocalChange"
          >
            <a-radio :value="true">
              本地
            </a-radio>
            <a-radio :value="false">
              外链
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-show="!initialData.isLocal">
          <a-form-item label="URL" :colon="false">
            <a-input
              ref="urlInputComp"
              v-decorator="['url', urlOpts]"
              placeholder="请输入链接地址"
              allow-clear
            />
          </a-form-item>
        </div>
        <div v-show="initialData.isLocal">
          <a-form-item :colon="false">
            <span slot="label">
              Alias
              <a-tooltip
                title="文章别名，如：this-is-my-fist-post，将作为URL的一部分"
              >
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input
              ref="aliasInputComp"
              v-decorator="['alias', aliasOpts]"
              placeholder="请输入Alias"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="正文" :colon="false">
            <div class="editor-wrap">
              <client-only>
                <editor
                  ref="editor"
                  preview-style="vertical"
                  height="70vh"
                  :options="editorOptions"
                  @load="onEditorLoad"
                />
              </client-only>
              <div class="editor-footer">
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
            </div>
          </a-form-item>
          <a-form-item label="标签" :colon="false">
            <a-select
              v-decorator="['labels', labelsOpts]"
              mode="tags"
              placeholder="回车新增"
              not-found-content
            />
          </a-form-item>
          <a-form-item label="允许评论" :colon="false">
            <a-radio-group
              v-decorator="['commentsFlag', commentsFlagOpts]"
              name="commentsFlagGroup"
            >
              <a-radio :value="0">
                默认
                <a-tooltip
                  title="遵循系统设置 - 开启文章评论"
                >
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </a-radio>
              <a-radio :value="1">
                允许评论
              </a-radio>
              <a-radio :value="-1">
                禁止评论
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <div class="btn-wrap">
          <template v-if="!initialData._id">
            <a-button type="primary" @click="publish">
              <font-awesome-icon
                :icon="['far', 'paper-plane']"
                style="margin-right: 4px;"
              />发布文章
            </a-button>
            <a-button @click="saveDraft">
              <font-awesome-icon
                :icon="['far', 'file-alt']"
                style="margin-right: 4px;"
              />存为草稿
            </a-button>
          </template>
          <template v-else>
            <template v-if="initialData.isDraft">
              <a-button type="primary" @click="publish2">
                <font-awesome-icon
                  :icon="['far', 'paper-plane']"
                  style="margin-right: 4px;"
                />发布文章
              </a-button>
              <a-button @click="save">
                <font-awesome-icon
                  :icon="['far', 'save']"
                  style="margin-right: 4px;"
                />保存草稿
              </a-button>
            </template>
            <template v-else>
              <a-button type="primary" @click="save">
                <font-awesome-icon
                  :icon="['far', 'save']"
                  style="margin-right: 4px;"
                />保存更改
              </a-button>
              <a-button @click="unpublish">
                <font-awesome-icon
                  :icon="['fas', 'history']"
                  style="margin-right: 4px;"
                />取消发布
              </a-button>
            </template>
          </template>
          <nuxt-link class="ant-btn" to="/admin/article-manage">
            返回
          </nuxt-link>
        </div>
      </a-form>
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
import { IPost } from '@/types/schema';
import { Context } from '@nuxt/types/index';
import { otherCategoryItem } from '@/server/models/category';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';
import editorEmojiPlugin from '../../static/editor-emoji-plugin';
import 'highlight.js/styles/tomorrow.css';
import '@/static/article.less';
export default Vue.extend({
  name: 'PageAdminArticle',
  layout: 'admin',
  components: {
    VNodes: {
      functional: true,
      render: (_h, ctx) => ctx.props.vnodes
    },
    MdCheatSheet
  },
  async asyncData ({ $axios, query, error }: Context) {
    const uid = query.uid;
    if (uid) {
      const { code, data } = await $axios.$get('/api/admin/article', {
        params: {
          uid
        }
      });
      if (code === 1) {
        if (data && data.isActive) {
          return {
            initialData: data
          };
        }
        error({
          statusCode: 404,
          message: '未找到该页面'
        });
      } else {
        error({
          statusCode: 500,
          message: '内部服务器错误'
        });
      }
    } else {
      return {
        initialData: {
          isLocal: true,
          commentsFlag: 0
        }
      };
    }
  },
  data () {
    return {
      settings: this.$store.state.settings,
      initialData: {
        isLocal: true,
        commentsFlag: 0
      } as IPost,
      mcsShow: false,
      categories: [],
      titleOpts: {
        rules: [
          {
            required: true,
            message: '标题不能为空！'
          }
        ]
      },
      categoryOpts: {
        initialValue: otherCategoryItem._id.toHexString()
      },
      isLocalOpts: {
        initialValue: true
      },
      labelsOpts: {
        initialValue: []
      },
      commentsFlagOpts: {
        initialValue: 0
      },
      categoryLoading: false
    };
  },
  computed: {
    pageHeader (): string {
      return this.initialData._id ? '编辑文章' : '新增文章';
    },
    form (): any {
      return this.$form.createForm(this);
    },
    aliasOpts (): object {
      return {
        rules: [
          {
            required: this.initialData.isLocal,
            message: 'Alias不能为空！'
          },
          {
            validator: this.checkAlias
          }
        ]
      };
    },
    urlOpts (): object {
      return {
        rules: [
          {
            required: !this.initialData.isLocal,
            message: '链接地址不能为空！'
          },
          {
            type: 'url',
            message: '链接地址格式不正确！'
          }
        ]
      };
    },
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
        placeholder: '请输入文章正文',
        previewHighlight: false,
        toolbarItems: [
          'heading',
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
          'codeblock',
          {
            type: 'button',
            options: {
              el: this.createElementFromHTML('<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-info-circle"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm0-338c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" class=""></path></svg>'),
              name: 'info',
              className: '',
              event: 'evtInfo',
              tooltip: '插入信息块'
            }
          },
          {
            type: 'button',
            options: {
              el: this.createElementFromHTML('<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="exclamation-triangle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-exclamation-triangle"><path fill="currentColor" d="M248.747 204.705l6.588 112c.373 6.343 5.626 11.295 11.979 11.295h41.37a12 12 0 0 0 11.979-11.295l6.588-112c.405-6.893-5.075-12.705-11.979-12.705h-54.547c-6.903 0-12.383 5.812-11.978 12.705zM330 384c0 23.196-18.804 42-42 42s-42-18.804-42-42 18.804-42 42-42 42 18.804 42 42zm-.423-360.015c-18.433-31.951-64.687-32.009-83.154 0L6.477 440.013C-11.945 471.946 11.118 512 48.054 512H527.94c36.865 0 60.035-39.993 41.577-71.987L329.577 23.985zM53.191 455.002L282.803 57.008c2.309-4.002 8.085-4.002 10.394 0l229.612 397.993c2.308 4-.579 8.998-5.197 8.998H58.388c-4.617.001-7.504-4.997-5.197-8.997z" class=""></path></svg>'),
              name: 'alert',
              className: '',
              event: 'evtAlert',
              tooltip: '插入提示块'
            }
          }, {
            type: 'button',
            options: {
              el: this.createElementFromHTML('<div class="custom-button"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="expand-arrows" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-expand-arrows"><path fill="currentColor" d="M447.9 332l.1 136c0 6.6-5.4 12-12 12l-136-.1c-6.6 0-12-5.4-12-12v-27.8c0-6.7 5.5-12.1 12.2-12l61.4 2.3 1.4-1.4-139-139L85 429l1.4 1.4 61.4-2.3c6.7-.1 12.2 5.3 12.2 12v27.8c0 6.6-5.4 12-12 12L12 480c-6.6 0-12-5.4-12-12l.1-136c0-6.6 5.4-12 12-12h27.8c6.7 0 12.1 5.5 12 12.2l-2.3 61.4L51 395l139-139L51 117l-1.4 1.4 2.3 61.4c.1 6.7-5.3 12.2-12 12.2H12.1c-6.6 0-12-5.4-12-12L0 44c0-6.6 5.4-12 12-12l136 .1c6.6 0 12 5.4 12 12v27.8c0 6.7-5.5 12.1-12.2 12l-61.4-2.3L85 83l139 139L363 83l-1.4-1.4-61.4 2.3c-6.7.1-12.2-5.3-12.2-12V44.1c0-6.6 5.4-12 12-12l136-.1c6.6 0 12 5.4 12 12l-.1 136c0 6.6-5.4 12-12 12h-27.8c-6.7 0-12.1-5.5-12-12.2l2.3-61.4-1.4-1.4-139 139 139 139 1.4-1.4-2.3-61.4c-.1-6.7 5.3-12.2 12-12.2h27.8c6.6 0 12 5.4 12 12z" class=""></path></svg></div>'),
              name: 'fullscreen',
              className: '',
              event: 'evtFullscreen',
              tooltip: '切换全屏模式'
            }
          }
        ],
        hooks: {
          addImageBlobHook: (this as any).onAddImageBlob
        },
        plugins: [[codeSyntaxHighlight, { hljs }], codeBlockPlugin, [editorEmojiPlugin, { index: 15 }]]
      };
    }
  },
  created () {
    this.getCategories();
  },
  mounted () {
    if (this.initialData._id) {
      // 编辑模式
      this.form.setFieldsValue({
        title: this.initialData.title,
        alias: this.initialData.alias,
        category: this.initialData.category,
        isLocal: this.initialData.isLocal,
        url: this.initialData.url || '',
        labels: this.initialData.labels,
        commentsFlag: this.initialData.commentsFlag
      });
      this.$nextTick(() => {
        (this.$refs.editor as any).invoke('setMarkdown', this.initialData.content);
      });
    }
    this.$refs.titleInput.focus();
  },
  methods: {
    async getCategories () {
      const { code, data }: IResp = await this.$axios.$get(
        '/api/admin/categories'
      );
      if (code === 1) {
        this.categories = data;
      }
    },
    async refreshCategories () {
      this.categoryLoading = true;
      await this.getCategories();
      this.categoryLoading = false;
    },
    createElementFromHTML (htmlString) {
      const button = document.createElement('button');
      button.className = 'custom-button';
      button.innerHTML = htmlString.trim();
      return button;
    },
    onEditorLoad () {
      setTimeout(() => {
        const editor = this.$refs.editor.editor;
        editor.eventManager.addEventType('evtInfo');
        editor.eventManager.listen('evtInfo', () => {
          this.editorEvent(editor, 'info');
        });
        editor.eventManager.addEventType('evtAlert');
        editor.eventManager.listen('evtAlert', () => {
          this.editorEvent(editor, 'alert');
        });
        editor.eventManager.addEventType('evtFullscreen');
        editor.eventManager.listen('evtFullscreen', () => {
          if (document.fullscreen) {
            document.exitFullscreen();
          } else {
            (document.querySelector('.tui-editor-defaultUI') as HTMLElement).requestFullscreen();
          }
        });
      }, 0);
    },
    editorEvent (editor, type: string) {
      const cm = editor.getCodeMirror();
      const doc = cm.getDoc();
      const range = {
        from: cm.getCursor('from'),
        to: cm.getCursor('to')
      };
      const replaceText = [
        '```' + type,
        doc.getSelection(),
        '```'
      ];
      let cursorOffset = 1;
      if (range.from.ch !== 0) {
        replaceText.unshift('');
        cursorOffset += 1;
      }
      if (range.to.ch !== doc.getLine(range.to.line).length) {
        replaceText.push('');
      }
      doc.replaceSelection(replaceText.join('\n'));
      cm.setCursor(range.from.line + cursorOffset, 0);
      cm.focus();
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
    checkAlias (_rule, value, callback) {
      if (value) {
        this.$axios
          .$get('/api/admin/checkArticleAlias', {
            params: {
              alias: value,
              excludeUid: this.initialData._id
            }
          })
          .then(({ code, data }: IResp) => {
            if (code === 1 && !data.exists) {
              callback();
            } else {
              // eslint-disable-next-line standard/no-callback-literal
              callback('alias已存在！');
            }
          });
      } else {
        callback();
      }
    },
    isLocalChange (e) {
      this.initialData.isLocal = e.target.value;

      // 切换本地外链后，光标聚焦
      this.$nextTick(() => {
        if (!this.initialData.isLocal) {
          this.$refs.urlInputComp.focus();
        } else {
          this.$refs.aliasInputComp.focus();
        }
      });
    },
    publish () {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: (this.$refs.editor as any).invoke('getMarkdown'),
            ...values
          };
          this.$confirm({
            title: '确定要发布吗？',
            okText: '确定',
            cancelText: '取消',
            onOk () {
              return new Promise((resolve, reject) => {
                self.$axios.$post('/api/admin/article', data).then(resp => {
                  if (resp.code === 1) {
                    self.initialData = resp.data.article;
                    history.replaceState(
                      null,
                      '',
                                            `${location.protocol}//${location.host}${location.pathname}?uid=${self.initialData._id}`
                    );
                    resolve();
                    self.$message.success('文章发布成功！');
                  } else {
                    console.error(resp.message);
                    reject(resp.message);
                    self.$message.error('操作失败！');
                  }
                });
              });
            }
          });
        }
      });
    },
    publish2 () {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: (this.$refs.editor as any).invoke('getMarkdown'),
            isDraft: false,
            ...values
          };
          this.$confirm({
            title: '确定要发布吗？',
            okText: '确定',
            cancelText: '取消',
            onOk () {
              return new Promise((resolve, reject) => {
                self.$axios
                  .$put('/api/admin/article', data, {
                    params: {
                      uid: self.initialData._id,
                      pubtype: 'publish'
                    }
                  })
                  .then(resp => {
                    if (resp.code === 1) {
                      self.initialData = resp.data.article;
                      resolve();
                      self.$message.success('文章发布成功！');
                    } else {
                      console.error(resp.message);
                      reject(resp.message);
                      self.$message.error('操作失败！');
                    }
                  });
              });
            }
          });
        }
      });
    },
    saveDraft () {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: (this.$refs.editor as any).invoke('getMarkdown'),
            isDraft: true,
            ...values
          };
          this.$axios.$post('/api/admin/article', data).then(resp => {
            if (resp.code === 1) {
              self.initialData = resp.data.article;
              history.replaceState(
                null,
                '',
                                `${location.protocol}//${location.host}${location.pathname}?uid=${self.initialData._id}`
              );
              self.$message.success('新建草稿成功！');
            } else {
              console.error(resp.message);
              self.$message.error('操作失败！');
            }
          });
        }
      });
    },
    unpublish () {
      const self = this;
      this.$confirm({
        title: '确定要取消发布吗？',
        content: '文章将变成草稿状态，只有你自己可见。',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$put(
                '/api/admin/article',
                {
                  isDraft: true
                },
                {
                  params: {
                    uid: self.initialData._id,
                    pubtype: 'unpublish'
                  }
                }
              )
              .then(resp => {
                if (resp.code === 1) {
                  self.initialData = resp.data.article;
                  resolve();
                  self.$message.success('取消发布成功！');
                } else {
                  console.error(resp.message);
                  reject(resp.message);
                  self.$message.error('操作失败！');
                }
              });
          });
        }
      });
    },
    save () {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: (this.$refs.editor as any).invoke('getMarkdown'),
            ...values
          };
          this.$axios
            .$put('/api/admin/article', data, {
              params: {
                uid: this.initialData._id
              }
            })
            .then(resp => {
              if (resp.code === 1) {
                self.$message.success('保存成功！');
              } else {
                console.error(resp.message);
                self.$message.error('操作失败！');
              }
            });
        }
      });
    }
  }
});
</script>

<style scoped>
.link-category-btn {
  display: block;
  padding: 8px 12px;
}

.editor-footer {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-color: #e5e5e5;
  border-style: solid;
  border-width: 0 1px 1px;
  align-items: center;
  padding: 2px 10px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  user-select: none;
}

.title-line {
  display: flex;
}

.title-line .ant-form-item:nth-child(1) {
  flex: 1;
}

.title-line .ant-form-item:nth-child(2) {
  width: 200px;
  margin-left: 10px;
}

.btn-wrap {
  margin-top: 30px;
}
</style>
<style>
.article-edit .te-preview {
  padding-top: 15px !important;
  background: #fff;
}

.article-edit .tui-editor-defaultUI {
  line-height: 18px;
}

.article-edit .tui-editor-defaultUI-toolbar {
  padding-left: 10px;
}

.article-edit .tui-editor-defaultUI button.tui-scrollsync.active {
  color: #1890ff;
}
</style>
