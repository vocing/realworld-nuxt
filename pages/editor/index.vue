<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  :disabled="stopClick"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  :disabled="stopClick"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  :disabled="stopClick"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tag"
                  @keypress="onKeyPress"
                  :disabled="stopClick"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list">
                  <span
                    v-for="(item, index) in article.tagList"
                    class="tag-default tag-pill ng-binding ng-scope"
                  >
                    <i class="ion-close-round" @click="removeTag(item, index)"></i>
                    {{item}}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                :disabled="stopClick"
                @click="submit"
              >Publish Article</button>
            </fieldset>
          </form>
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="message in messages">{{ filed }} {{message}}</li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from '@/api/article.js'
import MarkDownIt from 'markdown-it'
export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData ({ params }) {
    let article = {
      title: '',
      description: '',
      body: '',
      tagList: [],
    }
    if (params.slug) {
      try {
        const { data } = await getArticle(params.slug)
        article = data.article
        const md = new MarkDownIt()
        article.body = md.render(article.body)
      } catch (error) {
        console.log(error)
      }
    }
    return { article }
  },
  data () {
    return {
      stopClick: false,
      tag: '',
      errors: []
    }
  },
  methods: {
    async submit () {
      this.stopClick = true
      const loadSync = this.$route.params.slug ? updateArticle : createArticle
      try {
        const slug = this.$route.params.slug
        const { data } = slug ?
          await updateArticle(slug, { article: this.article }) :
          await createArticle({ article: this.article })
        this.$router.push(`/article/${data.article.slug}`)
      } catch (err) {
        console.dir(err)
        this.errors = err.response.data && err.response.data.errors
      }
      this.stopClick = false
    },
    onKeyPress (e) {
      if (e.keyCode == 13) {
        if (this.tag && !this.article.tagList.includes(this.tag)) {
          this.article.tagList.push(this.tag)
          this.tag = ''
        }
      }
    },
    removeTag (item, index) {
      this.article.tagList.splice(index, 1)
    }
  }
}
</script>

<style>
</style>