<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="article-content" v-html="html" />
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        html: {
            type: String,
            default: ''
        }
    }
});
</script>

<style>
.article-content h1 {
    position: relative;
  font-size: 2rem;
  margin: 2.75rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px double rgba(0, 0, 0, 0.1);
}

.article-content h2 {
    position: relative;
  font-size: 1.75rem;
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px double rgba(0, 0, 0, 0.1);
}

.article-content h3 {
    position: relative;
  font-size: 1.5rem;
  margin: 2.25rem 0 1rem;
}

.article-content h4 {
    position: relative;
  font-size: 1.25rem;
  margin: 2rem 0 1rem;
}

.article-content h5 {
    position: relative;
  font-size: 1rem;
  margin: 1.75rem 0 1rem;
}

.article-content h6 {
    position: relative;
  font-size: 1rem;
  margin: 1.5rem 0 0.5rem;
}

.article-content .anchor {
  position: absolute;
    display: flex;
    height: 100%;
    align-items: center;
    left: -20px;
    opacity: 0;
    transition: opacity 0.2s;
}

.article-content h1 .anchor,
.article-content h2 .anchor {
  padding-bottom: 8px;
}

.preview-article .article-content .anchor {
  display: none;
}

.article-content h1:hover .anchor,
.article-content h2:hover .anchor,
.article-content h3:hover .anchor,
.article-content h4:hover .anchor,
.article-content h5:hover .anchor {
  opacity: 1;
}

.article-content blockquote {
    padding-left: 1rem;
    border-left: .25rem solid #e9ecef
}
</style>
