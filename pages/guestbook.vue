<template>
  <div class="guestbook-wrap">
    <article class="list-wrap">
      <comment-list :from="1" />
    </article>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import CommentList from '@/components/CommentList.vue';
import 'highlight.js/styles/tomorrow.css';
import { ISetting } from '@/types/schema';
export default Vue.extend({
  name: 'PageGuestBook',
  components: {
    CommentList
  },
  head (this: any) {
    const settings = this.$store.state.settings as ISetting;
    const suffix = ` - ${settings.blogName}`;
    return {
      title: '留言' + suffix,
      meta: [
        { hid: 'description', name: 'description', content: settings.blogIntro || settings.blogName },
        { name: 'keywords', content: settings.blogName }
      ]
    };
  }
});
</script>
<style scoped>
.guestbook-wrap {
  background: #f3f3f4;
  min-height: 85vh;
  padding-top: 20px;
}
.list-wrap {
  max-width: 1012px;
  margin: 0 auto 20px;
  padding-bottom: 40px;
}
</style>
