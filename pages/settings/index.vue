<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="submit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  :disabled="stopClick"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  :disabled="stopClick"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  :disabled="stopClick"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  :disabled="stopClick"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  :disabled="stopClick"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="stopClick"
              >Update Settings</button>
            </fieldset>
          </form>
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="message in messages">{{ filed }} {{message}}</li>
            </template>
          </ul>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">Or click here to logout.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from '@/api/user.js'
import { mapMutations } from 'vuex'
import Cookie from 'js-cookie'
export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data () {
    return {
      stopClick: false,
      user: {
        image: '',
        username: '',
        bio: '',
        email: '',
        password: ''
      },
      errors: []
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async submit () {
      this.stopClick = true
      console.log(this.user)
      try {
        await updateUser({ user: this.user })
        this.$router.push(`profile/${this.user.username}`)
      } catch (err) {
        console.dir(err)
        this.errors = err.response.data && err.response.data.errors
      }
      this.stopClick = false
    },
    logout () {
      console.log('logout')
      this.setUser('')
      Cookie.set('user', '', -1)
      this.$router.push('/')
    }
  }
}
</script>

<style>
</style>