<template>
  <div>
    <div class="page-header">
      文章管理
    </div>
    <div class="page-body">
      <div class="filter-wrap">
        <a-form :form="form" :self-update="true">
          <a-row>
            <a-col :sm="24" :md="11" :xxl="5">
              <a-form-item label="分类" :colon="false">
                <a-select
                  v-decorator="['category', categoryOpts]"
                  placeholder="不限"
                  allow-clear
                >
                  <a-select-option
                    v-for="(item, index) in categories"
                    :key="index"
                    :value="item._id"
                  >
                    {{ item.cateName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="{ span: 11, offset: 2 }"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="Alias" :colon="false">
                <a-input
                  v-decorator="['alias']"
                  placeholder="文章Alias"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="11"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="标题" :colon="false">
                <a-input
                  v-decorator="['title']"
                  placeholder="标题关键字"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="{ span: 11, offset: 2 }" :xxl="{ span: 5, offset: 1 }">
              <a-form-item label="全文" :colon="false">
                <a-input
                  v-decorator="['content']"
                  placeholder="全文关键字"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="11"
              :xxl="5"
            >
              <a-form-item label="标签" :colon="false">
                <a-input
                  v-decorator="['label']"
                  placeholder="标签关键字"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="{ span: 11, offset: 2 }" :xxl="{ span: 5, offset: 1 }">
              <a-form-item label="发布日期" :colon="false">
                <a-range-picker
                  v-decorator="['publishTime', publishTimeOpts]"
                  :disabled-date="disabledDate"
                  :ranges="rangeDate"
                  :default-picker-value="defaultRange"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="11" :xxl="{ span: 5, offset: 1 }">
              <a-form-item label="创建日期" :colon="false">
                <a-range-picker
                  v-decorator="['createTime', createTimeOpts]"
                  :disabled-date="disabledDate"
                  :ranges="rangeDate"
                  :default-picker-value="defaultRange"
                />
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="{ span: 11, offset: 2 }"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="修改日期" :colon="false">
                <a-range-picker
                  v-decorator="['modifyTime', modifyTimeOpts]"
                  :disabled-date="disabledDate"
                  :ranges="rangeDate"
                  :default-picker-value="defaultRange"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="11" :xxl="5">
              <a-form-item label="是否外链" :colon="false">
                <a-select
                  v-decorator="['isLink']"
                  placeholder="不限"
                  allow-clear
                >
                  <a-select-option value="1">
                    是
                  </a-select-option>
                  <a-select-option value="-1">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="{ span: 11, offset: 2 }"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="是否草稿" :colon="false">
                <a-select
                  v-decorator="['isDraft', isDraftOpts]"
                  placeholder="不限"
                  allow-clear
                >
                  <a-select-option value="1">
                    是
                  </a-select-option>
                  <a-select-option value="-1">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="11"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="是否有评论" :colon="false">
                <a-select
                  v-decorator="['hasComments']"
                  placeholder="不限"
                  allow-clear
                >
                  <a-select-option value="1">
                    是
                  </a-select-option>
                  <a-select-option value="-1">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="{ span: 11, offset: 2 }"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="是否已删除" :colon="false">
                <a-select
                  v-decorator="['isDeleted', isDeletedOpts]"
                  placeholder="不限"
                  allow-clear
                >
                  <a-select-option value="1">
                    是
                  </a-select-option>
                  <a-select-option value="-1">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col>
              <a-button type="primary" @click="search">
                <font-awesome-icon
                  :icon="['fas', 'search']"
                  style="margin-right: 4px;"
                />搜索
              </a-button>
              <a-button @click="reset">
                重置
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="data-wrap">
        <div class="btn-wrap">
          <a-button type="error" :disabled="delDisabled" @click="delAll">
            <span>删除</span>
            <a-badge :count="selectedRowKeys.length" class="badge-count" />
            <span v-show="selectedRowKeys.length">项</span>
          </a-button>
          <nuxt-link class="ant-btn ant-btn-dashed" to="/admin/article-edit">
            <font-awesome-icon
              :icon="['fas', 'plus']"
              style="margin-right: 4px;"
            />新的文章
          </nuxt-link>
        </div>

        <a-table
          :data-source="postList"
          :columns="tableColumns"
          :pagination="pagination"
          row-key="_id"
          :loading="isLoading"
          :scroll="{ x: 1300 }"
          :row-selection="rowSelection"
          @change="onTableChange"
        >
          <template slot="category" slot-scope="text, row">
            <a
              class="link-category"
              :href="`/blog/${row.categories[0].alias}`"
              target="_blank"
              :title="row.categories[0].cateName"
            >{{ row.categories[0].cateName }}</a>
          </template>
          <template slot="title1" slot-scope="text, row">
            <a
              class="link-title"
              :class="{ 'title-deleted': !row.isActive }"
              :href="row.isLocal ? `/blog/${row.categories[0].alias}/${row.alias}` : row.url"
              target="_blank"
              :title="row.title"
            >
              <web-font v-if="!row.isLocal" icon="external-link" />
              <span>{{ row.title }}</span>
            </a>
          </template>
          <template slot="tags" slot-scope="text, row">
            <a-tag
              v-if="!row.isActive"
              color="volcano"
              title="已删除，所有人不可见，可恢复"
            >
              已删除
            </a-tag>
            <a-tag
              v-else-if="!row.isDraft"
              color="green"
              title="已发布，所有人可见"
            >
              已发布
            </a-tag>
            <a-tag v-else color="purple" title="草稿，仅自己可见">
              草稿
            </a-tag>
          </template>
          <template slot="createTime" slot-scope="text, row">
            {{ row.createTime | toDate }}
          </template>
          <template slot="modifyTime" slot-scope="text, row">
            {{ row.modifyTime | toDate }}
          </template>
          <template slot="publishTime" slot-scope="text, row">
            <span v-if="row.publishTime">{{ row.publishTime | toDate }} <font-awesome-icon
              class="icon-edit-time"
              :icon="['fas', 'pencil-alt']"
              @click="editPublishTime(row)"
            /></span>
            <span v-else>-</span>
          </template>
          <template slot="commentsCount" slot-scope="text, row">
            <nuxt-link
              v-if="row.commentsCount > 0"
              :to="`/admin/comment-manage?alias=${row.alias}`"
              style="font-weight: 500;"
            >
              {{ row.commentsCount }}
            </nuxt-link>
            <span v-else>0</span>
          </template>
          <template slot="action" slot-scope="text, row">
            <div class="action-td">
              <template v-if="row.isActive">
                <nuxt-link
                  class="ant-btn"
                  :to="`/admin/article-edit?uid=${row._id}`"
                  title="编辑"
                >
                  <font-awesome-icon
                    :icon="['fas', 'pencil-alt']"
                  />
                </nuxt-link>
                <a-button title="删除" @click="del(row._id)">
                  <font-awesome-icon
                    :icon="['fas', 'times']"
                  />
                </a-button>
              </template>
              <template v-else>
                <a-button title="恢复" @click="undo(row._id)">
                  <font-awesome-icon
                    :icon="['fas', 'undo']"
                  />
                </a-button>
                <a-button title="永久删除" @click="del2(row._id)">
                  <font-awesome-icon
                    :icon="['far', 'trash-alt']"
                  />
                </a-button>
              </template>
            </div>
          </template>
        </a-table>
      </div>
      <a-modal
        v-model="editingTimeObj.modal"
        title="自定义发布时间"
        :confirm-loading="editingTimeObj.loading"
        :closable="false"
        @ok="savePublishTime"
      >
        <a-date-picker v-model="editingTimeObj.publishTime" show-time :allow-clear="false" placeholder="选择发布时间" />
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { FieldDecoratorOptions } from 'ant-design-vue/types/form/form';
import { IResp } from '@/types';
import { ICategory } from '@/types/schema';
import { Context } from '@nuxt/types/index';
export default Vue.extend({
  name: 'PageArticleManage',
  layout: 'admin',
  async asyncData ({ $axios }: Context) {
    const { code, data }: IResp = await $axios.$get('/api/admin/categories');
    if (code === 1) {
      return {
        categories: data
      };
    }
  },
  data () {
    return {
      categories: [] as Array<ICategory>,
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) =>
                    `${range[0]}-${range[1]} 条，共 ${total} 条`
      },
      sortBy: 'modifyTime',
      order: 'descend',
      postList: [],
      isLoading: false,
      selectedRowKeys: [],
      rangeDate: {
        今天: [moment(), moment()],
        昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        最近一周: [moment().subtract(7, 'days'), moment()],
        最近一个月: [moment().subtract(30, 'days'), moment()],
        最近一年: [moment().subtract(365, 'days'), moment()]
      },
      defaultRange: [moment().subtract(30, 'days'), moment()],
      editingTimeObj: {
        modal: false,
        uid: '',
        publishTime: moment(),
        loading: false
      },
      tableColumns: [
        {
          title: '状态',
          key: 'tags',
          width: 90,
          align: 'center',
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '分类',
          dataIndex: 'category',
          width: 150,
          scopedSlots: { customRender: 'category' }
        },
        {
          title: '标题',
          dataIndex: 'title',
          sorter: true,
          scopedSlots: { customRender: 'title1' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '修改时间',
          dataIndex: 'modifyTime',
          width: 160,
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'modifyTime' }
        },
        {
          title: '发布时间',
          dataIndex: 'publishTime',
          width: 160,
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'publishTime' }
        },
        {
          title: '浏览数',
          dataIndex: 'viewCount',
          width: 100,
          align: 'center',
          sorter: true
        },
        {
          title: '评论数',
          dataIndex: 'commentsCount',
          width: 100,
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'commentsCount' }
        },
        {
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    };
  },

  computed: {
    categoryOpts (): FieldDecoratorOptions {
      const cateName = this.$route.query.cateName;
      let initialValue: string | undefined;
      if (cateName) {
        const category = this.categories.find(t => t.cateName === cateName);
        if (category) {
          initialValue = category._id;
        }
      }
      return {
        initialValue
      };
    },
    createTimeOpts (): FieldDecoratorOptions {
      let initialValue: Array<moment.Moment> = [];
      const createTimeParam = this.$route.query.createTime as [string, string];
      if (createTimeParam) {
        initialValue = [moment(createTimeParam[0]), moment(createTimeParam[1])];
      }
      return {
        initialValue
      };
    },
    modifyTimeOpts (): FieldDecoratorOptions {
      let initialValue: Array<moment.Moment> = [];
      const modifyTimeParam = this.$route.query.modifyTime as [string, string];
      if (modifyTimeParam) {
        initialValue = [moment(modifyTimeParam[0]), moment(modifyTimeParam[1])];
      }
      return {
        initialValue
      };
    },
    publishTimeOpts (): FieldDecoratorOptions {
      let initialValue: Array<moment.Moment> = [];
      const publishTimeParam = this.$route.query.modifyTime as [string, string];
      if (publishTimeParam) {
        initialValue = [moment(publishTimeParam[0]), moment(publishTimeParam[1])];
      }
      return {
        initialValue
      };
    },
    isDraftOpts (): FieldDecoratorOptions {
      return {
        initialValue: this.$route.query.isDraft || undefined
      };
    },
    isDeletedOpts (): FieldDecoratorOptions {
      return {
        initialValue: this.$route.query.isDeleted || undefined
      };
    },
    rowSelection (): object {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: selectedRowKeys => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: !record.isActive,
            checked: false
          }
        })
      };
    },
    delDisabled (): boolean {
      return this.selectedRowKeys.length === 0;
    }
  },

  created () {
    this.isLoading = true;
    this.$nextTick(() => {
      this.getList();
    });
  },

  methods: {
    disabledDate (date) {
      return date && date > moment().endOf('day');
    },
    search () {
      this.pagination.current = 1;
      this.getList();
    },
    async getList () {
      const values = this.form.getFieldsValue();
      const createTimeMomentArr = values.createTime;
      let createTime: string[] | undefined;
      if (createTimeMomentArr && createTimeMomentArr.length === 2) {
        createTime = [
          createTimeMomentArr[0].startOf('day').toString(),
          createTimeMomentArr[1].endOf('day').toString()
        ];
      }
      const modifyTimeMomentArr = values.modifyTime;
      let modifyTime: string[] | undefined;
      if (modifyTimeMomentArr && modifyTimeMomentArr.length === 2) {
        modifyTime = [
          modifyTimeMomentArr[0].startOf('day').toString(),
          modifyTimeMomentArr[1].endOf('day').toString()
        ];
      }
      const publishTimeMomentArr = values.publishTime;
      let publishTime: string[] | undefined;
      if (publishTimeMomentArr && publishTimeMomentArr.length === 2) {
        publishTime = [
          publishTimeMomentArr[0].startOf('day').toString(),
          publishTimeMomentArr[1].endOf('day').toString()
        ];
      }
      this.selectedRowKeys = [];
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get('/api/admin/posts', {
        params: {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          sortBy: this.sortBy,
          order: this.order,
          ...values,
          createTime,
          modifyTime,
          publishTime
        }
      });
      if (code === 1) {
        this.postList = data.postList;
        this.pagination.total = data.count;
      } else {
        this.$message.error('请求失败！');
      }
      this.isLoading = false;
    },

    reset () {
      this.form.setFieldsValue({
        category: '',
        alias: '',
        title: '',
        content: '',
        label: '',
        createTime: [],
        modifyTime: [],
        publishTime: [],
        isLink: '',
        isDraft: '',
        hasComments: '',
        isDeleted: ''
      });
      this.search();
    },

    onTableChange (pagination, _filters, sorter) {
      this.pagination = pagination;
      this.sortBy = 'modifyTime';
      this.order = 'descend';
      if (Object.keys(sorter).length) {
        this.sortBy = sorter.columnKey;
        this.order = sorter.order;
      }
      this.getList();
    },

    del (uid) {
      const self = this;
      this.$confirm({
        title: '确定要删除吗？',
        content: '文章将变成已删除状态，你可以随时恢复。',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete('/api/admin/article', {
                params: {
                  uids: uid
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success('删除成功！');
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
    delAll () {
      const self = this;
      this.$confirm({
        title: `确定要删除这${self.selectedRowKeys.length}项吗？`,
        content: '文章将变成已删除状态，你可以随时恢复。',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete('/api/admin/article', {
                params: {
                  uids: self.selectedRowKeys
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success('删除成功！');
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
    del2 (uid) {
      const self = this;
      this.$confirm({
        title: '确定要永久删除吗？',
        content: '文章将被永久删除，删除后不可恢复！',
        okText: '确定',
        cancelText: '取消',
        class: 'del2',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete('/api/admin/article', {
                params: {
                  uids: uid,
                  force: true
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success('删除成功！');
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
    undo (uid) {
      const self = this;
      this.$confirm({
        title: '确定要恢复文章吗？',
        content: '文章将变成草稿状态，你需要手动进行发布。',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$put(
                '/api/admin/article',
                {
                  isActive: true,
                  isDraft: true
                },
                {
                  params: {
                    uid
                  }
                }
              )
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success('恢复成功！');
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
    editPublishTime (item) {
      this.editingTimeObj.uid = item._id;
      this.editingTimeObj.publishTime = moment(item.publishTime);
      this.editingTimeObj.modal = true;
    },
    savePublishTime () {
      if (this.editingTimeObj.publishTime) {
        this.editingTimeObj.loading = true;
        this.$axios.$put('/api/admin/publishTime', {
          publishTime: this.editingTimeObj.publishTime
        }, {
          params: {
            uid: this.editingTimeObj.uid
          }
        }).then(resp => {
          if (resp.code === 1) {
            this.getList();
            this.$message.success('保存成功！');
          } else {
            console.error(resp.message);
            this.$message.error('操作失败！');
          }
          this.editingTimeObj.loading = false;
          this.editingTimeObj.modal = false;
        });
      }
    }
  }
});
</script>
<style scoped>
.page-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.action-td .ant-btn {
  width: 32px;
  padding: 0;
}

.btn-wrap {
  margin-bottom: 10px;
}

.data-wrap .ant-table-body {
  overflow-x: auto !important;
}

.link-category {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  max-width: 150px;
  display: inline-block;
}

.link-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  max-width: 400px;
  display: inline-block;
}

.link-title.title-deleted {
  text-decoration: line-through;
}

.data-wrap .ant-tag {
  margin-right: 0;
}

.icon-edit-time {
  font-size: 12px;
  color: #888;
  cursor: pointer;
  position: relative;
  top: -1px;
}

.icon-edit-time:hover {
  color: #555;
}
</style>
