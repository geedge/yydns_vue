<template>
<div class="console-dialog" v-if="visible">
    <!-- 在此处指定弹窗的样式和内容 -->
    <i class="el-icon-close" @click="close"></i>
    <div class="tag">
        <el-tag class="tags" style="color:#f8fdff">批量采集流量</el-tag>
    </div>
    <TaskList style="height: 42%;" :node-list="nodeList"></TaskList>
    <RuleList style="height: 42%;"></RuleList>
    <footer class="anDiv">
        <el-button class="glBut but-color" type="primary" @click="close">确定</el-button>
    </footer>
</div>  
</template>

<script>
import TaskList from './TaskList'
import RuleList from './RuleList'
export default {
    name: 'Console',
    components: { TaskList, RuleList },
    props: {
        target_id: {
            typeof: String,
            required: true,
            default: 0
        }
    },
    data() {
        return {
            visible:false,
            nodeList: []
        }
    },
    methods: {
        getNodeList() {
            const reqParams = {
                page: 1,
                size: 99
            }
            if (this.target_id && this.target_id !== '') {
                reqParams.target_id = this.target_id
            }
            this.$axios.get(this.$http.api.getNodeList, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.nodeList = res?.result?.items
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {})
        },
        // 关闭
        close() {
            document.querySelector('.mask').style.display = 'none'
            this.$emit('refresh')
            this.visible = false
        }
    }
}
</script>

<style lang="less" scoped>
.console-dialog{
    z-index: 997;
    width: 1331px;
    height: 800px;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    background-image:url('../../../../../img/background/NodeListDialog.svg');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */
    .el-icon-close{
        float: right;
        padding-right: 8%;
        padding-top: 1.8%
    }
    .tag{
        text-align: left;
        margin-left: 2%;
        .tags{
            margin-top: 1%;
            font-size: 23px;
            border: none;
            background-color: transparent !important;
            color: #565e6e;
        }
    }
    .but-color {
        background-color: #02DDEA !important;
    }
    .anDiv{
        width: 100%;
        float: left;
        text-align: center;
        .glBut{
            width: 90px;
            height: 30px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 5%;
            margin-right: 5%;
            background-color: rgba(24, 133, 234, 0.2);
            color: #1b7cc4;
        }
    }
}
</style>