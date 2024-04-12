<template>
<div class="head">
    <span class="title">节点流量采集文件</span>
    <el-button :loading="downLoading" type="primary" @click="download">下载</el-button>
    <el-button :loading="startLoading" type="primary" @click="start">开始</el-button>
    <el-button :loading="stopLoading"  type="primary" @click="end">结束</el-button>
</div>
</template>

<script>
export default {
    name: 'Header',
    props: ['startLoading', 'stopLoading', 'downLoading'],
    data() {
        return {
            role: '',
            has_deployed: ''
        }
    },
    methods: {
        // 下载
        download() {
            this.$emit('download')
        },
        // 开始
        start() {
            this.$emit('start')
        },
        // 结束
        end() {
            this.$emit('end')
        }
    }
}
</script>

<style lang="less" scoped>
.head{
    width: 100%;
    height: 12%;
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
    .title {
        margin-right: 60%;
    }
}
</style>