<template>
  <div id="app">
    <router-view/>
    <FooterGuide v-if="$route.meta.showFooter"/>
  </div>
</template>

<script>
  import FooterGuide from './components/FooterGuide/FooterGuide.vue'
  import {reqCategorys} from './api'
  import {mapActions} from 'vuex'
  export default {
    mounted(){
      this.getAddress()
      this.getUserInfo()
    },
    methods:{
      ...mapActions(['getAddress','getUserInfo'])
    },
    components:{
      FooterGuide
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
