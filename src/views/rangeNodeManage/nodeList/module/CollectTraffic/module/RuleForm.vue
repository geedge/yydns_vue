<template>
    <div 
        class="rule-dialog" 
        v-if="visible"
    >
        <!-- 在此处指定弹窗的样式和内容 -->
        <i class="el-icon-close" style="float: right; padding-right: 8%;padding-top: 3%" @click="close"></i>
        <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="rule-form"
        >
            <el-row>
                <el-col :span="20">
                    <el-form-item label="规则名称" prop="rule_name">
                        <el-input v-model="form.rule_name" placeholder="请输入规则名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="规则" prop="rule">
                        <el-input type="textarea" v-model="form.rule" placeholder="请输入规则"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="submit-footer">
            <div>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="loading">确定</el-button>
            </div>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    name: 'RuleForm',
    props: ['isAdd'],
    data() {
        return {
            visible: false,
            loading: false,
            form: {
                rule_name: '', // 规则名称
                rule: '' // 规则
            },
            rule_id: '',
            rules: {
                rule_name: [
                    { required: true, message: '请输入规则名称', trigger: 'blur' }
                ],
                rule: [
                    { required: true, message: '请输入规则', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        close() {
            this.resetForm()
            // document.querySelector('.mask').style.display = 'none'
            this.visible = false
        },
        submit() {
            this.$refs.ruleForm.validate((valid) => {
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
            const url = this.$http.api.rule
            this.$axios.post(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '创建规则成功',
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
            const url = this.$http.api.rule + `/${this.rule_id}`
            this.$axios.put(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '编辑规则成功',
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
                rule_name: '', // 规则名称
                rule: '' // 规则
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .rule-dialog{
        width: 620px;
        height: 555px;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../../../../../img/background/addRuleBg.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .rule-form {
            margin-top: 70px;
            text-align: left;
        }
        .submit-footer{
            width: 100%;
            float: left;
            margin-top: 200px;
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
