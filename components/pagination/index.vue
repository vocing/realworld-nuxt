<template>
  <nav v-show="totalPage > 1">
    <ul class="pagination">
      <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
        <slot :data="item"></slot>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true
    },
    totalPage: {
      type: [Number, Array],
      default: 0
    },
    link: {
      type: [Object, null],
      default: null
    }
  }
}
</script>

<style>
</style>