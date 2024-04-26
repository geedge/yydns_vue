<template>
<div class="head">
    <div class="target-select">
        <span style="font-size: 30px;float: left;padding-top: 1%">已探测目标信息</span>
    </div>

<!--    <div class="input">-->
<!--        <el-input v-model="username" placeholder="名称查询输入" suffix icon="" >-->
<!--            <template v-slot:suffix>-->
<!--                <div class="icon-group">-->
<!--                    <img src="../../../img/inputl.png" alt="**">-->
<!--                    <img src="../../../img/inputIcon.png" alt="*" @click="query">-->
<!--                </div>-->
<!--            </template>-->
<!--        </el-input>-->
<!--    </div>-->
</div>
</template>

<script>
export default {
    name: 'Header',
    props: [],
    data() {
        return {
            username: ''
        }
    },
    watch: {},
    methods: {
        // 新增
        addUser() {
            this.$emit('addUser')
        },
        // 查询
        query() {
            let params = {}
            if (this.username !== '') {
                params.username = this.username
            }
            this.$emit('query', params)
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
    .target-select{
        font-size: 10px;
        float: left;
        margin-top: 0.5%;
        display: inline-block;
        height: 60%;
        width: 100%;
        margin-left: 0.5%;
    }
    .add-btn {
        height: 70%;
        width: 10%;
        margin-right: 2%;
        color: #ffffff;
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
}
</style>