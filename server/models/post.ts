import { Schema, model, models, Model } from 'mongoose';
import MarkdownIt from 'markdown-it';
import MarkdownItGithubHeadings from 'markdown-it-github-headings';
import markdownItTaskLists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import { IPost } from '@/types/schema';

export class Post {
    private _model: Model<IPost>;

    constructor () {
      const schema = new Schema<IPost>(
        {
          // 标题
          title: { type: String },

          // 文章别名
          alias: { type: String },

          // 内容
          content: { type: String },

          // 分类
          category: { type: Schema.Types.ObjectId, ref: 'category' },

          // 标签
          labels: { type: Array },

          // 外链Url
          url: { type: String },

          // 浏览次数
          viewCount: { type: Number, default: 0 },

          // 是否本地文档，否则是外链
          isLocal: { type: Boolean, default: true },

          // 是否草稿
          isDraft: { type: Boolean, default: false },

          // 是否有效
          isActive: { type: Boolean, default: true },

          commentsFlag: { type: Number, default: 0 },

          // 创建时间
          createTime: { type: Date, default: new Date() },

          // 修改时间
          modifyTime: { type: Date, default: new Date() },

          // 发布时间
          publishTime: { type: Date }
        },
        {
          // 设置查询时默认返回虚拟字段
          toJSON: { virtuals: true },
          toObject: { virtuals: true }
        }
      );

      // 虚拟字段：html
      schema.virtual('html').get(function (this: any) {
        if (this.content) {
          const md = new MarkdownIt({
            html: true,
            breaks: true,
            // linkify: true,
            highlight (str, lang) {
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
                code = md.utils.escapeHtml(str);
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
            }
          }).use(MarkdownItGithubHeadings)
            .use(markdownItTaskLists);
          let html = md.render(this.content);
          html = html.replace(
            /:([\w-]+?):/g,
            '<i class="icon-emoji" style="background-image: url(/images/emojis/$1.png);"></i>'
          );
          return html;
        }
        return '';
      });

      // 虚拟字段：文章评论
      schema.virtual('comments', {
        ref: 'comment',
        foreignField: 'post',
        localField: '_id'
      });

      if (models.post) {
        this._model = models.post;
      } else {
        this._model = model<IPost>('post', schema, 'post');
      }
    }

    public get model (): Model<IPost> {
      return this._model;
    }
}
