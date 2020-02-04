<template>
  <div>
    <div class="auth-panel">
      <h2 class="auth-title">
        修改密码
      </h2>
      <a-form label-position="top" :form="form" class="form">
        <a-form-item label="原密码" :colon="false">
          <a-input-password
            ref="pwd0"
            v-decorator="['pwd0', pwd0Opts]"
            size="large"
            placeholder="请输入原密码"
          />
        </a-form-item>
        <a-form-item label="新的密码" :colon="false">
          <a-input-password
            ref="pwd1"
            v-decorator="['pwd1', pwd1Opts]"
            size="large"
            placeholder="请输入新的密码"
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
        <a-button
          type="primary"
          size="large"
          :loading="btnLoading"
          @click="save"
        >
          完成
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import md5 from 'blueimp-md5';
import { IResp } from '@/types';
export default Vue.extend({
  name: 'PageInitAccount',
  layout: 'auth',
  data () {
    return {
      btnLoading: false,
      pwd0Opts: {
        rules: [
          {
            required: true,
            message: '请输入原密码！'
          }
        ]
      },
      pwd1Opts: {
        rules: [
          {
            required: true,
            message: '请输入新的密码！'
          },
          {
            min: 6,
            message: '密码不能少于6位！'
          },
          {
            max: 20,
            message: '密码不能多于20位！'
          },
          {
            validator: (this as any).compareToOldPassword
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
    (this.$refs.pwd0 as any).$children[0].focus();
  },
  methods: {
    compareToOldPassword (_rule, value, callback) {
      const form = (this as any).form;
      if (value && value === form.getFieldValue('pwd0')) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('新密码不能与原密码相同！');
      } else {
        callback();
      }
    },
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
          const { code, message }: IResp = await this.$axios.$post(
            '/api/auth/account',
            {
              old: md5(values.pwd0),
              password: md5(values.pwd1)
            }
          );
          if (code === 1) {
            this.$message.loading('修改成功！正在跳转登录页...');
            setTimeout(() => {
              location.href = '/auth/login';
            }, 2000);
          } else {
            this.$message.error(message);
            this.btnLoading = false;
          }
        }
      });
    }
  }
});
</script>

<style scoped>
.auth-panel {
  max-width: 370px;
  margin: 12vh auto 0;
  padding: 50px 40px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}

.auth-title {
  text-align: center;
}

.form {
  margin: 40px 0 20px;
}
</style>
