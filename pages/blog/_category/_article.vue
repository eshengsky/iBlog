<template>
  <div class="post-detail-wrap">
    <article class="left-wrap">
      <div class="content-wrap">
        <header class="article-title">
          <h1>{{ article.title }}</h1>
        </header>
        <main class="article-main">
          <article-content :html="article.html" />
        </main>
        <div v-if="settings.showLicense" class="license-wrap">
          <span>【END】</span>
          <p>本文链接：{{ postLink }}</p>
          <p>
            <span>版权声明：本博客所有文章除声明转载外，均采用</span>
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh"
              target="_blank"
            >BY-NC-SA 3.0</a>
            <span>许可协议。转载请注明来自</span>
            <a :href="website">{{ settings.blogName }}</a>。
          </p>
        </div>
        <div v-else class="end-wrap">
          <span>【END】</span>
        </div>
        <div class="article-views">
          <span>阅读 {{ article.viewCount }}</span>
          <span class="split-line">|</span>
          <span>发布于 {{ publishDate }}</span>
        </div>
      </div>
      <comment-list v-if="showComments" :from="2" :article-id="article._id" />
    </article>
    <aside class="side-wrap">
      <div class="side-block-container">
        <div class="side-title">
          分类
        </div>
        <div class="category-title">
          <img :src="article.category.img">
          <span>{{ article.category.cateName }}</span>
        </div>
        <nuxt-link class="ant-btn ant-btn-dashed" :to="`/blog/${article.category.alias}`">
          全部
          <span class="posts-count">{{ postsCount }}</span>
          篇文章
        </nuxt-link>
      </div>
      <div :class="{ 'sticky-wrap': menuShow }">
        <div v-show="menuShow" class="side-block-container">
          <div class="side-title">
            目录
          </div>
          <a-anchor :affix="false" :show-ink-in-fixed="true" :offset-top="75" :bounds="10">
            <a-anchor-link
              v-for="(item1, index1) in menus"
              :key="index1"
              :href="item1.href"
              :title="item1.title"
            >
              <a-anchor-link
                v-for="(item2, index2) in item1.subs"
                :key="index2"
                :href="item2.href"
                :title="item2.title"
              />
            </a-anchor-link>
          </a-anchor>
        </div>
        <pop-articles />
      </div>
    </aside>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import 'highlight.js/styles/tomorrow.css';
