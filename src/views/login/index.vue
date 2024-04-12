<template>
    <div>
        <div class="login"  ref="appRef" v-if="label==false">
            <div class="login-box">
                <p class="title" style="font-size: 48px;margin-top: 20%" @click="label=!label">进入YYDNS系统</p>
            </div>
        </div>
        <div class="login"  ref="appRef" v-if="label==true">
        <div class="login-box">
            <p class="title">登录到</p>
            <p class="title">YYDNS系统</p>
<!--            <p class="subtitle top-distance"><span style="color: rgba(255, 255, 255, 0.60);">没有账号吗？</span>注册新账号</p>-->
            <el-form class="form-box" :model="loginForm" :rules="rules" ref="loginForm" label-width="0px">
                <el-form-item prop="username" class="top-distance">
                    <el-input class="login-input" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名">
                        <i slot="prefix" class="el-icon-s-custom"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password"  class="top-distance">
                    <el-input
                            class="login-input"
                            type="password"
                            v-model="loginForm.password"
                            autocomplete="off"
                            show-password placeholder="请输入密码"
                            @keyup.enter.native="submitForm('loginForm')"
                    >
                        <i slot="prefix" class="Bicon-mima"></i>
                    </el-input>
                </el-form-item>
                <!-- <div class="check-forget-section">
                  <el-checkbox class="rememberAccount" v-model="rememberPwd" @change="checkChange">记住账号</el-checkbox>
                  <a class="forgetPwd" @click="resetPassword">忘记密码 ?</a>
                </div> -->
                <el-form-item>
                    <!--          <el-button class="submit-btn" type="primary" @click="submitForm('loginForm')" >登  录</el-button>-->
                    <el-button class="submit-btn" type="primary" @click="submitFormA('loginForm')" >登  录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    </div>

</template>

<script>
import _ from "lodash"
import validcode from '@/components/base/validcode'
import drawMixin from "../../assets/js/drawMixin";
// import { getTargetsResponse } from './mock.js'
	export default {

		name:'login',
		components:{
			validcode
		},
		mixins: [ drawMixin ],
		data() {
			return {
                label:false,
                rememberPwd: false,
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
					password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
				},
			};

		},
    created() {
      // this.getMenuDict()
    },
		methods: {
      // 记住密码
      checkChange() {},
      // 忘记密码
      resetPassword() {},
      // 登录
		// 	submitForm(formName) {
      //   // mock菜单数据
      //   // const menuDict = getTargetsResponse?.result?.map(item => item.permission_name)
      //   // localStorage.setItem('menuDict', menuDict)
      //   // this.$router.push({path : 'range'})
		// 	  this.$refs[formName].validate((valid) => {
		// 		if(valid) {
      //     this.$axios.postForm(this.$http.api.login, this.loginForm).then(res => {
		// 				localStorage.clear()
		// 				// this.$store.commit("userinfo",res.dataObject);  //存储用户信息
		// 				// sessionStorage.setItem('isLogin',true) //登录标识
		// 				// localStorage.setItem('isLogin',true) //登录标识
		// 				// localStorage.setItem('account',res.dataObject.account) //存储userId
		// 				localStorage.setItem('username', this.loginForm.username)
		// 				localStorage.setItem('token',res.access_token) //存储token
      //       this.getMenuDict()
		// 				this.$notify({
		// 					title: '登录成功',
		// 					type: 'success',
		// 					duration: 2500
		// 				})
		// 			}).catch(err =>{
		// 				console.log(err)
		// 			})
		// 		}
		// 	  });
		// 	},
            submitFormA(formName) {
                // // mock菜单数据
                // // const menuDict = getTargetsResponse?.result?.map(item => item.permission_name)
                // // localStorage.setItem('menuDict', menuDict)
                // // this.$router.push({path : 'range'})
                // this.$refs[formName].validate((valid) => {
                //     if(valid) {
                //         this.$axios.postForm(this.$http.api.login, this.loginForm).then(res => {
                //             localStorage.clear()
                //             // this.$store.commit("userinfo",res.dataObject);  //存储用户信息
                //             // sessionStorage.setItem('isLogin',true) //登录标识
                //             // localStorage.setItem('isLogin',true) //登录标识
                //             // localStorage.setItem('account',res.dataObject.account) //存储userId
                //             localStorage.setItem('username', this.loginForm.username)
                //             localStorage.setItem('token',res.access_token) //存储token
                //             this.getMenuDict()
                            this.$router.push({ path: '/range'})
                            this.$notify({
                                title: '登录成功',
                                type: 'success',
                                duration: 2500
                            })
                //         }).catch(err =>{
                //             console.log(err)
                //         })
                //     }
                // });
            },
      // 获取菜单字典
      getMenuDict() {
        this.$axios.get(this.$http.api.getMenus, {}).then(res => {
          if (res.code == 200 || res.code == "OK") {
            const menuDict = res?.result?.map(item => item.permission_name)
            localStorage.setItem('menuDict', menuDict)
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.$router.push({ path: '/range'})
        })
      },
		},
	}
</script>

<style scoped="scoped" lang='less'>
	.login{
		text-align: center;
		background-image: url(../../img/background/loginBg.svg);
		background-repeat: no-repeat; /* 可选，防止图像重复 */
		background-position: center; /* 居中显示 */
        background-size: 100% auto; /* 宽度为100%，高度自适应保持宽高比 */
		background-attachment:fixed;

		width: 2215px;
		height: 1080px;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		-webkit-transform-origin: left top;
		transform-origin: left top;
		overflow: hidden;
		.login-box{
			text-align: left;
			height: 470px;
			width: 400px;
			margin: 13% 0 0 20%;
			.title{
				font-family: PingFang SC;
				font-size: 36px;
				font-weight: 600;
				line-height: 44px;
				letter-spacing: 0em;
				color: #FFFFFF;
				opacity: 0.9;
			}
			.subtitle {
				color: rgba(255, 255, 255, 0.90);
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 22px;
			}
      .top-distance{
        margin-top: 24px;
      }
      .form-box{
        width: 100%;
        margin: 50px auto;
        .login-input {
          display: flex;
          width: 400px;
          height: 40px;
          // padding: 8px 12px;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          border-radius: 3px;
          border: 1px solid #DCDCDC;
          background: #FFFFFF;
          ::v-deep .el-input__prefix, .el-input__suffix {
              color: rgba(0, 0, 0, 0.4);
          }
          ::v-deep .el-input__inner {
            background-color: #FFFFFF !important;
            border-color: #FFFFFF;
            border-radius: 0;
            color: rgba(0, 0, 0, 1);
          }
        }
        .check-forget-section {
          display: inline-flex;
          height: 22px;
          align-items: flex-start;
          gap: 251px;
          flex-shrink: 0;
          .rememberAccount {
            color: rgba(255, 255, 255, 0.9);
          }
          .forgetPwd {
            float: right;
            cursor: pointer;
            font-size: 14px;
            color: #02DDEA;
            text-decoration: none; /* 取消默认的下划线 */
          }
        }
        .submit-btn {
          width: 100%;
          height: 40px;
          margin-top: 50px;
          border-radius: 3px;
          background: #02DDEA;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
          font-family: "PingFang SC";
        }
      }
		}
	}

  ::v-deep .el-input input::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
  ::v-deep .el-input input::-moz-input-placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
  ::v-deep .el-input input::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
</style>
