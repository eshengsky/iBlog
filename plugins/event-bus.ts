import Vue from 'vue';

const eventBus = { install: () => {} };
eventBus.install = () => {
  Vue.prototype.$bus = new Vue();
};
Vue.use(eventBus);
