import Vue from 'vue'
import axios from 'axios'
import trimHTML from 'trim-html'
import moment from 'moment'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

let source = {
  news: [],
  errors: []
}

var newsTeaser = Vue.component('news-teaser', {
  props: ['item'],
  template: `
    <div class="box">
      <article class="media">
        <div v-if="image" class="media-left">
          <figure class="image">
            <img v-if="image" :src="image">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <h2 class="title">{{ item.title }}</h2>
            <p class="subtitle"><small>Published {{ published }} </small></p>
            <p v-html="teaser"></p>
            <p><a v-bind:href=item.url>Read full story&hellip;</a></p>
          </div>
        </div>
      </article>
    </div>
    `,
  computed: {
    teaser: function () {
      var teaser = trimHTML(this.item.body.value, {limit: 300, preserveTags: false})
      return teaser.html
    },
    published: function () {
      return moment.unix(this.item.created).format("Do MMMM YYYY")
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
  template: '<section class="section"><news-teaser v-for="item in news" v-bind:item="item.item" v-bind:key="item.nid"></news-teaser></section>'
})

var app = new Vue({
  el: '#app',
  data: source,
  mounted () {
    axios.get('https://www.athenryac.com/node.json?sort=nid&direction=DESC&limit=10&promote=1')
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
