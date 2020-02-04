<template>
  <div class="admin-index">
    <div class="page-header">
      数据统计
    </div>
    <div class="stats-body">
      <a-row>
        <a-col :md="24" :lg="8">
          <div class="stats-panel">
            <a-row>
              <a-col :xs="24" :sm="12">
                <div class="left-stats">
                  <h3>创作中文章</h3>
                  <div class="primary-div">
                    <a @click="clickStats('draft')">{{ postsStats.draft }}</a>
                    <span>篇</span>
                  </div>
                  <div class="btn-new">
                    <nuxt-link class="ant-btn ant-btn-dashed" to="/admin/article-edit">
                      <font-awesome-icon :icon="['fas', 'plus']" style="margin-right: 4px;" />新的文章
                    </nuxt-link>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="right-stats">
                  <div>
                    7天内发布
                    <a @click="clickStats('posts7')">{{ postsStats.oneweek }}</a>
                    <span>篇</span>
                  </div>
                  <div>
                    30天内发布
                    <a @click="clickStats('posts30')">{{ postsStats.onemonth }}</a>
                    <span>篇</span>
                  </div>
                  <div>
                    总计发布
                    <a @click="clickStats('postsAll')">{{ postsStats.totalPosts }}</a>
                    <span>篇</span>
                  </div>
                  <div>
                    全部分类
                    <nuxt-link to="/admin/category-manage">
                      {{ postsStats.totalCategories }}
                    </nuxt-link>
                    <span>个</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :md="24" :lg="8">
          <div class="stats-panel">
            <a-row>
              <a-col :xs="24" :sm="12">
                <div class="left-stats">
                  <h3>今日评论</h3>
                  <div class="primary-div">
                    <a @click="clickStats('commentsToday')">{{ commentsStats.today }}</a>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="right-stats">
                  <div>
                    昨日评论
                    <a @click="clickStats('commentsYesterday')">{{ commentsStats.yesterday }}</a>
                    <span>条</span>
                  </div>
                  <div>
                    7天内评论
                    <a @click="clickStats('comments7')">{{ commentsStats.oneweek }}</a>
                    <span>条</span>
                  </div>
                  <div>
                    30天内评论
                    <a @click="clickStats('comments30')">{{ commentsStats.onemonth }}</a>
                    <span>条</span>
                  </div>
                  <div>
                    全部评论
                    <nuxt-link to="/admin/comment-manage">
                      {{ commentsStats.total }}
                    </nuxt-link>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :md="24" :lg="8">
          <div class="stats-panel">
            <a-row>
              <a-col :xs="24" :sm="12">
                <div class="left-stats">
                  <h3>今日留言</h3>
                  <div class="primary-div">
                    <a @click="clickStats('guestbookToday')">{{ guestbookStats.today }}</a>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="right-stats">
                  <div>
                    昨日留言
                    <a @click="clickStats('guestbookYesterday')">{{ guestbookStats.yesterday }}</a>
                    <span>条</span>
                  </div>
                  <div>
                    7天内留言
                    <a @click="clickStats('guestbook7')">{{ guestbookStats.oneweek }}</a>
                    <span>条</span>
                  </div>
                  <div>
                    30天内留言
                    <a @click="clickStats('guestbook30')">{{ guestbookStats.onemonth }}</a>
                    <span>条</span>
                  </div>
                  <div>
                    全部留言
                    <nuxt-link to="/admin/guestbook-manage">
                      {{ guestbookStats.total }}
                    </nuxt-link>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :lg="12" :xl="8">
          <div class="stats-panel">
            <ve-pie ref="chart1" :data="categoryChartData" :events="{ click: clickCategory }" />
            <div class="stats-name">
              文章分类数据统计
            </div>
          </div>
        </a-col>
        <a-col :md="24" :lg="12" :xl="16">
          <div class="stats-panel">
            <ve-bar
              ref="chart2"
              :data="commentsAndGuestbookChartData"
              :extend="extend"
              :events="{ click: clickCommentsGuest }"
            />
            <div class="stats-name">
              近一周评论与留言数量
            </div>
          </div>
        </a-col>
      </a-row>
      <div class="baidu-stats">
        <a-button
          v-if="settings.enableStatistics"
          type="primary"
          shape="round"
          href="https://tongji.baidu.com/web/homepage/index"
          target="_blank"
        >
          <web-font icon="external-link" style="margin-right: 4px;" />前往百度统计官网查看访问数据
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VePie from 'v-charts/lib/pie';
import VeBar from 'v-charts/lib/histogram';
import moment from 'moment';
export default Vue.extend({
  name: 'PageAdminIndex',
  layout: 'admin',
  components: {
    VePie,
    VeBar
  },
  data () {
    return {
      settings: this.$store.state.settings,
      commentsStats: {
        today: 0,
        yesterday: 0,
        oneweek: 0,
        onemonth: 0,
        total: 0
      },
      guestbookStats: {
        today: 0,
        yesterday: 0,
        oneweek: 0,
        onemonth: 0,
        total: 0
      },
      postsStats: {
        draft: 0,
        oneweek: 0,
        onemonth: 0,
        totalPosts: 0,
        totalCategories: 0
      },
      categoriesStats: [],
      commentsAndGuestbookStats: {
        commentsStats: {},
        guestbookStats: {}
      },
      extend: {
        series: {
          label: { show: true, position: 'top' }
        }
      }
    };
  },
  computed: {
    categoryChartData () {
      const columns = ['分类', '文章数'];
      const rows: any[] = [];
      this.categoriesStats.forEach((item: any) => {
        rows.push({
          分类: item.cateName,
          文章数: item.postsCount
        });
      });
      return {
        columns,
        rows
      };
    },
    commentsAndGuestbookChartData () {
      const columns = ['日期', '评论数', '留言数'];
      const rows: any[] = [];
      const commentsStats = this.commentsAndGuestbookStats.commentsStats;
      Object.keys(commentsStats).forEach(date => {
        rows.push({
          日期: date,
          评论数: commentsStats[date]
        });
      });
      const guestbookStats = this.commentsAndGuestbookStats.guestbookStats;
      Object.keys(guestbookStats).forEach((date, index) => {
        rows[index]['留言数'] = guestbookStats[date];
      });
      return {
        columns,
        rows
      };
    }
  },
  created () {
    this.$axios.$get('/api/admin/commentsStats').then(({ code, data }) => {
      if (code === 1) {
        this.commentsStats = data;
      }
    });
    this.$axios.$get('/api/admin/guestbookStats').then(({ code, data }) => {
      if (code === 1) {
        this.guestbookStats = data;
      }
    });
    this.$axios.$get('/api/admin/postsStats').then(({ code, data }) => {
      if (code === 1) {
        this.postsStats = data;
      }
    });
    this.$axios.$get('/api/admin/categoriesStats').then(({ code, data }) => {
      if (code === 1) {
        this.categoriesStats = data;
      }
    });
    this.$axios.$get('/api/admin/commentsAndGuestbookStats').then(({ code, data }) => {
      if (code === 1) {
        this.commentsAndGuestbookStats = data;
      }
    });
  },
  mounted () {
    this.$bus.$on('changeLayout', () => {
      this.$nextTick(() => {
        if (this.$refs.chart1) {
          (this.$refs.chart1 as any).echarts.resize();
          (this.$refs.chart2 as any).echarts.resize();
        }
      });
    });
  },
  methods: {
    clickStats (type) {
      let url = '/admin';
      switch (type) {
        case 'draft':
          url = '/admin/article-manage?isDraft=1&isDeleted=-1';
          break;
        case 'posts7':
          url = `/admin/article-manage?isDraft=-1&isDeleted=-1&createTime=${moment()
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'posts30':
          url = `/admin/article-manage?isDraft=-1&isDeleted=-1&createTime=${moment()
                        .subtract(30, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'postsAll':
          url = '/admin/article-manage?isDraft=-1&isDeleted=-1';
          break;
        case 'commentsToday':
          url = `/admin/comment-manage?createTime=${moment().format(
                        'YYYY-MM-DD'
                    )}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'commentsYesterday':
          url = `/admin/comment-manage?createTime=${moment()
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment()
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD')}`;
          break;
        case 'comments7':
          url = `/admin/comment-manage?createTime=${moment()
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'comments30':
          url = `/admin/comment-manage?createTime=${moment()
                        .subtract(30, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'guestbookToday':
          url = `/admin/guestbook-manage?createTime=${moment().format(
                        'YYYY-MM-DD'
                    )}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'guestbookYesterday':
          url = `/admin/guestbook-manage?createTime=${moment()
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment()
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD')}`;
          break;
        case 'guestbook7':
          url = `/admin/guestbook-manage?createTime=${moment()
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
        case 'guestbook30':
          url = `/admin/guestbook-manage?createTime=${moment()
                        .subtract(30, 'days')
                        .format('YYYY-MM-DD')}&createTime=${moment().format('YYYY-MM-DD')}`;
          break;
      }
      this.$router.push(url);
    },

    clickCategory (e) {
      this.$router.push(`/admin/article-manage?cateName=${e.data.name}`);
    },

    clickCommentsGuest (e) {
      this.$router.push(
                `/admin/${
                    e.seriesName === '留言数' ? 'guestbook' : 'comment'
                }-manage?createTime=${e.name}&createTime=${e.name}`
      );
    }
  }
});
</script>

<style scoped>
.stats-body {
  padding: 10px;
  min-height: 80vh;
}

.stats-panel {
  background: #fff;
  border-radius: 5px;
  margin: 15px;
  color: #777;
  padding: 20px 20px 5px;
}

.left-stats,
.right-stats {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 15px;
}

.left-stats h3 {
  margin: 0;
  font-weight: 500;
  color: #444;
}

.right-stats div {
  line-height: 1;
}

.right-stats a {
  font-weight: 500;
}

.primary-div {
  color: #555;
  display: flex;
  align-items: flex-end;
}

.primary-div a {
  font-size: 36px;
  line-height: 30px;
  margin-right: 8px;
}

.primary-div span {
  line-height: 1;
}

.stats-name {
  text-align: center;
  margin-bottom: 20px;
}

.baidu-stats {
  text-align: center;
  margin-top: 15px;
}

.baidu-stats a {
  font-size: 15px;
}
</style>
