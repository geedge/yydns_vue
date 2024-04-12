<template>
<div class="head">
    <div class="target-select">
        <el-select class="range-select" style="width:220px;" v-model="target_id" placeholder="全部靶场" @change="changeRange">
            <el-option
                    v-for="item in rangeDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
    <img src="../../../img/btn/addConfigBtn.svg" style="height: 70% ;width: 10%;margin-right: 2%;color: #ffffff" @click="addConfig">
    <div class="role-select">
        <el-select v-model="role" clearable placeholder="节点角色" @change="query">
            <el-option
                    v-for="item in roleDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <svg-icon :icon-class="item.value"></svg-icon>
                    <span style="margin-left: 10px;">{{ item.label }}</span>
            </el-option>
        </el-select>
    </div>
    <div class="deploy-select">
        <el-select v-model="has_deployed" clearable placeholder="部署状态" @change="query">
            <el-option
                    v-for="item in statusDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
    <el-button type="primary" :loading="batchDeployLoading" @click="batchDeploy">批量部署</el-button>
    <el-button type="primary" :loading="batchDelLoading" @click="batchDel">批量删除</el-button>
    <el-button type="primary" :loading="batchPipelineLoading" @click="batchPipeline" :disabled="disabledBatchPipline">批量运行流水线</el-button>
</div>
</template>

<script>
export default {
    name: 'Header',
    props: ['rangeDict', 'batchDeployLoading', 'batchDelLoading', 'batchPipelineLoading', 'disabledBatchPipline'],
    data() {
        return {
            target_id: '',
            role: '',
            has_deployed: '',
            roleDict:[
                {label: '权威目录节点', value: 'da'},
                {label: '路由节点', value: 'relay'},
                {label: '出口节点', value: 'exit'},
                {label: '洋葱服务节点', value: 'onion'},
                {label: '客户端节点', value: 'client'},
                {label: '入口节点', value: 'guard'}
            ],
            statusDict: [
                {value: 'true', label: '已部署'}, 
                {value: 'false',label: '未部署'}
            ]
        }
    },
    watch: {
        '$store.state.range.targetId': {
            handler(newVal, oldVal) {
                this.target_id = newVal
            },
            immediate: true
        } 
    },
    methods: {
        // 改变靶场
        changeRange() {
            this.$store.commit('range/setTargetId', this.target_id)
        },
        // 新增
        addConfig() {
            this.$emit('addConfig')
        },
        // 查询
        query() {
            let params = {}
            if (this.has_deployed !== '') {
                params.has_deployed = this.has_deployed
            }
            if (this.role !== '') {
                params.role = this.role
            }
            this.$emit('query', params)
        },
        // 批量部署
        batchDeploy() {
            this.$emit('batchDeploy')
        },
        // 批量删除
        batchDel() {
            this.$emit('batchDel')
        },
        // 批量运行流水线
        batchPipeline() {
            this.$emit('batchPipeline')
        }
    }
}
</script>

<style lang="less" scoped>
.head{
    width: 95%;
    height: 7%;
    margin-top: 1%;
    margin-left: 2.5%;
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
    .target-select{
        font-size: 10px;
        float: left;
        margin-top: 0.5%;
        display: inline-block;
        height: 60%;
        width: 10%;
        margin-left: 0.5%;
        .custom-popper .el-select-dropdown {
            max-height: 3px;
        }
        .range-select {
            ::v-deep .el-input {
                width: 80%;
                .el-input__inner {
                    background-color: transparent !important;
                    border-color: transparent;
                    border-radius: 0;
                    color: #FFFFFF;
                }
                /* select去除竖线 */
                .el-input__suffix::before {
                    content: "";
                    width: 0;
                    height: 0;
                    margin: 0;
                    position: absolute;
                }
                /*select的上下箭头图标样式*/
                .el-select__caret {
                    color: rgba(2, 221, 234, 0.9);
                }
            }
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