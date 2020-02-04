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
          <a-textarea
            v-decorator="['introduction', {
              rules: [
                {
                  required: true,
                  message: '自我介绍不能为空！'
                }
              ]
            }]"
            placeholder="请输入自我介绍，换行符会保留"
            :rows="3"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IResp } from '@/types';
import { IProfile } from '@/types/schema';
export default Vue.extend({
  name: 'PageProfileSettings',
  layout: 'admin',
  data () {
    return {
      form: this.$form.createForm(this),
      imgLoading: false,
      avatar: ''
    };
  },
  async mounted () {
    const { code, data }: IResp = await this.$axios.$get('/api/profile');
    if (code === 1 && data.profile) {
      const profile: IProfile = data.profile;
      this.avatar = profile.avatar;
      this.form.setFieldsValue({
        enName: profile.enName,
        cnName: profile.cnName,
        introduction: profile.introduction,
        github: profile.github,
        email: profile.email
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

<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #777;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.btn-save {
  margin-top: 15px;
}
</style>
