<template xmlns:float="http://www.w3.org/1999/xhtml" xmlns:width="http://www.w3.org/1999/xhtml"
          xmlns:border-radius="http://www.w3.org/1999/xhtml" xmlns:display="http://www.w3.org/1999/xhtml"
          xmlns:color="http://www.w3.org/1999/xhtml">
    <div class="main" ref="appRef">
        <AppHeader class="header" @parent-func="fromMyHead" :title="title" :fTag="tag" :fInput="input" :fFrom="configQuery" :FIsConfigQuery="isConfigQuery"></AppHeader>
        <div class="container">
            <AppMenu @parent-func="fromMyMenu"></AppMenu>
            <AppMain></AppMain>
        </div>
    </div>

</template>

<script>
    import AppHeader from "./AppHeader";
    import AppMenu from "./AppMenu";
    import AppMain from './AppMain'
    import { Loading } from 'element-ui'
    import drawMixin from "../assets/js/drawMixin";

    export default {
        components: {
            AppHeader,
            AppMenu,
            AppMain,
            Loading,
        },
        props: {},
        mixins: [ drawMixin ],
        data() {
            return {
                // menuDict: [],
                title:"",
                tag:"精选",
                input: "",
                isConfigQuery:"",
                configQuery:{
                    selectedCountries:[],//国家
                    selectedLanguages:[],//语言
                    selectedTags:[],//tags
                    selectedWebs:[],//网站
                    dateTime:[],//时间
                    selectedInput:""
                }
            }
        },
        watch: {},
        computed: {},
        created() {
            // this.getMenuDict()
        },
        mounted() {
            // this.timereset();
            // 模拟初始数据获取
            // 模拟数据更新
            setInterval(() => {
                // this.getData();
            }, 3000);
        },
        methods: {
            // // 获取菜单字典
            // getMenuDict() {
            //     this.$axios.get(this.$http.api.getMenus, {}).then(res => {
            //         if (res.code == 200 || res.code == "OK") {
            //             this.menuDict = res?.result?.items.map(item => item.permission_name)
            //         }
            //     }).catch(err => {
            //         console.log(err)
            //     })  
            // },
            fromMyMenu(title){
                this.title=title
            },
            fromMyHead(tag,input,configQuery,isconfigQuery){
            }
        }
    }
</script>

<style lang='less' scoped>
    .main{
        text-align: center;
        background: url(../img/background/bgMain.svg);
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-position: center; /* 居中显示 */
        background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */
        background-attachment:fixed;

        width: 2190px; // 2150 2215
        height: 1080px;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -webkit-transform-origin: left top;
        transform-origin: left top;
        overflow: hidden;
        display: inline-block;
    }
    .header {
        height: 9%;
        width: 100%;
    }
    .container {
        width: 100%;
        height: 91%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
</style>


