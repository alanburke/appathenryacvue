import Vue from 'vue'
import axios from 'axios';

new Vue({
  el: '#app',
	data: {
		news: [],
	},
  mounted () {
    axios.get(`https://wwwathenryaccom.docksal/node.json?sort=nid&direction=DESC&limit=10`)
    .then(response => {
			console.log(response.data.list);
			console.log(this);
      this.news = response.data.list
    })
    .catch(e => {
      this.errors.push(e)
    })
	}
})
