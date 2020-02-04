<template>
  <div class="widget-container">
    <div class="widget-header">
      热门标签
    </div>
    <div class="widget-body">
      <a-spin :spinning="spinning" />
      <template v-if="!spinning">
        <div v-if="list.length">
          <span
            v-for="(item, index) in list"
            :key="index"
            class="pop-label"
            @click="selectLabel(item._id)"
          >{{ item._id }}
          </span>
        </div>
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
import { IResp } from '@/types';
export default Vue.extend({
  data () {
    return {
      list: [],
      spinning: false
    };
  },
  async created () {
    this.spinning = true;
    const { code, data }: IResp = await this.$axios.$get('/api/popLabels');
    if (code === 1) {
      this.list = data.labels;
    }
    this.spinning = false;
  },
  methods: {
    selectLabel (label) {
      window.scrollTo(0, 0);
      this.$emit('selectLabel', label);
    }
  }
});
</script>

<style scoped>
.pop-label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #555;
  border-radius: 50px;
  background-color: #eee;
  transition: all 0.3s ease;
  padding: 3px 14px;
  margin-right: 7px;
  margin-bottom: 10px;
  cursor: pointer;
}

.pop-label:hover {
  color: #fff;
  background-color: #1890ff;
}
</style>
