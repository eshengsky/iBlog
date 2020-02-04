<template>
  <div>
    <div class="page-header">
      分类管理
    </div>
    <div class="page-body">
      <div class="btn-wrap">
        <a-button type="error" :disabled="delDisabled" @click="delAll">
          <span>删除</span>
          <a-badge :count="selectedRowKeys.length" class="badge-count" />
          <span v-show="selectedRowKeys.length">项</span>
        </a-button>
        <a-button type="dashed" @click="addNew">
          <font-awesome-icon
            :icon="['fas', 'plus']"
            style="margin-right: 4px;"
          />新的分类
        </a-button>
      </div>
      <a-table
        :data-source="categories"
        :columns="tableColumns"
        :loading="isLoading"
        :pagination="false"
        row-key="_id"
        :scroll="{ x: 985 }"
        :row-selection="rowSelection"
      >
        <template slot="img" slot-scope="text, row">
          <img class="tb-img" :src="row.img">
        </template>
        <template slot="createTime" slot-scope="text, row">
          {{ row.createTime | toDate }}
        </template>
        <template slot="modifyTime" slot-scope="text, row">
          {{ row.modifyTime | toDate }}
        </template>
        <template slot="action" slot-scope="text, row">
          <div class="action-td">
            <a-button
              title="编辑"
              :disabled="!row._id"
              @click="editCategory(row)"
            >
              <font-awesome-icon
                :icon="['fas', 'pencil-alt']"
              />
            </a-button>
            <a-button
              title="删除"
              :disabled="['', otherCategoryId].indexOf(row._id) >= 0"
              @click="del(row._id)"
            >
              <font-awesome-icon
                :icon="['far', 'trash-alt']"
              />
            </a-button>
          </div>
        </template>
      </a-table>
      <a-modal
        v-model="isModalShow"
        :title="modalTitle"
        :confirm-loading="confirmLoading"
        :closable="false"
        :destroy-on-close="true"
        @ok="saveCategory"
      >
        <a-form label-position="top" :form="form">
          <a-form-item label="分类图标" :colon="false">
            <div class="img-tip">
              <a-icon type="info-circle" />
              <span>
                你可以在
                <a
                  href="https://www.iconfont.cn/"
                  target="_blank"
                >阿里巴巴矢量图标库</a>
                搜索和下载喜欢的图标。
              </span>
            </div>
            <a-upload
              v-decorator="['upload', imgOpts]"
              name="imgUpload"
              :show-upload-list="false"
              list-type="picture-card"
              :before-upload="beforeUpload"
              accept="image/*"
              @change="uploadChange"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="image">
              <div v-else>
                <a-icon :type="imgLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label="分类名称" :colon="false">
            <a-input
              v-decorator="['cateName', cateNameOpts]"
              placeholder="请输入名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item :colon="false">
            <span slot="label">
              Alias
              <a-tooltip title="分类别名，如：nodejs，将作为URL的一部分">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="['alias', aliasOpts]"
              placeholder="请输入Alias"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="排序" :colon="false">
            <a-input-number
              v-decorator="['sequence', sequenceOpts]"
              :min="0"
              :max="10000"
              :disabled="uid === otherCategoryId"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { IResp } from '@/types';
