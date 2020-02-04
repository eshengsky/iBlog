<template>
  <a-locale-provider :locale="zhCN">
    <div class="container">
      <div class="left-top-header">
        <nuxt-link to="/">
          <img :src="settings.blogLogo">
          <h4>
            {{ settings.blogName }}
            <p v-if="settings.blogSlogan">
              {{ settings.blogSlogan }}
            </p>
          </h4>
        </nuxt-link>
      </div>
      <div class="auth-wrap">
        <nuxt />
      </div>
      <layout-footer />
    </div>
  </a-locale-provider>
</template>
<script lang="ts">
import Vue from 'vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import LayoutFooter from '@/components/LayoutFooter.vue';
export default Vue.extend({
  components: {
    LayoutFooter
  },
  data () {
    return {
      settings: this.$store.state.settings,
      zhCN
    };
  }
});
</script>
<style scoped>
.auth-wrap {
  min-height: 70vh;
}

.left-top-header {
  position: fixed;
  top: 0;
  left: 15px;
  display: flex;
  height: 70px;
  align-items: center;
}

.left-top-header a {
  display: -webkit-box;
  display: flex;
  box-align: center;
  align-items: center;
  height: 100%;
  color: #2b2b2b;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, "Arial", "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.left-top-header a img {
  height: 46px;
  margin-right: 5px;
}

.left-top-header a h4 {
    margin: 0;
}
</style>
