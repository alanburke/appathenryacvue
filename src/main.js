import Vue from 'vue'
import axios from 'axios'
import trimHTML from 'trim-html'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

let source = {
  news: [],
  errors: []
}

var newsTeaser = Vue.component('news-teaser', {
  props: ['item'],
  template: `
    <article>
      <h2>{{ item.title }}</h2>
      <img v-if="image" :src="image">
      <p v-html="teaser"></p>
    </article>
    `,
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

var newslisting = Vue.component('newslisting', {
  data: function () {
    return source
  },
  template: '<div><news-teaser v-for="item in news" v-bind:item="item.item" v-bind:key="item.nid"></news-teaser></div>'
})

var app = new Vue({
  el: '#app',
  data: source,
  mounted () {
    axios.get('https://wwwathenryaccom.docksal/node.json?sort=nid&direction=DESC&limit=10&promote=1')
    .then(response => {
      var news = [];
      var self = this;
      response.data.list.forEach(function(element) {
        self.news.push({ 'id': element.nid, 'item' : element });
      });
    })
    .catch(e => {
      console.log(e);
      this.errors.push(e)
    })
  },
})
