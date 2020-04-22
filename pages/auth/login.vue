<template>
  <div>
    <first-login v-if="isFirst" @init="initComplete" />
    <login-account v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FirstLogin from '@/components/FirstLogin.vue';
import LoginAccount from '@/components/LoginAccount.vue';
import { Context } from '@nuxt/types/index';
export default Vue.extend({
  name: 'PageLogin',
  layout: 'auth',
  components: {
    FirstLogin,
    LoginAccount
  },
  async asyncData ({ $axios }: Context) {
    let isFirst: boolean;
    const { code, data } = await $axios.$get('/api/auth/exists');
    if (code === 1 && !data.exists) {
      // 首次登录
      isFirst = true;
    } else {
      isFirst = false;
    }
    return {
      isFirst
    };
  },
  data () {
    return {
      isFirst: false
    };
  },
  methods: {
    initComplete () {
      this.isFirst = false;
    }
  }
});
</script>

<style scoped>
.auth-panel {
  max-width: 370px;
  margin: 13vh auto 0;
  padding: 50px 40px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}

.auth-title {
  text-align: center;
}

.auth-desc {
  color: #777;
  text-align: center;
}
</style>
