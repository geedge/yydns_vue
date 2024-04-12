<template>
    <div class="head" ref="appRef">
        <div class="headNew" >
            <div class="headNewLeft" >
                <div class="headNewLeftText">
                    <span>YYDNS</span>
                </div>
            </div>
            <div class="headNewCenter" >
                <div class="headNewCenterText">
                    <span style="color: rgb(0,0,0,0);">{{ title || 'Dashboard' }}</span>
                </div>
            </div>
            <div class="headNewRight" >
                <div class="headNewRightAll" >
                    <img src="../img/user.png" style="margin-top: 0.5%;height: 10%;width: 10%">
                    <div class="headNewRightText">
                        <span>{{userName}}</span>
                        <span>{{ '&nbsp;&nbsp;|&nbsp;&nbsp;' }}</span>
                        <span @click="logOut">退出</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "AppHeader",
        props:['title','fTag','fInput','fFrom','FIsConfigQuery'],
        // components:{
        //     router
        // },
        data(){
            return{
                userName: localStorage.getItem('username'),
                switchLanguage:"",//用于页面中英文切换
                languageJson:"", //用于储存语言字典
                countryEnJson:"",//用于储存国家英文字典
                themeEnJson:"",
                languageEnJson:"",
                isConfigQuery:"", //是否配置查询
                label:"普通用户",
                // UserManageAdd:false, //用户管理添加用户弹窗
                // UserManageAddData:{
                //     account:"",
                //     roletype:""
                // },

                hisList:[],//用户管理功能 用户列表

                PresentUser:{},
                userMenu:"",

                allCountry:[],
                allLanguage:[],

                allTags:[],
                allWebs:[],


                newly:false,
                UserOperate:false,
                input: "",
                tags:[],
                // tag:"精选",
                tag:"",
                presentUrl:"",
                configQuery:{
                    selectedCountries:[],//国家
                    selectedLanguages:[],//语言
                    selectedTags:[],//标签
                    selectedWebs:[],//标签
                    dateTime:[],//时间
                    selectedInput:"" //检索内容
                },
                rules:{
                },
            };
        },
        mounted() {

        },
        watch: {

        },
        created() {
            if (sessionStorage.getItem('switchLanguage') !== null) {
                this.switchLanguage = sessionStorage.getItem('switchLanguage');
            } else {
                this.switchLanguage = window.g.switchLanguage;
            }
            this.tags=window.g.queryTags
            if(this.fTag){
                this.tag=this.fTag
            }
            this.input=this.fInput
            this.isConfigQuery=this.fIsConfigQuery
            if(this.fFrom){
                this.configQuery=this.fFrom
            }

            this.presentUrl=(this.$route.path);
            // this.getallCountry()
            // this.getallLanguage()
            // this.getallTags()
            // this.getallWebs()

        },
        methods:{
            logOut() {
                localStorage.clear()
                sessionStorage.clear()
                this.$notify.success('退出成功!')
                this.$router.push({path:'/'})
            },
            ChangeLanguage(){

                if(this.switchLanguage==='en'){
                    // console.log("当前为英文页面 要换成中文页面")
                    sessionStorage.setItem("switchLanguage","zh");
                    this.switchLanguage=sessionStorage.getItem("switchLanguage")
                }else {
                    // console.log("当前为中文页面 要换成英文页面")
                    sessionStorage.setItem("switchLanguage","en");
                    this.switchLanguage=sessionStorage.getItem("switchLanguage")

                }

            },
            // userAdd(){
            //     this.UserManageAdd=true
            //
            // },
            handleClick() {
                alert('button click');
            },
            // handleItemClick(val){
            //     this.userMenu=val
            //     //todo 用户功能
            //     if(this.userMenu==='退出登录'){
            //         const data = {
            //         }
            //         this.$axios.post(this.$http.api.logout,data).then((res) => {
            //             // console.log(res)
            //             if(res.code == "OK"){
            //                 localStorage.clear()
            //                 this.$notify.success('退出成功!')
            //                 this.$router.push({path:'/'})
            //             }else{
            //                 this.$notify.error('服务异常');
            //             }
            //         }).catch(err=>{console.log(err)})
            //     }else {
            //         if(this.presentUrl!='/range/userManage'){
            //             let routeUrl = this.$router.resolve({
            //                 path: '/range/userManage',
            //                 query: {
            //                     companyName: 'userCenter'
            //                 }
            //             })
            //             window.open(routeUrl.href, '_blank')
            //         }
            //     }
            //
            // },
            newlyForm(formName){
                if(this.presentUrl!='/'){
                    // console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
                    // console.log(this.presentUrl)
                    // console.log("不等于/")
                    // console.log(this.configQuery)
                    //
                    // console.log("开始跳转，开始传值")
                    this.isConfigQuery="配置查询"
                    // console.log(this.isConfigQuery)

                    // this.$emit('parent-func',this.tag,this.input,this.from)
                    this.$emit('parent-func',this.tag,this.input,this.configQuery,this.isConfigQuery)
                    // console.log("传值完毕")
                    this.newly=false
                }else {
                    // console.log("原页面，不跳转，开始传值")
                    this.isConfigQuery="配置查询"
                    this.tag=""
                    this.input=""
                    // this.$emit('parent-func',this.tag,this.input,this.from)
                    this.$emit('parent-func',this.tag,this.input,this.configQuery,this.isConfigQuery)
                    // console.log("传值完毕")
                    this.newly=false
                }
            },
             getallCountry(){
                let data={
                }
                this.$axios.post(this.$http.api.allCountry,data).then(res=>{
                    if(res.code=='ok'){
                         this.allCountry=res.dataObject;
                    }
                })
            },
            getallLanguage(){
                var json=require('/src/api/world');
                this.languageJson=json.language
                this.countryEnJson=json.country_en
                this.languageEnJson=json.language_en
                this.themeEnJson=json.theme_en

                let data={
                }
                this.$axios.post(this.$http.api.allLanguage,data).then(res=>{
                    if(res.code=='ok'){
                        this.allLanguage=res.dataObject;
                    }
                })
            },
            getallTags(){
                let data={
                }
                this.$axios.post(this.$http.api.allTags,data).then(res=>{
                    if(res.code=='ok'){
                        this.allTags=res.dataObject;
                    }
                })
            },
            getallWebs(){
                let data={
                }
                this.$axios.post(this.$http.api.allWebs,data).then(res=>{
                    if(res.code=='ok'){
                        this.allWebs=res.dataObject;
                    }
                })
            },
            // 关闭配置检索弹窗事件
            reset(){
                this.configQuery.selectedCountries=[]
                this.configQuery.selectedLanguages=[]
                this.configQuery.selectedTags=[]
                this.configQuery.selectedWebs=[]
                this.configQuery.dateTime=[]
                this.configQuery.selectedInput=""
            },
            handleClose(){
                // this.$refs['ruleForm'].resetFields();
                // this.checkedAll=this.checked2All=false
                this.newly=false
            },
            UserOperateHandleClose(){
                this.UserOperate=false
            },

            //logo点击
            logoClick(){
                if(this.presentUrl!='/'){
                    this.$emit('parent-func',"精选","")

                    let routeUrl = this.$router.resolve({
                        path: '/',
                        query: {
                            companyName: 'rangeManage'
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                }
            },
            //tag点击
            getTagTorangeManage(info){
                this.input=""
                this.tag=info
                this.$emit('parent-func',this.tag,this.input)
            },

            //态势分析
            showLogdialog(){
                let routeUrl = this.$router.resolve({
                    path: '/Home',
                    query: {
                        companyName: 'home'
                    }
                })
                window.open(routeUrl.href, '_blank')

            },
            // //统计报告
            // getDataList(){
            //     // this.tableVisible=true
            //
            //     //todo   //原数据检索
            //     if(this.presentUrl!='/range/roleMange'){
            //         let routeUrl = this.$router.resolve({
            //             path: '/range/roleMange',
            //             query: {
            //                 companyName: 'report'
            //             }
            //         })
            //         window.open(routeUrl.href, '_blank')
            //     }
            //
            // },
            // setInput(){
            //     this.tag=""
            //     this.$emit('parent-func',this.tag,this.input)
            //
            // },

        }
    }

</script>

<style lang='less' scoped>
    .headNew{
        width: 100%;
        height: 100%;
        background-image:url('../img/header.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .headNewLeft{
            position: absolute;
            top: 3.5%;
            bottom: 0;
            left: 0;
            width: 22%;
            height: 5%;
            float: left;
            background-image: url('../img/headerLeft.svg');
            background-repeat: no-repeat;
            background-size: 100% auto;
            .headNewLeftText{
                color: #ece9f8;
                font-size: 20px;
                margin-top: 3.1%;
                margin-left: 35%;
            }
        }
        .headNewCenter{
            top: 3.5%;
            color: #dfe6ec;
            display: flex;
            justify-content: center;
            .headNewCenterText{
                color: #ece9f8;
                font-size: 25px;
                margin-top: 1.6%;
            }

        }
        .headNewRight{
            position: absolute;
            top: 3.5%;
            bottom: 0;
            right: 0;
            width: 22%;
            height: 5%;
            float: right;
            background-image: url('../img/headerRight.svg');
            background-repeat: no-repeat;
            background-size: 100% auto;
            .headNewRightAll{
                color: #ece9f8;
                font-size: 15px;
                margin-right: 40%;
                .headNewRightText{
                    display: inline-block;
                    margin-left: 5%;
                    margin-top: 6%;

                }

            }
        }

    }

    .addUserAccountTitle{
        display: flex;
        justify-content: center;

    }
    .addUserAccountInput{
    }


    .el-dropdown-link {
        cursor: pointer;
        color: #fffdfc;
        font-size: 20px;
    }
    .el-icon-arrow-down {
        font-size: 20px;
    }
    .sider{
        font-size: 20px;
        display: inline-flex;
        float: right;
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .newly{
        .el-dialog__header{background: #ECECF4;opacity: 0.8;border-radius: 4px;}
        .header{font-weight: bold;color: #02457a; font-size: 20px;text-align: left; padding-left: 50px}
        .el-dialog__body{padding: 0 30px;}
        .el-form{
            margin-top:40px;
            .a_select,.a_input{width:100%}
            .point{color: #999;font-size:12px;}
            .datePicker{width: 100%;}
        }
    }
    .button2_zh{
        background-color: #02457a;
        font-size: 20px;
        /*font-size: 0.8vw;*/
        font-weight: bolder;
        color: #fffdfc;
        /*border-color: #02457a;*/

        border: 0;   /* 去除边框 */
        padding: 0;  /* 去除内边距 */
        margin: 0;   /* 去除外边距 */

        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .button2_en{
        background-color: #02457a;
        font-size: 16px;
        /*font-size: 0.8vw;*/
        font-weight: bolder;
        color: #fffdfc;
        /*border-color: #02457a;*/

        border: 0;   /* 去除边框 */
        padding: 0;  /* 去除内边距 */
        margin: 0;   /* 去除外边距 */

        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .button4_zh{
        background-color: #02457a;
        font-size: 20px;
        /*font-size: 0.8vw;*/
        font-weight: bolder;
        color: #fffdfc;
        /*border-color: #02457a;*/

        border: 0;   /* 去除边框 */
        padding: 0;  /* 去除内边距 */
        margin: 0;   /* 去除外边距 */

        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .button4_en{
        background-color: #02457a;
        font-size: 16px;
        /*font-size: 0.8vw;*/
        font-weight: bolder;
        color: #fffdfc;
        /*border-color: #02457a;*/

        border: 0;   /* 去除边框 */
        padding: 0;  /* 去除内边距 */
        margin: 0;   /* 去除外边距 */

        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .button3_zh{
        background-color: #02457a;
        font-size: 20px;
        /*font-size: 0.8vw;*/
        font-weight: bolder;
        color: #fffdfc;
        /*border-color: #02457a;*/

        border: 0;   /* 去除边框 */
        padding: 0;  /* 去除内边距 */
        margin: 0;   /* 去除外边距 */

        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .button3_en{
        background-color: #02457a;
        font-size: 16px;
        /*font-size: 0.8vw;*/
        font-weight: bolder;
        color: #fffdfc;
        /*border-color: #02457a;*/

        border: 0;   /* 去除边框 */
        padding: 0;  /* 去除内边距 */
        margin: 0;   /* 去除外边距 */

        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .head{
        /*padding-left: 14%;*/
        width: 100%;
        height: 100%;
        /*width: 100vw;*/
        /*height: 6vh;*/
        background-color: #010f4e;
        /*display: flex;*/
    }

</style>