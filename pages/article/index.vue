<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{article.title}}</h1>
        <article-meta v-model="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="article.body"></div>
          <ul class="tag-list">
            <li
              v-for="(item, index) in article.tagList"
              class="tag-default tag-pill tag-outline ng-binding ng-scope"
            >{{item}}</li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta v-model="article" />
      </div>

      <div class="row">
        <article-comments :article="article" />
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api/article.js'
import MarkDownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'

export default {
  middleware: 'authenticated',
  name: 'ArticleIndex',
  async asyncData ({ params, store }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkDownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  head () {
    return {
      title: `${this.article.title}-RealWorld`,
      meta: [
        /**
         * 为了避免子组件中的 meta 标签不能正确覆盖父组件中相同的标签而产生重复的现象
         * 建议利用 hid 键为 meta 标签配一个唯一的标识编号
         */
        { hid: 'description', name: 'decription', content: this.article.description }
      ]
    }
  }
}
</script>

<style>
</style>