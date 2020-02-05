<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="article-content" v-html="html" />
</template>

<script lang="ts">
import Vue from 'vue';
import '@/static/article.less';
export default Vue.extend({
  props: {
    html: {
      type: String,
      default: ''
    }
  }
});
</script>
