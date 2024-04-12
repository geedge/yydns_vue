<template>
<div class="head">
    <div class="role-select">
        <el-select v-model="role" clearable placeholder="节点角色" @change="query">
            <el-option
                    v-for="item in roleDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <svg-icon :icon-class="item.value ? item.value : 'other'"></svg-icon>
                    <span style="margin-left: 10px;">{{ item.label }}</span>
            </el-option>
        </el-select>
    </div>
    <div class="deploy-select">
        <el-select v-model="status" clearable placeholder="节点部署状态" @change="query">
            <el-option
                    v-for="item in statusDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
    <el-button v-if="false" type="primary" @click="batchConsole">批量控制台</el-button>
    <el-button v-if="true" type="primary" @click="batchDownload">批量下载文件</el-button>
    <el-button v-if="true" type="primary" @click="batchUpload">批量上传文件</el-button>
    <el-button v-if="true" type="primary" @click="batchCollectTraffic">批量采集流量</el-button>
</div>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            role: '',
            status: '',
            roleDict:[
                {label: '全部节点', value: ''},
                {label: '权威目录节点', value: 'da'},
                {label: '路由节点', value: 'relay'},
                {label: '出口节点', value: 'exit'},
                {label: '洋葱服务节点', value: 'onion'},
                {label: '客户端节点', value: 'client'},
                {label: '入口节点', value: 'guard'}
            ],
            statusDict: [
                {value: 'pending', label: '正在部署'}, 
                {value: 'false', label: '部署失败'}, 
                {value: 'complete',label: '部署完成'}
            ]
        }
    },
    methods: {
        // 查询
        query() {
            let params = {}
            if (this.role !== '') {
                params.role = this.role
            }
            if (this.status !== '') {
                params.status = this.status
            }
            this.$emit('query', params)
        },
        // 批量控制台
        batchConsole() {
            this.$emit('batchConsole')
        },
        // 批量下载文件
        batchDownload() {
            this.$emit('batchDownload')
        },
        // 批量上传文件
        batchUpload() {
            this.$emit('batchUpload')
        },
        // 批量采集流量
        batchCollectTraffic() {
            this.$emit('batchCollectTraffic')
        }
    }
}
</script>

<style lang="less" scoped>
.head{
    width: 100%;
    height: 15%;
    margin-top: 1%;
    text-align: right;

    /*background-color: #5daf34;*/
    .block{
        display: inline-block;
        margin-left: 2%;

    }
    .input{
        display: inline-block;
        height: 60%;
        width: 10%;
        margin-left: 0.5%;
        .el-input::placeholder {
            width: auto;
        }
        .icon-group {
            display: flex; /* 设置容器为 Flexbox 容器 */
            align-items: center; /* 垂直居中图片 */
            gap: 5px; /* 图片和文字之间的间距，可以根据需要进行调整 */

        }
        .icon-group img {
            transform: scale(1);
            margin-right: 15px;
            margin-top: 6px;
        }

    }
    .deploy-select{
        display: inline-block;
        height: 60%;
        width: 10%;
        margin-top: 0.5%;
        margin-left: 0.5%;
        margin-right: 1%;
        .el-input::placeholder {
            width: auto;
        }
        .icon-group {
            display: flex; /* 设置容器为 Flexbox 容器 */
            align-items: center; /* 垂直居中图片 */
            gap: 5px; /* 图片和文字之间的间距，可以根据需要进行调整 */
        }
        .icon-group img {
            transform: scale(1);
            margin-right: 15px;
            margin-top: 6px;
        }
    }
    ::v-deep .role-select{
        display: inline-block;
    }
}
</style>