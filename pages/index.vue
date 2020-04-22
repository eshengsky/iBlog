<template>
  <div>
    <category-list :categories="categories" />
    <div class="post-wrap">
      <div class="post-left">
        <div class="post-top">
          <div class="post-top-left">
            <a
              :class="{ active: sortBy === 'date' }"
              @click="sortList('date')"
            >日期</a>
            <a
              :class="{ active: sortBy === 'title' }"
              @click="sortList('title')"
            >标题</a>
          </div>
          <div class="post-top-right">
            <a-input-group compact>
              <a-select
                v-model="filterType"
                style="width: 75px"
                @change="filterTypeChange"
              >
                <a-select-option value="text">
                  全文
                </a-select-option>
                <a-select-option value="title">
                  标题
                </a-select-option>
                <a-select-option value="tag">
                  标签
                </a-select-option>
                <a-select-option value="date">
                  日期
                </a-select-option>
              </a-select>
              <a-input
                v-if="filterType !== 'date'"
                ref="inputComp"
                v-model="inputTxt"
                style="width: 250px"
                :placeholder="searchPhd"
                allow-clear
                @keyup.enter="search"
              />
              <a-range-picker
                v-if="filterType === 'date'"
                ref="dateComp"
                v-model="inputDateMoment"
                :disabled-date="disabledDate"
                :ranges="rangeDate"
                :default-picker-value="defaultRange"
                style="width: 250px"
              />
              <a-button @click="search">
                搜索
              </a-button>
            </a-input-group>
          </div>
        </div>
        <ul class="post-list">
          <li v-show="alertShow" class="filter-li">
            <div class="alert-filter">
              <div>
                共有<span>{{ count }}</span>条筛选结果
              </div>
              <a @click="clearSearch">清除搜索</a>
            </div>
          </li>
          <li v-for="item in posts" :key="item._id">
            <post-item :post="item" />
          </li>
          <li class="last-li">
            <div v-if="isLoading" class="dot-loading">
              <div />
              <div />
              <div />
            </div>
            <template v-else>
              <template v-if="posts.length">
                <a-button
                  v-if="hasNext"
                  class="btn-load"
                  size="large"
                  :loading="isLoading"
                  @click="loadNext"
                >
                  下一页
                </a-button>
                <div v-else class="no-more">
                  没有更多数据
                </div>
              </template>
              <div v-else class="no-data">
                <a-empty>
                  <span slot="description">暂无内容</span>
                </a-empty>
              </div>
            </template>
          </li>
        </ul>
      </div>
      <div class="post-right">
        <blog-intro v-if="settings.showBlogIntro" />
        <article-calendar @selectCalendar="selectCalendar" />
        <pop-articles />
        <pop-labels @selectLabel="selectLabel" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { allCategoryItem } from '@/server/models/category';
import { IResp } from '@/types';
import { IPost, ICategory, ISetting } from '@/types/schema';
import { Context } from '@nuxt/types/index';
import CategoryList from '@/components/CategoryList.vue';
import PostItem from '@/components/PostItem.vue';
import BlogIntro from '@/components/widgets/blogIntro.vue';
import ArticleCalendar from '@/components/widgets/articleCalendar.vue';
import PopArticles from '@/components/widgets/popArticles.vue';
import PopLabels from '@/components/widgets/popLabels.vue';
import 'highlight.js/styles/tomorrow.css';

