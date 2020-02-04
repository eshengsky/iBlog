<template>
  <div class="widget-container">
    <div class="widget-header">
      热门文章
    </div>
    <div class="widget-body">
      <a-spin :spinning="spinning" />
      <template v-if="!spinning">
        <ul v-if="list.length">
          <li v-for="(item, index) in list" :key="index">
            <nuxt-link
              class="pop-article-title"
              :to="articleUrl(item)"
              :title="item.title"
            >
              {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
        <div v-else class="no-data">
          <a-empty>
            <span slot="description">暂无内容</span>
          </a-empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IPost } from '@/types/schema';
import { IResp } from '@/types';
export default Vue.extend({
  data () {
    return {
      list: [] as Array<IPost>,
      spinning: false
    };
  },
  async created () {
    this.spinning = true;
    const { code, data }: IResp = await this.$axios.$get('/api/popArticles');
    if (code === 1) {
      this.list = data.articles;
    }
    this.spinning = false;
  },
  methods: {
    articleUrl (item: IPost) {
      if (!item.isLocal) {
        return item.url;
      }
      return `/blog/${item.category.alias}/${item.alias}`;
    }
  }
});
</script>

<style scoped>
.pop-article-title {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  max-width: 100%;
  color: #444;
  line-height: 30px;
}

.pop-article-title:hover {
    color: #2d8cf0;
}
</style>
