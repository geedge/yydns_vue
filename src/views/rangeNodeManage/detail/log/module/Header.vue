<template>
<div class="head">
    <span class="title">日志流展示</span>
    <div class="role-select">
        <el-select v-model="level" clearable placeholder="全部" @change="query">
            <el-option
                    v-for="item in levelDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
    <el-button :loading="downLoading" class="role-select" type="primary" @click="download">下载</el-button>
    <span class="icon-span" slot="label">
            <i v-if="closeIcon" class="el-icon-close icon-zoom" @click="backNodeList"></i>
            <svg-icon v-else class="icon-zoom" :icon-class="fullscreenIcon" @click="zoomEvent"></svg-icon>
    </span>
</div>
</template>

<script>
export default {
    name: 'Header',
    props: {
        isFullscreen: {
            typeof: Boolean
        },
        fullscreenIcon: {
            typeof: String
        },
        downLoading: {
            typeof: Boolean
        },
        closeIcon: {
            typeof:Boolean
        }
    },
    data() {
        return {
            level: '',
            levelDict:[
                {label: 'info', value: 'info'},
                {label: 'notice', value: 'notice'},
                {label: 'warn', value: 'warn'}
            ],
        }
    },
    methods: {
        zoomEvent() {
            this.$emit('zoomEvent')
            // this.fullscreenIcon = this.isFullscreen ? 'el-icon-full-screen' : 'el-icon-rank'
        },
        // 查询
        query() {
            let params = {}
            if (this.level) {
              params.level = this.level
            }
            this.$emit('query', params)
        },
        // 下载
        download() {
            this.$emit('download')
        },
        backNodeList() {
            this.$router.push({ name: 'rangeNodeManage' })
        }
    }
}
</script>

<style lang="less" scoped>
.head{
    width: 100%;
    height: 50px;
    margin-top: 20px;
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
        margin-right: 45%;
    }
    ::v-deep .role-select{
        display: inline-block;
        margin-right: 15px;
    }
    .icon-span {
        padding: 12px 20px;
        .icon-zoom {
            font-size: 30px;
            color: #02DDEA;
            margin: 0 15px;
        }
    }
}
</style>