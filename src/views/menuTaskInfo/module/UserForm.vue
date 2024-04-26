<template>
    <div 
        class="user-dialog" 
        v-if="visible"
    >
        <span class="dialog-title">{{ title }}</span>
        <!-- 在此处指定弹窗的样式和内容 -->
        <i class="el-icon-close" style="float: right; padding-right: 8%;padding-top: 3%" @click="close"></i>
        <el-form
            ref="userForm"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="user-form"
        >
            <el-row>
                <el-col :span="20">
                    <el-form-item label="角色名称" prop="role_name">
                        <el-input v-model="form.role_name" :disabled="!isAdd" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="权限" prop="permissions">
                        <el-checkbox-group v-model="form.permissions" style="display: inline-block;">
                            <el-checkbox v-for="permission in permissionDict" :label="permission.value" :key="permission.value">
                                {{ permission.label }}
                            </el-checkbox>
                        </el-checkbox-group>
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
    name: 'UserForm',
    props: ['isAdd', 'permissionDict'],
    data() {
        return {
            visible: false,
            loading: false,
            title: '新增角色',
            form: {
                role_name: '', // 角色名称
                permissions: [] // 选中权限
            },
            role_id: '',
            rules: {
                role_name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                permissions: [
                    { required: true, message: '请选择权限', trigger: 'change' }
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
            this.$refs.userForm.validate((valid) => {
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
            const url = this.$http.api.addRole
            this.$axios.post(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '创建角色成功',
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
            const url = this.$http.api.editRole + `/${this.role_id}`
            this.$axios.put(url, this.form.permissions).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '编辑角色成功',
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
                role_name: '', // 角色名称
                permissions: [] // 选中权限
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .user-dialog{
        width: 520px;
        height: 363px;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../../img/background/dialog520-363.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .dialog-title {
            font-size: 20px;
            float: left;
            margin: 11px 0 11px 20px;
        }
        .user-form {
            margin-top: 70px;
            text-align: left;
            ::v-deep .el-form-item__content {
                line-height: 15px;
            }
        }
        .submit-footer{
            width: 100%;
            float: left;
            margin-top: 50px;
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