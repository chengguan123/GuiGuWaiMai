<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone" class="get_verification" :class="{right_phone:rightPhone}" @click.prevent="getCode">{{computeTime>0?'已发送'+computeTime+'秒':'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="password" maxlength="8" placeholder="密码" v-if="!showPwd" v-model="pwd">
                <input type="text" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" :class="showPwd ? 'on' : 'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class="{right:showPwd}"></div>
                  <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <span href="javascript:" class="go_back" @click="$router.back()">
        <img src="./images/后退.png" style="width: 30px"></img>
      </span>
    </div>
    <AlertTip :alertText="alertText" v-if="showAlert" @closeTip="closeTip"></AlertTip>
  </div>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip'
  import {reqSendCode,reqSmsLogin,reqPwdLogin} from '../../api'
  export default {
    data(){
      return {
        loginWay:true,//true短信 false密码登录
        computeTime:0,//倒计时
        phone:'',//手机号
        showPwd:false,//是否显示密码
        pwd:'',//密码
        code:'',//短信验证码
        name:'',//用户名
        captcha:'',//图形验证码
        alertText:'',//提示文本
        showAlert:false,//是否显示提示
      }
    },
    computed:{
      rightPhone(){
        return /^1\d{10}$/.test(this.phone)
      }
    },
    components:{
      AlertTip
    },
    methods:{
      async getCode(){
        //如果当前没有计时
        if (!this.computeTime){
          //启动倒计时
          this.computeTime=60;
          this.intervalID=setInterval(()=>{
            this.computeTime--
            if (this.computeTime==0){
              //停止计时
              clearInterval(this.intervalID)
            }
          },1000)
          //发送axaj请求(向指定手机号发送验证码短信）
          const result=await reqSendCode(this.phone)
          if(result.code===1){
            //显示提示
            this.AlertShow(result.msg)
            //停止倒计时
            if(this.computeTime){
              this.computeTime=0
              clearInterval(this.intervalID)
              this.intervalID=undefined
            }
          }
        }
      },
      AlertShow(alertText){
        this.showAlert=true
        this.alertText=alertText
      },
      async login(){
         let result
        //前台表单验证
        const{rightPhone,phone,code,AlertShow}=this
        if(this.loginWay){//短信登录
          if(!this.rightPhone){
            //手机号不正确
            AlertShow("手机号不正确")
            return
          }else if(!/^\d{6}$/.test(code)){
            //验证码不正确
            AlertShow("验证码不正确")
            return
          }
          //发送ajax请求短信登录
          result=await reqSmsLogin(phone,code)
        }else{//密码登录
          const  {name,pwd,captcha}=this
          if(!this.name){
            //用户名不能为空
            AlertShow("用户名不能为空")
            return
          }else if(!this.pwd){
            //密码不能为空
            AlertShow("密码不能为空")
            return
          }else if(!this.captcha){
            //图形验证码错误
            AlertShow("图形验证码错误")
            return
          }
          //发送ajax请求手机号登录
          result=await reqPwdLogin(name,pwd,captcha)
        }
        //停止倒计时
        if(this.computeTime){
          this.computeTime=0
          clearInterval(this.intervalID)
          this.intervalID=undefined
        }
        //根据结果数据处理
        if (result.code===0){
          const user=result.data
          //将user保存到vuex的state
          this.$store.dispatch('recordUser',user)
          //去个人中心界面
          this.$router.replace('/profile')
        }else{
          //显示新的图片验证码
          this.getCaptcha();
          //弹出提示
          const msg=result.msg
          this.AlertShow(msg)
        }
      },
      closeTip(){
        //关闭警告框
        this.showAlert=false
        this.alertText=''
      },
      getCaptcha(){
        //获取一个新的图片验证码
        this.$refs.captcha.src='http://localhost:4000/captcha?'+Date.now()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #a78d96
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #a78d96
              font-weight 700
              border-bottom 2px solid #a78d96
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #a78d96
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                width 6rem
                height 2rem
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #a78d96
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(32px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #a78d96
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #a78d96
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
