<template>
  <div class="layout-footer">
    {{ year }} © Powered by
    <a
      href="https://github.com/eshengsky/iBlog"
      target="_blank"
    >iBlog</a>
    <span v-if="settings.recordInfo" class="record-info">
      |
      <a href="http://www.beian.miit.gov.cn">{{ settings.recordInfo }}</a>
    </span>
    <span v-if="showLogin" class="admin-link">
      |
      <nuxt-link to="/admin">
        后台管理
      </nuxt-link>
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    showLogin: {
      type: Boolean,
      default: false
    } as PropOptions<boolean>
  },
  data () {
    return {
      year: new Date().getFullYear(),
      settings: this.$store.state.settings
    };
  }
});
</script>

<style scoped>
.layout-footer {
  text-align: center;
  color: #888;
  user-select: none;
  padding: 24px 0;
}

@media (max-width: 576px) {
  .record-info,
  .admin-link {
    display: none;
  }
}
</style>
