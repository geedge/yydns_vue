<template>
<div class="head">
    <div class="target-select">
        <span style="font-size: 14px;float: left;padding-top: 1%">角色列表</span>
    </div>
    <img class="add-btn" src="../../../img/btn/addRoleBtn.svg" @click="addRole">
</div>
</template>

<script>
export default {
    name: 'Header',
    props: [],
    data() {
        return {
            role_name: ''
        }
    },
    watch: {},
    methods: {
        // 新增
        addRole() {
            this.$emit('addRole')
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
        width: 10%;
        margin-left: 0.5%;
    }
    .add-btn {
        height: 70%;
        width: 10%;
        color: #ffffff;
    }
}
</style>