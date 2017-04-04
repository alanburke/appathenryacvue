import Vue from 'vue'
import axios from 'axios'
import trimHTML from 'trim-html'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

Vue.component('news-item', {
  props: ['item'],
  template: 
    '<article>' +
      '<h2>{{ item.title }}</h2>' +
      '<img :src="image">' +
      '<div v-html="teaser"></div>' +
    '</article>',
  computed: {
    teaser: function () {
      var teaser = trimHTML(this.item.body.value, {limit: 300, preserveTags: false})
      return teaser.html
    }
  },
  asyncComputed: {
    image: function () {
      if (this.item.field_news_image.length === undefined ) {
        var uri = this.item.field_news_image.file.uri + '.json'
        return axios.get(uri).then(response =>  response.data.url)
      }
      else {
        return new Promise((resolve, reject) => {});
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    news: [],
  },
  mounted () {
    axios.get('https://wwwathenryaccom.docksal/node.json?sort=nid&direction=DESC&limit=10&promote=1')
    .then(response => {
      this.news = response.data.list
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
})
