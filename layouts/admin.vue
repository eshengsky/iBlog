<template>
  <a-locale-provider :locale="zhCN">
    <a-layout class="layout-admin">
      <a-layout-sider
        v-model="collapsed"
        :trigger="null"
        breakpoint="lg"
        collapsible
        class="layout-sider"
      >
        <div class="sider-header">
          <nuxt-link to="/" title="iBlog">
            <img src="/images/iBlog-logo.png">
          </nuxt-link>
          <h4>后台管理</h4>
        </div>
        <a-menu theme="dark" mode="inline" :selected-keys="[currentKey]">
          <a-menu-item key="index" title="数据统计">
            <nuxt-link to="/admin">
              <font-awesome-icon
                :icon="['fas', 'chart-line']"
                fixed-width
              />
              <span>数据统计</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="article-manage" title="文章管理">
            <nuxt-link to="/admin/article-manage">
              <font-awesome-icon
                :icon="['fas', 'pen-nib']"
                fixed-width
              />
              <span>文章管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="category-manage" title="分类管理">
            <nuxt-link to="/admin/category-manage">
              <font-awesome-icon
                :icon="['fas', 'map-signs']"
                fixed-width
              />
              <span>分类管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="comment-manage" title="评论管理">
            <nuxt-link to="/admin/comment-manage">
              <font-awesome-icon
                :icon="['fas', 'comments']"
                fixed-width
              />
              <span>评论管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="guestbook-manage" title="留言管理">
            <nuxt-link to="/admin/guestbook-manage">
              <font-awesome-icon
                :icon="['fas', 'comment-dots']"
                fixed-width
              />
              <span>留言管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="profile-settings" title="关于管理">
            <nuxt-link to="/admin/profile-settings">
              <font-awesome-icon
                :icon="['fas', 'user']"
                fixed-width
              />
              <span>关于管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="system-settings" title="系统设置">
            <nuxt-link to="/admin/system-settings">
              <font-awesome-icon
                :icon="['fas', 'cogs']"
                fixed-width
              />
              <span>系统设置</span>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout :style="{ marginLeft }" style="transition: all .2s;">
        <a-layout-header class="layout-header">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggleCollapsed"
          />
          <div class="auth-actions">
            <a-dropdown placement="bottomRight">
              <span>
                Admin
                <a-icon type="down" />
              </span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="/auth/change-password">
                    <font-awesome-icon
                      :icon="['fas', 'key']"
                      style="margin-right: 5px;"
                    />修改密码
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a title="退出登录" @click="logout">
                    <font-awesome-icon
                      :icon="['fas', 'sign-out-alt']"
                      style="margin-right: 5px;"
                    />退出登录
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content>
          <nuxt />
        </a-layout-content>
        <layout-footer />
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>
<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import LayoutFooter from '@/components/LayoutFooter.vue';
Vue.filter('toDate', (date: string) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
});
export default Vue.extend({
  middleware: 'auth',
  components: {
    LayoutFooter
  },
  data () {
    return {
      collapsed: false,
      year: new Date().getFullYear(),
      zhCN,
      currentKey: ''
    };
  },
  computed: {
    marginLeft (): string {
      return this.collapsed ? '80px' : '200px';
    }
  },
  created () {
    this.currentKey = this.getCurrentKey(this.$route.path);
    this.$router.afterEach(to => {
      this.currentKey = this.getCurrentKey(to.path);
    });
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed;
      this.$bus.$emit('changeLayout');
    },
    logout (this: any) {
      this.$auth.logout('local');
    },
    getCurrentKey (originalPath) {
      let path = originalPath.replace('/admin', '');
      if (path.substring(0, 1) === '/') {
        path = path.substring(1);
      }
      if (path.substring(path.length - 1) === '/') {
        path = path.substring(0, path.length - 1);
      }
      if (!path) {
        return 'index';
      }
      if (path === 'article-edit') {
        return 'article-manage';
      }
      return path;
    }
  }
});
</script>
<style scoped>
.sider-header {
  padding: 25px;
  transition: all 0.2s;
  background: url("/images/header-sider.png") no-repeat;
}

.sider-header img {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  transition: all 0.2s;
}

.sider-header h4 {
  color: #dfe4ed;
}

.layout-admin .trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}

.layout-admin .trigger:hover {
  color: #1890ff;
}

.layout-sider {
  overflow-y: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  background: #f3f3f4;
  border-bottom: 1px solid #e7eaec;
}

.auth-actions {
  color: #777;
  font-weight: 500;
}

.auth-actions span {
  cursor: pointer;
  margin-right: 4px;
}

.auth-actions a {
  color: #777;
}

.ant-menu-item svg {
  margin-right: 8px;
}

.ant-menu-inline-collapsed > .ant-menu-item {
  padding: 0 24px !important;
}

.ant-layout-sider-collapsed .sider-header {
  padding-left: 15px;
  padding-right: 15px;
}

.ant-layout-sider-collapsed .sider-header img {
  width: 45px;
  height: 45px;
}

.ant-layout-sider-collapsed .sider-header h4 {
  display: none;
}

.ant-layout-sider-collapsed .ant-menu-item svg {
  font-size: 16px;
}

.ant-layout-sider-collapsed .ant-menu-item span {
  opacity: 0;
}

.ant-layout-sider,
.ant-menu-dark {
  background-color: #2f4050;
}

.ant-menu.ant-menu-dark .ant-menu-item {
  border-left: 4px solid transparent;
}

.ant-menu.ant-menu-dark .ant-menu-item-selected {
  border-left: 4px solid #1890ff;
  background: #293846;
}
</style>
<style>
.page-header {
  background: #fff;
  font-size: 20px;
  font-weight: 300;
  padding: 16px 25px;
  border-bottom: 1px solid #e7eaec;
  user-select: none;
}

.page-body {
  margin: 25px 25px 0;
  padding: 25px;
  background: rgb(255, 255, 255);
  min-height: 80vh;
  border-radius: 5px;
}

.filter-wrap {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}

.del2 .ant-modal-confirm-content {
  color: #fa541c;
}

.badge-count {
  top: -2px;
}

.badge-count sup {
  background: #fff;
  padding: 0;
  color: #666;
  font-weight: bold;
  min-width: 12px;
}
</style>
