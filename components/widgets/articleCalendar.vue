<template>
  <div class="widget-container">
    <div class="widget-header">
      博客日历
    </div>
    <a-calendar
      :fullscreen="false"
      :disabled-date="disabledDate"
      @panelChange="panelChange"
      @select="selectDate"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
export default Vue.extend({
  data () {
    return {
      dateMode: 'month' as 'month' | 'year'
    };
  },
  methods: {
    disabledDate (date) {
      if (this.dateMode === 'year') {
        return date && date > moment().endOf('month');
      }
      return date && date > moment().endOf('day');
    },
    panelChange (_date, mode: 'month' | 'year') {
      this.dateMode = mode;
    },
    selectDate (date: moment.Moment) {
      let inputDateMoment: [moment.Moment, moment.Moment];
      if (this.dateMode === 'year') {
        const start = moment(date.startOf('month'));
        const end = moment(date.endOf('month'));
        inputDateMoment = [start, end];
      } else {
        inputDateMoment = [date, date];
      }
      window.scrollTo(0, 0);
      this.$emit('selectCalendar', inputDateMoment);
    }
  }
});
</script>
