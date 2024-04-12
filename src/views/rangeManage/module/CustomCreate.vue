<template>
    <div 
        class="custom-dialog" 
        v-if="visible"
    >
        <!-- 在此处指定弹窗的样式和内容 -->
        <i class="el-icon-close" style="float: right; padding-right: 8%;padding-top: 3%" @click="close"></i>
        <el-form
            ref="customForm"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="custom-form"
        >
            <el-row>
                <el-col :span="20">
                    <el-form-item label="靶场名称" prop="target_name">
                        <el-input v-model="form.target_name"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="靶场描述" prop="description">
                        <el-input type="textarea" v-model="form.description" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="所有权" prop="attribute">
                        <el-radio v-model="form.attribute" label="private">私有</el-radio>
                        <el-radio v-model="form.attribute" label="public">公用</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="submit-footer">
            <div>
                <el-button class="glBut" type="primary" @click="resetForm">重置</el-button>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="loading">{{isAdd ? '提交' : '确定'}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomCreate',
    props: {
        isAdd: {
        typeof: Boolean,
        required: true
        }
    },
    data() {
        return {
            visible: false,
            loading: false,
            form: {
                target_name: '', // 靶场名称
                description: '', // 靶场描述
                attribute: '' // 所有权
            },
            target_id: '',
            user_id: '',
            rules: {
                target_name: [
                    { required: true, message: '请输入靶场名称', trigger: 'blur' }
                ],
                description: [
                    { required: false, message: '请输入描述', trigger: 'blur' }
                ],
                attribute: [
                    { required: true, message: '请选择所有权', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        close() {
            this.resetForm()
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
        },
        submit() {
            this.$refs.customForm.validate((valid) => {
                if (valid) {
                    if (this.isAdd) {
                        this.add()
                    } else {
                        this.edit()
                    }
                }
            })
        },
        add () {
            this.loading = true
            const url = this.$http.api.target
            this.$axios.post(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '创建靶场成功',
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
        edit() {
            this.loading = true
            const url = this.$http.api.target + `/${this.target_id}`
            this.$axios.put(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '编辑靶场成功',
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
                target_name: '', // 靶场名称
                description: '', // 靶场描述
                attribute: '' // 所有权
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .custom-dialog{
        width: 520px;
        height: 363px;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../../img/Group.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */

        .custom-form {
            margin-top: 70px;
            text-align: left;
        }
        .submit-footer{
            width: 100%;
            float: left;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 2%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }
            .but-color {
                background-color: #02DDEA;
            }
        }
    }
</style>