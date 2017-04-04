import Vue from 'vue'
import axios from 'axios';

Vue.component('news-item', {
  props: ['item'],
  template: '<li>{{ item.title }}</li>'
})

var app = new Vue({
  el: '#app',
	data: {
		news: [],
	},
  mounted () {
    axios.get('https://wwwathenryaccom.docksal/node.json?sort=nid&direction=DESC&limit=10')
    .then(response => {
      this.news = response.data.list
    })
    .catch(e => {
      this.errors.push(e)
    })
	}
})