import { allCategoryItem, otherCategoryItem } from '@/server/models/category';
export default Vue.extend({
  name: 'PageCategoryManage',
  layout: 'admin',
  data () {
    return {
      uid: '',
      modalTitle: '',
      isModalShow: false,
      confirmLoading: false,
      categories: [],
      otherCategoryId: otherCategoryItem._id.toHexString(),
      imageUrl: '',
      imgLoading: false,
      cateNameOpts: {
        rules: [
          {
            required: true,
            message: '名称不能为空！'
          }
        ]
      },
      sequenceOpts: {
        rules: [
          {
            required: true,
            message: '排序不能为空！'
          }
        ]
      },
      selectedRowKeys: [],
      tableColumns: [
        {
          title: '排序',
          dataIndex: 'sequence',
          width: 80
        },
        {
          title: '分类图标',
          key: 'img',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'img' }
        },
        {
          title: '分类名称',
          dataIndex: 'cateName',
          width: 150
        },
        {
          title: 'Alias',
          dataIndex: 'alias'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '修改时间',
          dataIndex: 'modifyTime',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'modifyTime' }
        },
        {
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      isLoading: false
    };
  },
  computed: {
    form () {
      return this.$form.createForm(this);
    },
    aliasOpts (): object {
      return {
        rules: [
          {
            required: true,
            message: 'Alias不能为空！'
          },
          {
            validator: this.checkAlias
          }
        ]
      };
    },
    imgOpts (): object {
      return {
        rules: [
          {
            required: !this.uid,
            message: '图标不能为空！'
          }
        ]
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
            disabled:
              [allCategoryItem._id, this.otherCategoryId].includes(record._id)
          }
        })
      };
    },
    delDisabled (): boolean {
      return this.selectedRowKeys.length === 0;
    },
    maxSequence (): number {
      const arr = (this.categories as any[]).filter((item: any) => {
        return (
          ![allCategoryItem._id, this.otherCategoryId].includes(item._id)
        );
      });
      if (arr.length) {
        return arr[arr.length - 1].sequence + 10;
      }
      return 0;
    }
  },
  created () {
    this.getCategories();
  },
  methods: {
    async getCategories () {
      this.selectedRowKeys = [];
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get(
        '/api/admin/categories'
      );
      if (code === 1) {
        data.unshift(allCategoryItem);
        this.categories = data;
      } else if (process.client) {
        this.$message.error('请求失败！');
      }
      this.isLoading = false;
    },

    checkAlias (_rule, value, callback): void {
      if (value) {
        this.$axios
          .$get('/api/admin/checkCategoryAlias', {
            params: {
              alias: value,
              excludeUid: this.uid
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

    addNew () {
      this.uid = '';
      this.imageUrl = '';
      this.modalTitle = '新增分类';
      this.isModalShow = true;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          sequence: this.maxSequence
        });
      });
    },

    editCategory (item) {
      this.uid = item._id;
      this.modalTitle = '编辑分类';
      this.isModalShow = true;
      this.$nextTick(() => {
        this.imageUrl = item.img;
        this.form.setFieldsValue({
          cateName: item.cateName,
          alias: item.alias,
          sequence: item.sequence
        });
      });
    },

    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    del (uid) {
      const self = this;
      this.$confirm({
        title: '确定要删除吗？',
        content: '删除后不可恢复，该分类下的所有文章将被自动归入未分类！',
        okText: '确定',
        cancelText: '取消',
        class: 'del2',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete('/api/admin/category', {
                params: {
                  uids: uid
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.getCategories().then(resolve);
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
        content: '删除后不可恢复，该分类下的所有文章将被自动归入未分类！',
        okText: '确定',
        cancelText: '取消',
        class: 'del2',
        onOk () {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete('/api/admin/category', {
                params: {
                  uids: self.selectedRowKeys
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.getCategories().then(resolve);
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
          this.imageUrl = imageUrl;
          this.imgLoading = false;
        });
      }
    },

    saveCategory () {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          this.confirmLoading = true;
          const data = {
            cateName: values.cateName,
            alias: values.alias,
            sequence: values.sequence,
            img: this.imageUrl
          };
          const done = resp => {
            if (resp.code === 1) {
              this.getCategories();
              this.$message.success('保存成功！');
            } else {
              console.error(resp.message);
              this.$message.error('操作失败！');
            }
            this.confirmLoading = false;
            this.isModalShow = false;
          };
          if (!this.uid) {
            // 新增
            this.$axios.$post('/api/admin/category', data).then(resp => {
              done(resp);
            });
          } else {
            // 编辑
            this.$axios
              .$put('/api/admin/category', data, {
                params: {
                  uid: this.uid
                }
              })
              .then(resp => {
                done(resp);
              });
          }
        }
      });
    }
  }
});
</script>
<style scoped>
.action-td .ant-btn {
  width: 32px;
  padding: 0;
}

.btn-wrap {
  margin-bottom: 10px;
}

.tb-img {
  width: 25px;
  height: 25px;
}

.ant-table-body {
  overflow-x: auto !important;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #777;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.img-tip {
  font-size: 12px;
  line-height: 1;
  margin: 2px 0 17px;
}

.img-tip i {
  position: relative;
  top: -1px;
}
</style>
<style>
.has-error .ant-upload.ant-upload-select.ant-upload-select-picture-card {
  border-color: #f5222d;
}
</style>
