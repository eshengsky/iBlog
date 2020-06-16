<template>
  <div class="comment-body">
    <viewer :initial-value="content" :options="viewerOptions" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';
import editorEmojiPlugin from '../static/editor-emoji-plugin';
export default Vue.extend({
  props: {
    content: {
      type: String,
      default: ''
    } as PropOptions<string>
  },
  data () {
    return {
      viewerOptions: {
        plugins: [[codeSyntaxHighlight, { hljs }], editorEmojiPlugin]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      // eslint-disable-next-line no-new
      new Viewer(this.$el as HTMLElement, {
        title: false,
        zIndex: 10000
      });
    });
  }
});
</script>

<style>

</style>
