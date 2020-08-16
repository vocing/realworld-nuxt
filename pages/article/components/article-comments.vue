<template>
  <div class="col-xs-12 col-md-8 offset-md-2">
    <form @submit.prevent="addComments" class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="comment"></textarea>
      </div>
      <div class="card-footer">
        <img :src="article.author.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>&nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >{{comment.author.username}}</nuxt-link>
        <span class="date-posted">{{comment.updatedAt | date('MMM DD, YYYY')}}</span>
        <span class="mod-options" v-show="user.username === comment.author.username">
          <i class="ion-trash-a" @click="deleteComments(comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments, deleteComments } from '@/api/article.js'
import { mapState } from 'vuex'
export default {
  name: 'AritcleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comment: '',
      comments: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {
    this.getComments()
  },
  methods: {
    async getComments () {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    async addComments () {
      const { data } = await addComments(this.article.slug, {
        comment: {
          body: this.comment
        }
      })
      this.comment = ''
      this.comments.unshift(data.comment)
    },
    async deleteComments (comment) {
      const { data } = await deleteComments(this.article.slug, comment.id)
      const currentIndex = this.comments.indexOf(comment)
      if (currentIndex !== -1) {
        this.comments.splice(currentIndex, 1)
      }
    }
  }
}
</script>

<style>
</style>