export default Vue.extend({
  scrollToTop: true,
  components: {
    CategoryList,
    PostItem,
    BlogIntro,
    ArticleCalendar,
    PopArticles,
    PopLabels
  },
  async asyncData ({ $axios, params, error }: Context) {
    try {
      const [resp1, resp2]: Array<IResp> = await Promise.all([$axios.$get('/api/categories'), $axios.$get('/api/settings')]);
      if (resp1.code === 1 && resp2.code === 1) {
        const categories = resp1.data || [];
        categories.unshift(allCategoryItem);
        const alias = params.category || '';
        const category = categories.find(item => item.alias === alias);
        if (category) {
          const { code, data }: IResp = await $axios.$get('/api/posts', {
            params: {
              category: category._id,
              pageIndex: 1,
              pageSize: resp2.data.settings.postPageSize,
              filterType: 'text',
              keyword: '',
              sortBy: 'date'
            }
          });
          if (code === 1) {
            return {
              categories,
              category,
              posts: data.postList,
              hasNext: data.hasNext,
              count: data.count
            };
          }
          error({
            statusCode: 500,
            message: '内部服务器错误'
          });
        } else {
          error({
            statusCode: 404,
            message: '未找到该页面'
          });
        }
      } else {
        error({
          statusCode: 500,
          message: '内部服务器错误'
        });
      }
    } catch (err) {
      error({
        statusCode: 500,
        message: '内部服务器错误'
      });
    }
  },

  data () {
    return {
      categories: [],
      category: {} as ICategory,
      settings: this.$store.state.settings,
      posts: [] as Array<IPost>,
      isLoading: false,
      hasNext: false,
      count: 0,
      sortBy: 'date',
      keyword: '' as Array<string> | string,
      filterType: 'text' as ('text' | 'title' | 'tag' | 'date'),
      inputTxt: '',
      inputDateMoment: [] as Array<moment.Moment>,
      page: 1,
      pageSize: this.$store.state.settings.postPageSize,
      alertShow: false,
      defaultRange: [moment().subtract(30, 'days'), moment()],
      rangeDate: {
        今天: [moment(), moment()],
        昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        最近一周: [moment().subtract(7, 'days'), moment()],
        最近一个月: [moment().subtract(30, 'days'), moment()],
        最近一年: [moment().subtract(365, 'days'), moment()]
      }
    };
  },
  computed: {
    searchPhd (): string {
      let placeholder = '';
      switch (this.filterType) {
        case 'text':
          placeholder = '全文关键字';
          break;
        case 'title':
          placeholder = '标题关键字';
          break;
        case 'tag':
          placeholder = '标签关键字';
          break;
        default:
      }
      return placeholder;
    },
    inputDate (): Array<string> {
      const range = this.inputDateMoment;
      if (!range.length) {
        return [];
      }
      return [
        range[0].startOf('day').toString(),
        range[1].endOf('day').toString()
      ];
    }
  },
  methods: {
    disabledDate (date) {
      return date && date > moment().endOf('day');
    },
    async getPosts () {
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get('/api/posts', {
        params: {
          category: this.category._id,
          pageIndex: this.page,
          pageSize: this.pageSize,
          filterType: this.filterType,
          keyword: this.keyword,
          sortBy: this.sortBy
        }
      });

      if (code === 1) {
        this.posts.push(...data.postList);
        this.hasNext = data.hasNext;
        this.count = data.count;
      }
      this.isLoading = false;
    },
    loadNext () {
      this.page++;
      this.getPosts();
    },
    filterTypeChange () {
      if (this.filterType !== 'date') {
        this.$nextTick(() => {
          (this.$refs.inputComp as any).focus();
        });
      }
    },
    async search (checkKeyword = true) {
      let input: Array<string> | string;
      if (this.filterType === 'date') {
        input = this.inputDate;
        if (checkKeyword && !input[0] && !input[1]) {
          return;
        }
      } else {
        input = this.inputTxt;
        if (checkKeyword && !input) {
          (this.$refs.inputComp as any).focus();
          return;
        }
      }
      this.alertShow = false;
      this.posts = [];
      this.page = 1;
      this.hasNext = false;
      this.keyword = input;
      await this.getPosts();
      if (input) {
        this.alertShow = true;
      }
    },
    clearSearch () {
      this.alertShow = false;
      this.posts = [];
      this.page = 1;
      this.hasNext = false;
      this.keyword = '';
      this.inputTxt = '';
      this.inputDateMoment = [];
      this.getPosts();
    },
    sortList (sortBy) {
      if (this.sortBy === sortBy) {
        return;
      }
      this.sortBy = sortBy;
      this.search(false);
    },
    selectCalendar (inputDateMoment: [moment.Moment, moment.Moment]) {
      this.filterType = 'date';
      this.inputDateMoment = inputDateMoment;
      this.search();
    },
    selectLabel (tag) {
      this.filterType = 'tag';
      this.inputTxt = tag;
      this.search();
    }
  },
  head (this: any) {
    const settings = this.$store.state.settings as ISetting;
    const suffix = ` - ${settings.blogName}`;
    return {
      title: this.category.cateName + suffix,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: settings.blogIntro || settings.blogName
        },
        { name: 'keywords', content: settings.blogName }
      ]
    };
  }
});
</script>

<style scoped>
.post-wrap {
  padding: 25px 20px 0 265px;
  display: flex;
}

.post-left {
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  flex: 1;
}

.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  height: 59px;
  padding: 20px;
}

.post-top-left a {
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

.post-top-left a.active {
  color: #555;
}

.post-top-right {
  display: flex;
}

.post-list {
  background: #fff;
  min-height: 100%;
  padding: 20px 20px 0;
  margin-bottom: 0;
}

.btn-load {
  width: 100%;
  margin-bottom: 20px;
  font-size: 15px;
}

.no-more {
  text-align: center;
  color: #888;
  font-size: 14px;
  padding: 10px;
  user-select: none;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin: 20px 0;
  user-select: none;
}

@keyframes dot-loading {
  0% {
    transform: scale(1, 1);
    opacity: 0.5;
  }

  33.33% {
    transform: scale(1.667, 1.667);
    opacity: 1;
  }

  66.66% {
    transform: scale(1, 1);
    opacity: 0.5;
  }

  100% {
    transform: scale(1, 1);
    opacity: 0.5;
  }
}

.dot-loading {
  transform: translate(-50%, 0);
  position: absolute;
  left: 50%;
  width: 70px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.post-list li.last-li:first-of-type .dot-loading {
  margin-top: 10px;
}

.dot-loading > div {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  opacity: 0.5;
  animation: dot-loading 1.2s linear infinite;
}

.dot-loading > div:nth-child(1) {
  background: #1890ff;
}

.dot-loading > div:nth-child(2) {
  background: #1890ff;
  animation-delay: 0.4s;
}

.dot-loading > div:nth-child(3) {
  background: #1890ff;
  animation-delay: 0.8s;
}

.last-li {
  position: relative;
  height: 60px;
}

.alert-filter {
  display: flex;
  justify-content: space-between;
  border: 1px solid #abdcff;
  background-color: #f0faff;
  padding: 10px 12px;
  font-size: 14px;
  position: relative;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.5;
}

.alert-filter span {
  margin: 0 2px;
  font-weight: 500;
}

.post-right {
  width: 300px;
  margin-left: 20px;
}

.post-right .widget-container:last-child {
  margin-bottom: 0;
}

@media (max-width: 1160px) {
  .post-right {
    display: none;
  }

  .post-list {
    min-height: 100vh;
  }
}

@media (max-width: 840px) {
  .post-wrap {
    padding: 15px 0 0 0;
  }

  .post-left {
    border-radius: 5px;
  }
}

@media (max-width: 576px) {
  .post-top-right {
    display: none;
  }

  .post-left {
    border-radius: 0;
  }
}
</style>
