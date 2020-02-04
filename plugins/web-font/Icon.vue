<template>
  <component :is="compOption" />
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    compOption (): object {
      return require('./icons/' + this.icon).default;
    }
  }
});
</script>
