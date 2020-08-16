<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <!-- 导航 -->
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'your_feed'}"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'global_feed'}"
                  :to="{
                    name: 'home'
                  }"
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'tag'}"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                  exact
                >#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章列表-->
          <articleItem v-for="article in articles" :key="article.slug" :article="article" />
          <articleLoading :show="loading || articles.length === 0" :loading="loading" />

          <!-- 分页 -->
          <pagination :page="page" :totalPage="totalPage">
            <template slot-scope="{ data }">
              <nuxt-link
                class="page-link"
                :to="{
                  name: 'home',
                  query: {
                    page: data,
                    tag: $route.query.tag
                  }
                }"
                @click.native="changePage"
              >{{data}}</nuxt-link>
            </template>
          </pagination>
        </div>

        <!-- 标签 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item
                  }
                }"
                class="tag-pill tag-default"
              >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import articleItem from '@/components/articleItem'
import articleLoading from '@/components/articleLoading'
import pagination from "@/components/pagination"
import { getArticles, getYourFeedArticles } from '@/api/article.js'
import { getTags } from '@/api/tag.js'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  async asyncData ({ query }) {
    const limit = 20
    const page = Number.parseInt(query.page || 1)
    const tab = query.tab || 'global_feed'
    const tag = query.tag || ''
    const loadArticles = tab === 'your_feed'
      ? getYourFeedArticles
      : getArticles

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit: limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleRes.data
    articles.forEach(item => item.favoriteDisabled = false)
    let { tags } = tagRes.data
    return {
      articles,
      articlesCount,
      tags,
      page,
      limit,
      tab,
      tag,
      loading: false
    }
  },
  components: {
    articleItem,
    articleLoading,
    pagination
  },
  watchQuery: ['page', 'tag', 'tab'],
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit) || 0
    }
  },
  methods: {
    changePage () {
      this.loading = true
    }
  }
}
</script>