import CommentList from '@/components/CommentList.vue';
import PopArticles from '@/components/widgets/popArticles.vue';
import ArticleContent from '@/components/ArticleContent.vue';
import { IPost, ISetting } from '@/types/schema';
import { Context } from '@nuxt/types/index';
interface IHeading3 {
    href: string;
    title: string;
}
interface IHeading2 extends IHeading3 {
    subs: Array<IHeading3>;
}
export default Vue.extend({
  name: 'PageArticle',
  components: {
    CommentList,
    PopArticles,
    ArticleContent
  },
  async asyncData ({ $axios, params, error }: Context) {
    const alias = params.article;
    const { code, data: article } = await $axios.$get('/api/article', {
      params: {
        alias
      }
    });
    if (code === 1 && article) {
      return {
        article
      };
    } else {
      error({
        statusCode: 404,
        message: '未找到该页面'
      });
    }
  },
  data () {
    return {
      settings: this.$store.state.settings as ISetting,
      article: {} as IPost,
      menus: [] as Array<IHeading2>,
      menuShow: false,
      postsCount: 0
    };
  },
  computed: {
    postLink () {
      if (process.client) {
        return location.protocol + '//' + location.host + location.pathname;
      }
      return '';
    },
    website () {
      if (process.client) {
        return location.protocol + '//' + location.host;
      }
      return '';
    },
    stickyCls () {
      if (this.menuShow) {
        return {
          position: 'sticky',
          top: '90px'
        };
      }
      return {
        position: 'relative'
      };
    },
    publishDate (): string {
      return moment(this.article.publishTime).format('YYYY-MM-DD');
    },
    showComments (): boolean {
      if (this.article.commentsFlag === 1) {
        return true;
      }
      if (this.article.commentsFlag === -1) {
        return false;
      }
      return this.settings.enableComments;
    }
  },
  async created () {
    const { code, data } = await this.$axios.$get('/api/postsCountByCate', {
      params: {
        category: this.article.category._id
      }
    });
    if (code === 1) {
      this.postsCount = data;
    }
  },
  mounted () {
    this.scrollByHash();
    window.addEventListener('hashchange', () => {
      this.scrollByHash();
    });
    this.generateMenu();

    // 文章浏览数+1
    this.$axios.$put('/api/increaseViews', {
      postID: this.article._id
    });
  },
  methods: {
    generateMenu () {
      const result: Array<IHeading2> = [];
      const content = document.querySelector('.article-content') as HTMLElement;
      const h2All = content.querySelectorAll('h2');
      h2All.forEach(h2 => {
        const anchor = h2.querySelector('a');
        if (anchor) {
          const h2Item: IHeading2 = {
            href: `#${anchor.id}`,
            title: h2.textContent as string,
            subs: []
          };
          let nextEl = h2.nextElementSibling;
          while (nextEl && nextEl.nodeName !== 'H2') {
            if (nextEl.nodeName === 'H3') {
              const anchor = nextEl.querySelector('a');
              if (anchor) {
                h2Item.subs.push({
                  href: `#${anchor.id}`,
                  title: nextEl.textContent as string
                });
              }
            }
            nextEl = nextEl.nextElementSibling;
          }
          result.push(h2Item);
        }
      });
      if (result.length) {
        this.menus = result;
        this.menuShow = true;
      }
    },
    scrollByHash () {
      const prefix = 'user-content-';
      let hash = decodeURIComponent(location.hash);
      if (hash && hash.length > 0) {
        hash = hash.substring(1);
      }
      if (hash.indexOf(prefix) === 0) {
        history.replaceState(
          null,
          '',
          location.href.replace(/#.*/, '') + '#' + hash.replace(prefix, '')
        );
      } else {
        const anchor = document.querySelector(`#${prefix}${hash}`);
        if (anchor) {
          window.scrollTo(
            window.scrollX,
            anchor.getBoundingClientRect().top + window.scrollY - 75
          );
        }
      }
    }
  },
  head (this: any) {
    const article = this.article as IPost;
    const content = article.html.replace(/<[^>]*>/g, '').replace(/\r?\n/g, ' ');
    const desc = content.length > 170 ? (content.substring(0, 170) + '...') : content;
    let keywords = article.title;
    if (article.labels && article.labels.length) {
      keywords += ',' + article.labels.join(',');
    }
    const suffix = ` - ${this.settings.blogName}`;
    return {
      title: article.title + suffix,
      meta: [
        { hid: 'description', name: 'description', content: desc },
        { name: 'keywords', content: keywords }
      ]
    };
  }
});
</script>
<style scoped>
.post-detail-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.left-wrap {
  position: relative;
  max-width: 792px;
}

.content-wrap {
  background: #fff;
  border-radius: 5px;
  padding: 30px;
  min-height: 50vh;
  font-size: 16px;
}

.article-title {
  margin: 40px 0 100px;
  text-align: center;
}

.article-title span {
  color: #777;
}

.article-title h1 {
  font-size: 2em;
  font-weight: 500;
}

.article-content {
  min-height: 60vh;
}

.side-wrap {
  width: 260px;
  flex: none;
  margin-left: 20px;
}

.side-block-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.side-title {
  font-size: 16px;
  margin-bottom: 8px;
  user-select: none;
}

.side-wrap .category-title {
  border-top: 1px solid transparent;
  font-size: 15px;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  color: #444;
}

.side-wrap .category-title img {
  width: 25px;
  height: 25px;
  position: absolute;
}

.side-wrap .category-title span {
  padding-left: 28px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.ant-anchor-ink::before {
  width: 3px;
  background-color: #eee;
}

.license-wrap {
  position: relative;
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 13px 16px 8px;
  margin: 50px 0 20px;
  font-size: 14px;
}

.license-wrap > span,
.end-wrap span {
  position: absolute;
  left: 50%;
  top: -12px;
  transform: translate(-50%, 0);
  display: block;
  background: #fff;
  font-weight: 500;
  user-select: none;
}

.license-wrap > p {
  margin-bottom: 5px;
}

.end-wrap {
  position: relative;
  border-top: 1px solid #ddd;
  margin: 40px 0 70px;
}

.sticky-wrap {
  position: sticky;
  top: 90px;
}

.article-views {
  color: #666;
  font-size: 14px;
  margin-top: 20px;
}

.article-views .split-line {
  position: relative;
  top: -1px;
  color: #aaa;
}

@media (max-width: 890px) {
  .side-wrap {
    display: none;
  }
}

@media (max-width: 576px) {
  .post-detail-wrap {
    margin-top: 15px;
  }

  .content-wrap {
    padding: 15px;
  }
}
</style>
