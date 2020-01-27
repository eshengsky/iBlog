import { Schema, model, models, Model } from 'mongoose';
import MarkdownIt from 'markdown-it';
import MarkdownItGithubHeadings from 'markdown-it-github-headings';
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
                alias: { type: String, unique: true },

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
                    breaks: true,
                    linkify: true,
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
                        return (
                            '<pre class="hljs"><div class="pre-header"><div class="pre-header-left"><div></div><div></div><div></div></div><div class="pre-header-right">' +
              showLang +
              '</div></div><code>' +
              code +
              '</code></pre>'
                        );
                    }
                }).use(MarkdownItGithubHeadings);
                return md.render(this.content);
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
