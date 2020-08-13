<template>
  <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-primary" :class="{'disabled': hasPrevPage()}" v-on:click="changePage(pagination.current_page - 1)">上一頁</button>
    <button type="button" class="btn btn-light">{{pagination.current_page}}</button>
    <button type="button" class="btn btn-primary" :class="{'disabled': hasNextPage()}" v-on:click="changePage(pagination.current_page + 1)">下一頁</button>
  </div>
</template>

<script>
export default {
  name: 'paging',
  data () {
    return {
    }
  },
  props: {
    pagination: {}
  },
  methods: {
    hasPrevPage () {
      return this.pagination.current_page === 1
    },
    hasNextPage () {
      return this.pagination.current_page === this.pagination.total_pages
    },
    changePage (expectPage) {
      this.$emit('change-page', expectPage)
    }
  }
}
</script>

<style scoped>

</style>
