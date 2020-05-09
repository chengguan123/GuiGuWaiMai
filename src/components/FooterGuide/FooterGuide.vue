<template>
  <footer class="footer_guide border-1px">
    <a href="javascript:;" class="guide_item" :class="{on:'/msite'===$route.path}" @click="goTo('/msite')">
     <span><img src="../../../static/images/记账本.png" v-if="$route.path==='/msite'"></span>
      <span><img src="../../../static/images/记账本1.png" v-if="$route.path!='/msite'"></span>
      <span>账本</span>
    </a>
    <a href="javascript:;" class="guide_item" :class="{on:'/search'===$route.path}" @click="goTo('/search')">
      <span><img src="../../../static/images/位置.png" v-if="$route.path==='/search'"></span>
      <span><img src="../../../static/images/位置1.png" v-if="$route.path!='/search'"></span>
      <span>位置</span>
    </a>
    <a href="javascript:;" class="guide_item" :class="{on:'/order'===$route.path}" @click="goTo('/order')">
      <span><img src="../../../static/images/记事.png" v-if="$route.path==='/order'"></span>
      <span><img src="../../../static/images/记事1.png" v-if="$route.path!='/order'"></span>
      <span>记事</span>
    </a>
    <a href="javascript:;" class="guide_item" :class="{on:'/profile'===$route.path}" @click="goTo('/profile')">
      <span >
        <img src="../../../static/images/我的.png" v-if="$route.path === '/profile'">
        <img src="../../../static/images/我的1.png" v-if="$route.path != '/profile'">
      </span>
      <span>我的</span>
    </a>
  </footer>
</template>

<script>
  export default {
    methods:{
      goTo(path){
        //跳转到指定url，但是这个方法不会向history里面添加新的记录，点击返回，会跳转到上上一个页面。上一个记录是不存在的
        this.$router.replace(path)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .footer_guide
    top-border-1px(#e4e4e4)
    position fixed
    z-index 100
    left 0
    right 0
    bottom 0
    background-color #fff
    width 100%
    height 50px
    display flex
    .guide_item
      display flex
      flex 1
      text-align center
      flex-direction column
      align-items center
      margin 5px
      color #999999
      &.on
        color #d4237a
      span
        font-size 12px
        margin-top 2px
        margin-bottom 2px
        .iconfont
          font-size 22px
</style>
<style>
  img{
    width: 20px;
  }
</style>
