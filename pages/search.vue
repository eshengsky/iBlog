<template>
  <div class="page-wrap">
    <div class="search-wrap">
      <div class="filter-wrap">
        <a-input-group compact>
          <a-select
            v-model="filterType"
            size="large"
            class="filter-type"
            @change="filterTypeChange"
          >
            <a-select-option value="title">
              标题
            </a-select-option>
            <a-select-option value="text">
              全文
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
            :placeholder="searchPhd"
            allow-clear
            size="large"
            class="input-ele"
            @on-enter="search"
          />
          <a-range-picker
            v-if="filterType === 'date'"
            ref="dateComp"
            v-model="inputDateMoment"
            :disabled-date="disabledDate"
            :ranges="rangeDate"
            :default-picker-value="defaultRange"
            size="large"
            class="input-ele"
          />
          <a-button
            type="primary"
            size="large"
            class="search-btn"
            @click="search"
          >
            <font-awesome-icon
              :icon="['fas', 'search']"
              style="margin-right: 5px;"
            />搜索
          </a-button>
        </a-input-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
export default Vue.extend({
  name: 'PageSearch',
  data () {
    return {
      filterType: 'title',
      inputTxt: '',
      inputDateMoment: [] as Array<moment.Moment>,
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
    filterTypeChange () {
      if (this.filterType !== 'date') {
        this.$nextTick(() => {
          (this.$refs.inputComp as any).focus();
        });
      }
    },
    async search () {}
  }
});
</script>

<style scoped>
.page-wrap {
  background: #f3f3f4;
  min-height: 100vh;
  padding-top: 30px;
}

.search-wrap {
  max-width: 1012px;
  margin: 0 auto;
  padding: 40px 30px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  transition: width 0.3s;
  min-height: 400px;
}

.filter-type {
  width: 90px;
  text-align: center;
}

.search-btn {
  width: 90px;
}

.input-ele {
  width: calc(100% - 180px) !important;
}
</style>
