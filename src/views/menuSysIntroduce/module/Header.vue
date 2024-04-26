<template>
<div class="head">
    <div class="target-select">
        <span style="font-size: 24px;float: left;padding-top: 1%">能力指代不同渗透策略,代理将根据策略逻辑以及主控端下发的生成参数生成对应的载荷</span>
    </div>
<!--    <div class="input">-->
<!--        <el-input v-model="country_name" placeholder="查询" suffix icon="">-->
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
            country_name: ''
        }
    },
    watch: {},
    methods: {
        // 新增
        add() {
            this.$emit('add')
        },
        // 查询
        query() {
            let params = {}
            if (this.country_name !== '') {
                params.country_name = this.country_name
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
            // position: absolute;
            // top: 12px;
            // right: 140px;
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
}
</style>