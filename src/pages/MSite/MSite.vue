<template>
  <div class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
       <span class="header_search" slot="left">
         <img src="../../../static/images/搜索.png" style="width: 20px">
       </span>
      <span class="header_login" slot="right">
        <span class="header_login_text">登录|注册</span>
      </span>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav border-1px">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(categorysArr,index) in categorys" :key="index">
              <div class="food_container">
                <img :src="baseImageUrl+categorysArr.image_url">
              </div>
              <span>{{categorysArr.title}}</span>
            </a>
          </div>
        </div>
        <!--轮播左右箭头
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>-->
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list border-1px">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
    </div>
    <ShopList></ShopList>
  </div>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import ShopList from '../../components/ShopList/ShopList'
  import {mapState} from 'vuex'
  //轮播 插件
  import Swiper from 'swiper'
  import 'swiper/css/swiper.min.css'
  export default {
    data(){
      return{
        baseImageUrl:'https://fuss10.elemecdn.com'
      }
    },
    //创建一个Swiper实例对象，来实现轮播
    mounted(){
      this.$store.dispatch('getCategorys')
      this.$store.dispatch('getShops')
    },
    computed:{
      ...mapState(['address','categorys']),
      /*
      * 根据categorys 一维数组生成一个2维数据
      * 小数组中的元素个数据最大是8
      * */
      categorysArr(){
        const{categorys}=this
        //准备空的2维数组
        const arr=[]
        //准备小数组（最大长度为8）
        let minArr=[]
        //遍历categorys
        categorys.forEach(c =>{
          //如果当小数据已经潢了，创建一个新的数据
          if (minArr.length===8) {
            minArr=[]
          }
          //如果minArr是空的，将小数据保存到大数组中
          if (minArr.length===0){
            arr.push(minArr)
          }
          //将当前分类保存到小数据中
          minArr.push(c)
        })
        return arr
      }
    },
    components:{
      HeaderTop,
      ShopList
    },
    watch:{//监听
      categorys(value){//监听categorys值， value为categorys的值
        // new Swiper('.swiper-container',{//轮播必须在数据加载完成之后再创建，不然会出问题
        //   autoplay:true,//自动轮播开启，默认3秒
        //   loop:true,//循环模式开启
        //   // 如果需要分页器,下面的两个圆点
        //   pagination: {
        //     el: '.swiper-pagination',
        //   },
          // navigation:{//轮播左右箭头设置
          //   nextEl:'.swiper-button-next',
          //   prevEl:'.swiper-button-prev',
          //   disabledClass: 'my-button-disabled',
          // }
          //})
        //界面更新就立即创建swiper对象
        this.$nextTick(()=>{//在修改数据之后立即使用它
          new Swiper('.swiper-container', {//轮播必须在数据加载完成之后再创建，不然会出问题（此条语句必须写在数据更新之后）
            autoplay: true,//自动轮播开启，默认3秒
            loop: true,//循环模式开启
            // 如果需要分页器,下面的两个圆点
            pagination: {
              el: '.swiper-pagination',
            },
          })
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #a78d96
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0 10px
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
<style type="text/css">
  .swiper-container{
    --swiper-theme-color: #ff2100;/* 设置Swiper风格 */
    --swiper-navigation-color: #d4237a;/* 单独设置按钮颜色 */
    --swiper-navigation-size: 20px;/* 设置按钮大小 */
  }
</style>
