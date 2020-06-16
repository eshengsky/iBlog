<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="article-content" v-html="html" />
</template>

<script lang="ts">
import Vue from 'vue';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import '@/static/article.less';
export default Vue.extend({
  props: {
    html: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      // eslint-disable-next-line no-new
      new Viewer(document.querySelector('.article-content') as HTMLElement, {
        title: false,
        zIndex: 10000
      });
    });
  }
});
</script>
