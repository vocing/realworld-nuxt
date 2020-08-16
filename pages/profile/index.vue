<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image || '/images/smiley-cyrus.jpg'" class="user-img" />
            <h4>{{user.username}}</h4>
            <p>{{user.bio}}</p>
            <nuxt-link to="/settings" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: !$route.params.tab}"
                  :to="`/profile/${user.username}`"
                  @click.native="changeTab"
                  exact
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: $route.params.tab === 'favorites'}"
                  :to="`/profile/${user.username}/favorites`"
                  exact
                  @click.native="changeTab"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <articleItem v-for="article in articles" :key="article.slug" :article="article" />
          <articleLoading :show="loading || articles.length === 0" :loading="loading" />

          <pagination :page="page" :totalPage="totalPage">
            <template slot-scope="{ data }">
              <a class="page-link" @click="changePage(data)">{{data}}</a>
            </template>
          </pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import articleItem from '@/components/articleItem'
import articleLoading from '@/components/articleLoading'
import pagination from "@/components/pagination"
import { getArticles } from '@/api/article.js'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  components: {
    articleItem,
    articleLoading,
    pagination
  },
  data () {
    return {
      articles: [],
      articlesCount: 0,
      limit: 5,
      page: 1,
      loading: false
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit) || 0
    }
  },
  mounted () {
    this.changeTab()
  },
  methods: {
    async getArticles (favorited) {
      this.loading = true
      const params = {
        limit: this.limit,
        offset: (this.page - 1) * this.limit
      }
      params[favorited ? 'favorited' : 'author'] = this.user.username

      const articleRes = await getArticles(params)
      const { articles, articlesCount } = articleRes.data
      articles.forEach(item => item.favoriteDisabled = false)

      this.articles = articles
      this.articlesCount = articlesCount
      this.loading = false
    },
    changePage (page) {
      this.page = Number(page)
      this.getArticles()
    },
    changeTab () {
      const tab = this.$route.params.tab
      if (tab) {
        this.getArticles(tab)
      } else {
        this.getArticles(tab)
      }
    }
  }
}
</script>

<style>
</style>