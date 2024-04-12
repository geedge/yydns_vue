<template>
<div class="console-dialog" v-if="visible">
    <!-- 在此处指定弹窗的样式和内容 -->
    <i class="el-icon-close" @click="close"></i>
    <div class="tag">
        <el-tag class="tags" :style="{'color': (tag==='主节点') ? '#f8fdff': '#565e6e'}" @click="updateTag('主节点')">主节点</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='被操作节点') ? '#f8fdff': '#565e6e'}" @click="updateTag('被操作节点')">被操作节点</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='控制台') ? '#f8fdff': '#565e6e'}" @click="updateTag('控制台')">控制台</el-tag>
    </div>
    <div class="basic-box" v-if="tag==='主节点'">
        <div class="tip-message">请选择主节点作为打开文件系统的依据</div>
        <div class="content">
            <el-table
                class="main-table styleTable"
                ref="multipleTable"
                height="100%"
                style="width: 100%;"
                :data="tableData"
                tooltip-effect="dark"
                highlight-current-row
                @selection-change="handleSelectionMain"
            >
                <el-table-column
                    align="center"
                    type="selection"
                    width="80"/>
                <el-table-column
                    align="center" 
                    prop="id"
                    label="id"
                    width="80"/>
                    <el-table-column 
                    align="center"
                    prop="nick_name"
                    label="节点昵称"
                    min-width="100"/>
                <el-table-column 
                    align="center"
                    prop="role"
                    label="角色"
                    min-width="100">
                    <template slot-scope="scope">
                        <svg-icon :icon-class="scope.row.role"></svg-icon>
                    </template>                        
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="ip"
                    label="ip"
                    min-width="150"/>
                <el-table-column
                    align="center"
                    prop="status"
                    label="部署状态"
                    min-width="100"
                >
                    <!-- <template slot-scope="scope">
                        {{ scope.row.has_deployed ? '已部署' : '未部署' }}
                    </template> -->
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="create_time"
                    label="创建开始时间"
                    min-width="100"
                >
                <template slot-scope="scope">
                    {{ scope.row.create_time | formatDate }}
                </template>
                </el-table-column>
                    <el-table-column
                    align="center"
                    prop="complete_time"
                    label="创建完成时间"
                    min-width="100"
                >
                <template slot-scope="scope">
                    {{ scope.row.complete_time | formatDate }}
                </template>
                </el-table-column>
            </el-table>
        </div>
        <footer class="anDiv">
            <el-button class="glBut" type="primary" @click="close">取消</el-button>
            <el-button class="glBut but-color" type="primary" @click="updateTag('被操作节点')">下一步</el-button>
        </footer>
    </div>
    <div class="basic-box" v-if="tag==='被操作节点'">
        <div class="tip-message">请勾选多个节点</div>
        <div class="content">
            <el-table
                class="main-table styleTable"
                ref="multipleTable"
                height="100%"
                style="width: 100%;"
                :data="tableData"
                tooltip-effect="dark"
                highlight-current-row
                @selection-change="handleSelectionMain"
            >
                <el-table-column
                    align="center"
                    type="selection"
                    width="80"/>
                <el-table-column
                    align="center" 
                    prop="id"
                    label="id"
                    width="80"/>
                    <el-table-column 
                    align="center"
                    prop="nick_name"
                    label="节点昵称"
                    min-width="100"/>
                <el-table-column 
                    align="center"
                    prop="role"
                    label="角色"
                    min-width="100">
                    <template slot-scope="scope">
                        <svg-icon :icon-class="scope.row.role"></svg-icon>
                    </template>                        
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="ip"
                    label="ip"
                    min-width="150"/>
                <el-table-column
                    align="center"
                    prop="status"
                    label="部署状态"
                    min-width="100"
                >
                    <!-- <template slot-scope="scope">
                        {{ scope.row.has_deployed ? '已部署' : '未部署' }}
                    </template> -->
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="create_time"
                    label="创建开始时间"
                    min-width="100"
                >
                <template slot-scope="scope">
                    {{ scope.row.create_time | formatDate }}
                </template>
                </el-table-column>
                    <el-table-column
                    align="center"
                    prop="complete_time"
                    label="创建完成时间"
                    min-width="100"
                >
                <template slot-scope="scope">
                    {{ scope.row.complete_time | formatDate }}
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('主节点')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('控制台')">下一步</el-button>
            </div>
        </div>

    </div>
    <div class="basic-box" v-if="tag==='控制台'">
        <div class="tip-message">主节点名称：10-relaytwlgthavry
