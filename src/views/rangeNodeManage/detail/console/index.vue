<template>
<div :class="['tabs', {'is--maximize': isFullscreen}]">
    <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
    >
        <el-tab-pane label="控制台" name="first">
            <ControlConsole ref="controlConsole"></ControlConsole>
        </el-tab-pane>
        <el-tab-pane label="文件管理" name="second">
            <FileManage :is-fullscreen="isFullscreen"></FileManage>
        </el-tab-pane>
    </el-tabs>
    <el-button class="console-btn" v-if="activeName === 'first'" :loading="consoleLoading" type="primary" @click="openConsoleTab">打开控制台</el-button>
    <span class="icon-span" slot="label">
        <i v-if="closeIcon" class="el-icon-close icon-zoom" @click="backNodeList"></i>
        <svg-icon v-else class="icon-zoom" :icon-class="fullscreenIcon" @click="zoomEvent"></svg-icon>
    </span>
</div>
</template>

<script>
import ControlConsole from './module/ControlConsole'
import FileManage from './module/FileManage'
export default {
    components: { ControlConsole, FileManage },
    data() {
        return {
            activeName: 'first',
            nodeId: '',
            // consoleUrl: '',
            fullscreenIcon: 'fullscreen',
            isFullscreen: false,
            closeIcon: false,
            consoleLoading: false
        };
    },
    watch: {
        '$store.state.range.nodeId': {
            handler(newVal, oldVal) {
                this.nodeId = newVal
                // this.init()
            },
            immediate: true
        } 
    },
    mounted() {
        this.closeIcon = this.$route.params.closeIcon
    },
    methods: {
        backNodeList() {
            this.$router.push({ name: 'rangeNodeManage' })
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        openConsoleTab() {
            // 获取webshell地址，用浏览器打开
            const reqParams = { node_id: this.nodeId }
            this.consoleLoading = true
            this.$axios.get(this.$http.api.getWebshell, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    const consoleUrl = 'http://' + window.g.baseURL + '/' + res?.result
                    window.open(consoleUrl, '_blank')
                    // var newWindow = window.open(consoleUrl , '_blank');
                    // // 等待新页面加载完成
                    // newWindow.onload = function() {
                    //     console.log('1111111111111111')
                    //     // 选择用户名输入框
                    //     var usernameInput = newWindow.document.querySelector('input[name="username"]');
                    //     // 选择密码输入框
                    //     var passwordInput = newWindow.document.querySelector('input[name="password"]');
                    //     // 选择登录按钮
                    //     var loginButton = newWindow.document.querySelector('button[type="submit"]');
                    //     console.log(usernameInput, 'usernameInput====')
                    
                    //     // 如果输入框存在，则自动输入用户名和密码
                    //     if (usernameInput && passwordInput && loginButton) {
                    //         usernameInput.value = 'admin';
                    //         passwordInput.value = 'Bjhit@2020';
                        
                    //         // 触发登录按钮的点击事件
                    //         loginButton.click();
                    //     }
                    // };
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.consoleLoading = false
            })
        },
        zoomEvent() {
            if (this.activeName === 'first') {

                this.isFullscreen = !this.isFullscreen
                this.fullscreenIcon = this.isFullscreen ? 'narrow' : 'fullscreen'
                // this.$refs.controlConsole.resize()
            } else {
                this.isFullscreen = !this.isFullscreen
                this.fullscreenIcon = this.isFullscreen ? 'narrow' : 'fullscreen'                
            }
        },
        findNthOccurrence(str, char, n) {
            let index = str.indexOf(char)
            while (--n > 0 && index !== -1) {
                index = str.indexOf(char, index + 1)
            }
            return index
        }
    }
}
</script>

<style lang='less' scoped="scoped">
.is--maximize {
    position: fixed !important;
    top: 9%;
    left: 10%;
    width: 90% !important;
    height: 91% !important;
    padding: 0.5em 1em;
    // background-color: #17234e;
    background: url(../../../../img/background/bgMain.svg);
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-position: center; /* 居中显示 */
    background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */
    z-index: 1000;
}
// ::v-deep #tab-zoom {
//     border: none;
//     background-color: #1b202e !important;
//     position: absolute;
//     top: 1px;
//     right: 0;
//     font-weight: 500;
//     font-size: 15px;
//     color: #fff !important;
// }
.tabs {
    width: 100%;
    height: calc(100% - 15px);
    text-align: center;
    position: relative;
    padding: 0 0;
    // display: flex;
    // .detail-title {
    //     position:absolute;
    //     margin: 10px;
    // }
}
::v-deep .el-tabs{
    color: #000;
    left: 0px;
    top: 0px;
    padding: 0 0;
    width: 100%;
	height: 100%;
    position: relative;
    .el-tabs__header {
        margin: 15px 30px;
    }
    .el-tabs__content {
        width: 100%;
        height: calc(100% - 50px);
        .el-tab-pane {
            width: 100%;
            height: 100%;
        }
    }
}
/* 去除灰色横条 */
::v-deep .el-tabs__nav-wrap::after {
    position: static !important;
}
/* 设置滑块颜色 */
::v-deep .el-tabs__active-bar{
    background-color: #0E3D8A !important;
}
/* 设置滑块停止位置 */
::v-deep .el-tabs__active-bar.is-top{
    height: 37px;
    width: 104px ! important;
    border-radius: 17px;
    top: 0px !important;
    left: -18px !important;
    position: absolute !important;
    z-index: 1;
}
/* 设置当前选中样式 */
::v-deep .el-tabs__item.is-active{
    color:#02DDEA !important;
    z-index: 2;
}
/* 设置未被选中样式 */
::v-deep .el-tabs__item{
    padding: 0 20px !important;
    width: 104px;
    box-sizing: border-box;
    display: inline-block;
    position: relative !important;
    color:#02DDEA !important;
    z-index: 2;
}
.console-btn {
    position: absolute;
    top: 5px;
    right: 100px;
}
.icon-span {
    position: absolute;
    top: 10px;
    right: 30px;
    .icon-zoom {
        font-size: 30px;
        color: #02DDEA;
        margin: 0 15px;
    }
}
</style>