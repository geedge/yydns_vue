<template>
    <div class="quick-dialog" v-if="visible">
        <!-- 在此处指定弹窗的样式和内容 -->
        <i class="el-icon-close" style="float: right; padding-right: 8%;padding-top: 3%" @click="close"></i>
        <el-form
            ref="quickForm"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="quick-form"
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
                    <el-form-item label="选择按真实tor网络模拟比例" class="long-item-label">
                        <el-radio-group v-model="form.ratio" @change="radioChange">
                            <el-radio label="0.01">1:100</el-radio>
                            <el-radio label="0.02">1:200</el-radio>
                            <el-radio label="0.002">1:500</el-radio>
                            <el-radio label="0.001">1:1000</el-radio>
                        </el-radio-group>
                        <div style="margin-top: 2%">
                            <span style="font-size: 12px">其他</span>
                            <el-input v-model="otherRatio" class="other-ratio" placeholder="请输入内容" @focus="otherRadioInput"></el-input>
                            <span style="font-size: 14px;color: #4b5362">(范围在0.001-0.01之间)</span>
                        </div>
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
            <el-row>
                <el-col :span="20">
                    <el-form-item label="创建方式" prop="createType">
                        <el-radio v-model="form.createType" label="interface">接口模式</el-radio>
                        <el-radio v-model="form.createType" label="consensus">consensus模式</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <div  class="upload-file" v-if="form.createType==='consensus'">
                    <input class="uploadBgImg" type="file" name="file" @change="selectFile" />
                    <div v-if="fileName">{{ fileName }}</div>
                </div>
            </el-row>
        </el-form>
        <div class="submit-footer" :style="form.createType==='consensus'?'margin-top: 60px':'margin-top: 120px'">
            <div>
                <el-button class="glBut" type="primary" @click="resetForm">重置</el-button>
                <el-button class="glBut but-color" style="width: 120px;" type="primary" @click="submitConfig" :loading="configLoading">仅添加配置</el-button>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="createLoading">创建</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QuickCreate',
    props: {
        isAdd: {
        typeof: Boolean,
        required: true
        }
    },
    data() {
        return {
            visible: false,
            createLoading: false,
            configLoading: false,
            form: {
                target_name: '', // 靶场名称
                description: '', // 靶场描述
                ratio: '', // 选择按真实tor网络模拟的比例
                attribute: '', // 所有权
                createType: '', // 创建方式
                file: '' // 上传文件
            },
            target_id: '',
            user_id: '',
            fileName: '',
            otherRatio: '',
            delTimer: null,
            counter: 0,
            rules: {
                target_name: [
                    { required: true, message: '请输入靶场名称', trigger: 'blur' }
                ],
                description: [
                    { required: false, message: '请输入描述', trigger: 'blur' }
                ],
                ratio: [
                    { required: true, message: '请选择模拟比例', trigger: 'change' }
                ],
                attribute: [
                    { required: true, message: '请选择所有权', trigger: 'change' }
                ],
                createType: [
                    { required: true, message: '请选择创建方式', trigger: 'change' }
                ]
            }
        }
    },
    destroyed() {
        if(this.delTimer) {
            clearInterval(this.delTimer)
            this.delTimer = null
        }
        this.counter = 0
    },
    methods: {
        close() {
            this.resetForm()
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
        },
        // 重置
        resetForm() {
            this.fileName = ''
            this.otherRatio = ''
            this.form = {
                target_name: '', // 靶场名称
                description: '', // 靶场描述
                ratio: '', // 选择按真实tor网络模拟的比例
                attribute: '', // 所有权
                createType: '', // 创建方式
                file: '' // 上传文件
            }
        },
        // 仅添加配置
        submitConfig() {
            this.$refs.quickForm.validate((valid) => {
                if (valid) {
                    this.configLoading = true
                    if (this.isAdd) {
                        this.add(false)
                    } else {
                        this.edit(false)
                    }
                }
            })
        },
        // 创建
        submit() {
            this.$refs.quickForm.validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    if (this.isAdd) {
                        this.add(true)
                    } else {
                        this.edit(true)
                    }
                }
            })
        },
        add (isCreate) {
            if (this.form.createType === 'interface') {
                // 接口模式
                const url = isCreate ? this.$http.api.asyncQuickInterface + '/?direct=true' : this.$http.api.asyncQuickInterface + '/?direct=false'
                const {target_name, description, ratio, attribute} = this.form
                const submitForm = { target_name, description, ratio, attribute }
                this.$axios.postForm(url, submitForm).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.close()
                        this.$emit('refresh')
                        // this.$notify({
                        //     title: '创建靶场成功',
                        //     type: 'success',
                        //     duration: 2500
                        // })
                        this.$notify({
                            title: res.message,
                            type: 'success',
                            duration: 2500
                        })
                        this.delTimer = setInterval(() => {
                            this.getTask(res?.result?.task_id || '')
                        }, 10 * 1000)
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.createLoading = false
                    this.configLoading = false
                })
            } else {
                // consensus模式
                const url = isCreate ? this.$http.api.asyncQuickConsensus + '/?direct=true' : this.$http.api.asyncQuickConsensus + '/?direct=false'
                const submitForm = new FormData()
                for(const key in this.form) {
                    submitForm.append(key, this.form[key])
                }
                this.$axios.postFormData(url, submitForm).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.close()
                        this.$emit('refresh')
                        // this.$notify({
                        //     title: '创建靶场成功',
                        //     type: 'success',
                        //     duration: 2500
                        // })
                        this.$notify({
                            title: res.message,
                            type: 'success',
                            duration: 2500
                        })
                        this.delTimer = setInterval(() => {
                            this.getTask(res?.result?.task_id || '')
                        },10 * 1000)
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.createLoading = false
                    this.configLoading = false
                })
            }
        },
        edit(isCreate) {
            const editForm = JSON.parse(JSON.stringify(this.form))
            if (this.otherRatio !== '') {
                editForm.ratio = this.otherRatio
            }
            if(this.form.createType === 'interface') {
                // 接口模式
                const url = isCreate ? this.$http.api.asyncQuickInterface + `/${this.target_id}/?direct=true` : this.$http.api.asyncQuickInterface + `/${this.target_id}/?direct=false`
                this.$axios.putForm(url, editForm).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.close()
                        this.$emit('refresh')
                        // this.$notify({
                        //     title: '编辑靶场成功',
                        //     type: 'success',
                        //     duration: 2500
                        // })
                        this.$notify({
                            title: res.message,
                            type: 'success',
                            duration: 2500
                        })
                        this.delTimer = setInterval(() => {
                            this.getTask(res?.result?.task_id || '')
                        }, 10 * 1000)
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.createLoading = false
                    this.configLoading = false
                })
            } else {
                // consensus模式
                const url = isCreate ? this.$http.api.asyncQuickConsensus + `/${this.target_id}/?direct=true` : this.$http.api.asyncQuickConsensus + `/${this.target_id}/?direct=false`
                const submitForm = new FormData()
                for(const key in editForm) {
                    submitForm.append(key, editForm[key])
                }
                this.$axios.putFormData(url, submitForm).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.close()
                        this.$emit('refresh')
                        // this.$notify({
                        //     title: '编辑靶场成功',
                        //     type: 'success',
                        //     duration: 2500
                        // })
                        this.$notify({
                            title: res.message,
                            type: 'success',
                            duration: 2500
                        })
                        this.delTimer = setInterval(() => {
                            this.getTask(res?.result?.task_id || '')
                        },10 * 1000)
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.createLoading = false
                    this.configLoading = false
                })
            }
        },
        // 模拟比例选择
        radioChange(val) {
            this.otherRatio = ''
        },
        // 模拟比例用输入框输入
        otherRadioInput(val) {
            this.form.ratio = ''
        },
        // 选择上传文件
        selectFile(e) {
            this.form.file = e.target.files[0]
            this.fileName = e.target.files[0].name
        },
        // 获取任务进度
        getTask(task_id) {
            const url = this.$http.api.task + '/' + task_id
            this.$axios.get(url, {}).then(res => {
                if(res.task_status !== 'PENDING' && res.task_status !== 'STARTED') {
                    if (res?.task_result?.code === 500 || res?.task_result?.message === 'false') {
                    this.$notify({
                        title: res?.task_result?.result || `${res.task_id}任务执行完毕，靶场部署失败`,
                        type: 'success',
                        duration: 2500
                    })
                } else {
                    this.$notify({
                        title: res?.task_result?.result || `${res.task_id}任务执行完毕，靶场部署成功`,
                        type: 'success',
                        duration: 2500
                    })
                }
                    clearInterval(this.delTimer)
                    this.delTimer = null
                    this.counter = 0
                    this.$emit('refresh')
                } else {
                    // this.$notify({
                    //     title: `${res.task_id}任务执行中`,
                    //     type: 'success',
                    //     duration: 2500
                    // })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.counter++
                if (this.counter >= 60) {
                    clearInterval(this.delTimer)
                    this.delTimer = null
                    this.counter = 0
                    this.$emit('refresh')
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .quick-dialog{
        width: 620px;
        height: 675px;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../../img/Group (2).svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .quick-form {
            margin-top: 70px;
            text-align: left;
            .long-item-label {
                ::v-deep .el-form-item__label {
                    padding: 12px 12px 0 70px;
                }
            }
            .other-ratio{
                width: 40%;
                margin-left: 5%;
                margin-right: 5%;
                background-color: #0c295b;
                display: inline-block;
                border: none;
            }
        }
        .upload-file{
            width: 100%;
            /*margin-left: 10%;*/
            text-align: center;
            color: rgba(81, 84, 102, 0.84);
            ::v-deep .el-upload-list {
                margin: 0;
                list-style: none;
                width: 400px !important;
                padding-left: 20%;
            }
            .uploadBgImg{
                width: 320px;
                height: 40px;
                background-image: url("../../../img/shangchuan.png");
                background-repeat: no-repeat; /* 可选，防止图像重复 */
                background-size: 100% auto; /* 宽度为100%，高度自适应保持宽高比 */
                text-align: right;
                padding-right: 10%;
                padding-top: 2%;
                font-size: 0;
            }
            .uploadBgImg::file-selector-button{
                padding: 0;
                background-color: transparent;
                cursor: pointer;
                font-size: 0;
            }
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