已勾选的节点名称列表：11-relayyqbgcxuewy、12-relayztitnmkgfl…</div>
        <div class="content">
            <el-input
                type="textarea"
                :rows="25"
                placeholder="请输入命令"
                v-model="textarea">
            </el-input>
        </div>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('被操作节点')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="loading">确认</el-button>
            </div>
        </div>
    </div>
</div>  
</template>

<script>
export default {
    name: 'Console',
    props: {
        tableData: {
            typeof: Array,
            require: true
        },
        target_id: {
            typeof: String,
            required: true
        }
    },
    data() {
        return {
            visible:false,
            loading: false,
            tag:"主节点",
            setting_id: '',
            form: {
                role: '', // 角色选择
                tor_version: '', // tor版本
                image_id: '', // 选择镜像
                replicas: '', // 复本数
                bandwidth: '', // 宽带限制
                memory: '', // 内存限制
                service: '', // 服务器地址
                out_port: '', // 代理端口
                or_port: '', // or端口
                dir_port: '', // dir端口
                socks_port: '', // 客户端监听端口
                control_port: '', // 客户端控制端口

                country_id: '', // 国家
                network_id: '', // 网络

                deployType: '', // 部署方式
                direct: false, // 直接部署true 仅添加配置false
                start_tcpdump: false // 启动采集程序并部署 true
            },
            roleDict:[
                {label: '权威目录节点', value: 'da'},
                {label: '路由节点', value: 'relay'},
                {label: '出口节点', value: 'exit'},
                {label: '洋葱服务节点', value: 'onion'},
                {label: '客户端节点', value: 'client'},
                {label: '入口节点', value: 'guard'},
                {label: '其他节点', value: 'other'}
            ],
            torDict: [],
            networkDict: [],
            imageDict: []
        }
    },
    methods: {
        // 选择主节点
        handleSelectionMain() {},
        // 关闭
        close() {
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
            this.tag = '主节点'
            this.resetForm()         
        },
        // 重置
        resetForm() {
            this.form = {
                role: '', // 角色选择
                tor_version: '', // tor版本
                image_id: '', // 选择镜像
                replicas: '', // 复本数
                bandwidth: '', // 宽带限制
                memory: '', // 内存限制
                service: '', // 服务器地址
                out_port: '', // 代理端口
                or_port: '', // or端口
                dir_port: '', // dir端口
                socks_port: '', // 客户端监听端口
                control_port: '', // 客户端控制端口

                country_id: '', // 国家
                network_id: '', // 网络

                deployType: '', // 部署方式
                direct: false, // 直接部署true 仅添加配置false
                start_tcpdump: false // 启动采集程序并部署 true
            }
        },
        // 选择哪个页面
        updateTag(val){
            this.tag=val
        },
        // 角色选择
        selectRole(node) {
            if (node === 'other') {
                this.$emit('openRoleForm')
            }
            // 获取torDict
            this.$axios.get(this.$http.api.getTorDict, {role: this.form.role}).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.torDict = res?.result
                }
            }).catch(err => {
                console.log(err)
            })
            // 获取镜像字典
            this.getImageDict()

        },
        // tor选择
        selectTor(tor){
            // 获取镜像字典
            this.getImageDict()
        },
        // 获取imageDict
        getImageDict(){
            const params = {
                page:1,
                size: 99,
                image_name: this.form.role,
                image_version: this.form.tor_version
            }
            this.$axios.get(this.$http.api.getImageDict, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.imageDict = res?.result?.items.map(item => {
                        return {
                            label: item.image_name + '-' + item.image_version,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })            
        },
        // 获取网络
        getNetworkDict(){
            const params = {
                page:1,
                size: 99,
                country_id: this.form.country_id,
            }
            this.$axios.get(this.$http.api.getNetworkDict, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.networkDict = res?.result?.items.map(item => {
                        return {
                            label: item.cidr,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })            
        },
        selectDeploy(deployType) {
            switch (deployType) {
                case 'direct':
                    this.form.direct = true
                    break
                case 'only':
                    this.form.direct = false
                    break
                case 'start':
                    this.form.start_tcpdump = true
                    break
                default:
                    this.form.direct = true
                    break
            }
        },
        // 提交数据
        submit() {
            // const submitForm = this.setSubmitForm()
            // if (this.isAdd) {
            //     this.add(submitForm)
            // } else {
            //     this.edit(submitForm)
            // }
        },
        setSubmitForm() {            
            const {role, image_id, replicas, bandwidth, memory } = this.form
            let submitForm = {role, image_id, replicas, bandwidth, memory }
            if (this.form.role === 'other') {
                submitForm.role = this.otherRole
            } else if (this.form.role==='da'||this.form.role==='relay'||this.form.role ==='guard'||this.form.role ==='exit') {
                submitForm.tor_version = this.form.tor_version
                submitForm.or_port = this.form.or_port
                submitForm.dir_port = this.form.dir_port
            } else if (this.form.role==='onion') {
                submitForm.tor_version = this.form.tor_version
                submitForm.service = this.form.service
                submitForm.socks_port = this.form.socks_port
                submitForm.control_port = this.form.control_port
            } else if (this.form.role==='client') {
                submitForm.tor_version = this.form.tor_version
                submitForm.out_port = this.form.out_port
                submitForm.socks_port = this.form.socks_port
                submitForm.control_port = this.form.control_port
            }
            return submitForm
        },
        add(submitForm) {
            this.loading = true
            const url = this.$http.api.setting + `/?target_id=${this.target_id}&network_id=${this.form.network_id}&direct=${this.form.direct}&start_tcpdump=${this.form.start_tcpdump}`
            this.$axios.post(url, submitForm).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '添加靶场配置成功',
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
        edit(submitForm) {
            this.loading = true
            const url = this.$http.api.setting + `/?target_id=${this.target_id}&setting_id=${this.setting_id}&network_id=${this.form.network_id}&direct=${this.form.direct}&start_tcpdump=${this.form.start_tcpdump}`
            this.$axios.put(url, submitForm).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '添加靶场配置成功',
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })            
        }
    }
}
</script>

<style lang="less" scoped>
.console-dialog{
    z-index: 997;
    width: 1331px;
    height: 800px;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    background-image:url('../../../../img/background/NodeListDialog.svg');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */
    .el-icon-close{
        float: right;
        padding-right: 8%;
        padding-top: 1.8%
    }
    .tag{
        margin-left: 15%;
        .tags{
            margin-right: 5%;
            margin-top: 1%;
            font-size: 23px;
            border: none;
            background-color: transparent !important;
            color: #565e6e;
        }
    }

    .base-input {
        width: 100%;
        float: left;
        margin-top: 2%;
        text-align: center;     
    }
    .label-span {
        margin-right: 3%;
        display: inline-block;
        width: 60px;
        text-align: right;
    }
    .but-color {
        background-color: #02DDEA !important;
    }
    .basic-box{
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 2%;
        .tip-message{
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            background-color: #1A2648;
            border-radius: 4px;
            margin-bottom: 2%;
        }
        .content {
            flex: 1;
            ::v-deep .el-textarea__inner {
                background-color: #1A2648;
            }
        }
        .anDiv{
            width: 100%;
            float: left;
            margin-bottom: 7%;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 5%;
                margin-right: 5%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }

        }
    }
}
</style>