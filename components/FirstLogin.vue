<template>
  <div class="auth-panel">
    <h2 class="auth-title">
      首次登录
    </h2>
    <p class="auth-desc">
      请先设置管理员登录密码
    </p>
    <a-form label-position="top" :form="form" class="form">
      <a-form-item label="密码" :colon="false">
        <a-input-password
          ref="pwd1"
          v-decorator="['pwd1', pwd1Opts]"
          size="large"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item label="确认密码" :colon="false">
        <a-input-password
          v-decorator="['pwd2', pwd2Opts]"
          size="large"
          placeholder="请再次输入密码"
          @keyup.enter="save"
        />
      </a-form-item>
    </a-form>
    <div style="text-align: right;">
      <a-button type="primary" size="large" :loading="btnLoading" @click="save">
        完成
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import md5 from 'blueimp-md5';
import { IResp } from '@/types';
export default Vue.extend({
  data () {
    return {
      btnLoading: false,
      pwd1Opts: {
        rules: [
          {
            required: true,
            message: '请输入密码！'
          },
          {
            min: 6,
            message: '密码不能少于6位！'
          },
          {
            max: 20,
            message: '密码不能多于20位！'
          }
        ]
      }
    };
  },
  computed: {
    pwd2Opts () {
      return {
        rules: [
          {
            required: true,
            message: '请输入确认密码！'
          },
          {
            validator: (this as any).compareToFirstPassword
          }
        ]
      };
    }
  },
  beforeCreate (this: any) {
    this.form = this.$form.createForm(this);
  },
  mounted () {
    (this.$refs.pwd1 as any).$children[0].focus();
  },
  methods: {
    compareToFirstPassword (_rule, value, callback) {
      const form = (this as any).form;
      if (value && value !== form.getFieldValue('pwd1')) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('两次输入的密码不一致！');
      } else {
        callback();
      }
    },
    save (this: any) {
      this.form.validateFields(async (error, values) => {
        if (!error) {
          this.btnLoading = true;
          const { code, message }: IResp = await this.$axios.$put(
            '/api/auth/account',
            {
              password: md5(values.pwd1)
            }
          );
          if (code === 1) {
            this.$emit('init');
          } else {
            console.error(message);
            this.$message.error('操作失败！');
            this.btnLoading = false;
          }
        }
      });
    }
  }
});
</script>

<style scoped>
.auth-panel .form {
  margin: 40px 0 20px;
}
</style>
