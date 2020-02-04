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
                <tui-editor
                  ref="editor"
                  v-model="content"
                  preview-style="vertical"
                  height="70vh"
                  :options="editorOptions"
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
import { otherCategoryItem } from '@/server/models/category';
import 'highlight.js/styles/tomorrow.css';
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
    async asyncData ({ $axios, query, error }: any) {
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
            content: '',
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
            editorOptions: {
                hideModeSwitch: true,
                language: 'zh_CN',
                usageStatistics: false,
                placeholder: '请输入文章正文',
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
                    'codeblock'
                ],
                exts: ['codeblock', 'scrollSync'],
                hooks: {
                    addImageBlobHook: (this as any).onAddImageBlob
                }
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
            this.content = this.initialData.content;
        }
        this.$refs.titleInput.focus();
        this.$nextTick(() => {
            console.log(this.$refs.editor);
        });
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
        onAddImageBlob (blob, callback) {
            if (process.client && blob) {
                const formData = new FormData();
                formData.append('file', blob);
                this.$axios.$post('/api/admin/uploadImage', formData).then(resp => {
                    if (resp.code === 1) {
                        callback(resp.data.url, '');
                    } else {
                        console.error(resp.message);
                        this.$message.error('上传失败！');
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
                        content: this.content,
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
                        content: this.content,
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
                        content: this.content,
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
                        content: this.content,
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
.article-edit .tui-editor-defaultUI {
  line-height: 18px;
}
</style>
