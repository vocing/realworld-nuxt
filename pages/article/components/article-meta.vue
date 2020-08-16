<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
      >{{article.author.username}}</nuxt-link>
      <span class="date">{{article.updatedAt | date('MMMM DD, YYYY')}}</span>
    </div>
    <template v-if="user.username === article.author.username">
      <nuxt-link class="btn btn-outline-secondary btn-sm" :to="`/editor/${article.slug}`">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button class="btn btn-outline-danger btn-sm" @click="deleteArticle" :disabled="stopClick">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm"
        :class="article.author.following ? 'btn-secondary' : 'btn-outline-secondary'"
        :disabled="following"
        @click="follow"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following ? 'UnFollow' : 'Follow'}} {{article.author.username}}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm"
        :class="article.favorited ? 'btn-primary' : 'btn-outline-primary'"
        @click="favorited"
        :disabled="favoriting"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Article
        <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { addFollow, deleteFollow, addFavorite, deleteFavorite, deleteArticle } from '@/api/article.js'
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  props: {
    value: {
      type: Object,
      drequired: true
    }
  },
  data () {
    return {
      article: this.value,
      stopClick: false,
      following: false,
      favoriting: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async follow () {
      this.following = true
      try {
        const { data } = this.article.author.following
          ? await deleteFollow(this.article.author.username)
          : await addFollow(this.article.author.username)
        this.article.author.following = data.profile.following
      } catch (error) {
        console.log(error)
      }
      this.following = false
    },
    async favorited () {
      this.favoriting = true
      try {
        const { data } = this.article.favorited
          ? await deleteFavorite(this.article.slug)
          : await addFavorite(this.article.slug)
        this.article.favorited = data.article.favorited
        this.article.favoritesCount = data.article.favoritesCount
      } catch (error) {
        console.log(error)
      }
      this.favoriting = false
    },
    async deleteArticle () {
      this.stopClick = true
      try {
        await deleteArticle(this.article.slug)
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
      this.stopClick = false
    }
  }
}
</script>

<style>
</style>