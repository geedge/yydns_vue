<template>
    <div class="account-manage" ref="appRef">
        <div class="show">
            <div class="title">修改密码</div>
            <div class="form-box">
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="accountForm"
                    label-position="right"
                    label-width="100px"
                    class="form-content"
                >
                    <el-form-item label="原始密码" prop="old_password">
                        <el-input v-model="form.old_password" placeholder="请输入原始密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_password">
                        <el-input v-model="form.new_password" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码"  prop="new_password_again">
                        <el-input v-model="form.new_password_again" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small">取消</el-button>
                        <el-button :loading="loading" size="small" type="primary" @click="onSubmit">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            loading: false,
            form: {
                old_password: '',
                new_password: '',
                new_password_again: ''
            },
            rules: {
                old_password: [
                    { required: true, message: '请输入原始密码', trigger: 'change' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                new_password: [
                    { required: true, message: '请输入新密码', trigger: 'change' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                new_password_again: [
                    { required: true, message: '请输入新密码', trigger: 'change' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ]
            }
        }
    },
    mounted() {},
    watch: {},
    created() {},
    methods:{
        // 创建新密码
        onSubmit() {
            this.$refs.accountForm.validate((valid) => {
                if (valid) {
                    this.editPwd()
                }
            });

        },
        editPwd() {
            this.loading = true
            const url = this.$http.api.updatePwd
            this.$axios.put(url, {}, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.$notify({
                        title: '修改密码成功',
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        resetForm() {
            this.form = {
                old_password: '',
                new_password: '',
                new_password_again: ''
            }
        }
    }
}
</script>

<style lang='less' scoped="scoped">
.account-manage{
    width: 100%;
    height: 100%;
    float: right;
    position: relative; /* 确保相对定位生效 */
    .show{
        width: 95%;
        height: 95%;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../img/backgroundFourCorner.png');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .title {
            font-family: PingFang HK;
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            letter-spacing: 0px;
            text-align: left;
            padding: 30px 0 0 30px;
        }
        .form-box {
            width: 100%;
            height: calc(100% - 50px);
            display: flex;
            justify-content: center;
            align-items: center;
            .form-content {
                width: 30%;
            }
        }
    }
}
</style>
