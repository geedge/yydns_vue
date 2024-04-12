<template>
<div class="role-dialog" v-if="visible">
    <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 2.8%" @click="close"></i>
    <div class="fbs">
        <span style="margin-right: 3%">文件名</span>
        <el-input
            size="mini"
            :value="value"
            placeholder="请输入内容"
            style="width: 50%"
            v-bind="$attrs"
            v-on="$listeners">
        </el-input>
    </div>
    <div class="anDiv">
        <div>
            <el-button class="glBut" type="primary" @click="submit">确认</el-button>
        </div>
    </div>
</div>  
</template>

<script>
export default {
    name: 'RoleForm',
    props: {
        value: {
            typeof: String,
            require: true,
            default: ''
        }
    },
    data() {
        return {
            visible: false
        }
    },
    watch: {
        value: {
            handler(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        close() {
            // document.querySelector('.mask').style.display = 'none'
            this.visible = false
        },
        submit() {
            // document.querySelector('.mask').style.display = 'none'
            this.visible = false
            this.$emit('makeDirSubmit')
        }
    }

}
</script>

<style lang="less" scoped>
.role-dialog{
    z-index: 998;
    width: 300px;
    height: 120px;
    position: absolute; /* 绝对定位 */
    top: 100px; /* 向下偏移50% */
    left: 150px; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    background-image:url('../../../../img/jbpzxybqr.png');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
    .fbs{
        width: 100%;
        float: left;
        margin-top: 3%;
        text-align: center;
    }
    .anDiv{
        width: 100%;
        float: left;
        margin-top: 5%;
        text-align: center;
        .glBut{
            width: 50px;
            height: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 5%;
            background-color: rgba(24, 133, 234, 0.2);
            color: #1b7cc4;
        }
    }
}
</style>