<template>
  <div
    class="article-preview ng-hide"
    v-show="show"
  >{{ loading ? 'Loading articles...' : 'No articles are here... yet.' }}</div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>