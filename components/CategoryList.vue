<template>
  <div class="category-wrap">
    <ul class="category-list">
      <li v-for="item in categories" :key="item._id">
        <nuxt-link :to="item.alias ? `/blog/${item.alias}` : '/'" exact active-class="active">
          <img :src="item.img">
          <span>{{ item.cateName }}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ICategory } from '@/types/schema';
export default Vue.extend({
  props: {
    categories: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<Array<ICategory>>
  }
});
</script>
<style scoped>
.category-wrap {
  width: 250px;
  top: 95px;
  bottom: 0;
  margin-left: 15px;
  position: fixed;
  z-index: 1;
  overflow: hidden;
}

.category-list li a {
  padding-left: 40px;
  font-size: 15px;
  height: 54px;
  position: relative;
  display: flex;
  align-items: center;
  color: #4F6174;
  font-weight: 500;
  margin-bottom: 3px;
  border-radius: 5px 0 0 5px;
  transition: background .3s;
}

.category-list li a.active,
.category-list li a:hover {
  background: #fff;
  box-shadow: 0 6px 10px 0px rgba(234, 234, 234, 0.8);
}

.category-list li a.active img,
.category-list li a.active span,
.category-list li a:hover img,
.category-list li a:hover span {
  transform: translateX(-2px);
}

.category-list li a.active img,
.category-list li a:hover img {
  filter: grayscale(0);
}

.category-list li a img {
  max-width: 25px;
  max-height: 25px;
  filter: grayscale(1);
  transition: all .3s;
}

.category-list li a span {
  padding-left: 8px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  transition: transform .3s;
}

@media (max-width: 840px) {
  .category-wrap {
    display: none;
  }
}
</style>
