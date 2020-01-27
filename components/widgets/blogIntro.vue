<template>
  <div class="widget-container">
    <div class="widget-header">
      博客简介
    </div>
    <div class="widget-body">
      <template v-if="intro">
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="intro-content">{{ intro }}</div>
      </template>
      <a-empty v-else>
        <span slot="description">暂无内容</span>
      </a-empty>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    data () {
        return {
            intro: this.$store.state.settings.blogIntro
        };
    }
});
</script>

<style scoped>
.intro-content {
  white-space: pre;
}
</style>
