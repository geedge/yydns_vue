<template>
<div class="console-dialog" v-if="visible">
    <i class="el-icon-close" @click="close"></i>
    <div class="tag">
        <el-tag class="tags" :style="{'color': (tag==='主节点') ? '#f8fdff': '#565e6e'}" @click="updateTag('主节点')">主节点</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='被操作节点') ? '#f8fdff': '#565e6e'}" @click="updateTag('被操作节点')">被操作节点</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='文件管理') ? '#f8fdff': '#565e6e'}" @click="updateTag('文件管理')">文件管理</el-tag>
    </div>
    <div class="basic-box" v-show="tag==='主节点'">
        <div class="tip-message">请选择主节点作为打开文件系统的依据</div>
        <div class="content">
            <!-- 主节点 -->
            <MainNode
                :node-list="nodeList"
                @selectMainNode="selectMainNode"
            ></MainNode>
        </div>
        <footer class="anDiv">
            <el-button class="glBut" type="primary" @click="close">取消</el-button>
            <el-button class="glBut but-color" type="primary" @click="updateTag('被操作节点')">下一步</el-button>
        </footer>
    </div>
    <div class="basic-box" v-show="tag==='被操作节点'">
        <div class="tip-message">请勾选多个节点</div>
        <div class="content">
            <!-- 被操作节点 -->
            <OperateNode
                :node-list="nodeList"
                @selectOperateNode="selectOperateNode"
            ></OperateNode>
        </div>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('主节点')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('文件管理')">下一步</el-button>
            </div>
        </div>

    </div>
    <div class="basic-box" v-if="tag==='文件管理'">
        <div class="tip-message" style="height: 76px;">
            <span>{{`主节点名称：${master_node_name}`}}<br/>{{`已勾选的节点名称列表：${batch_node_name_list.join('、')}`}}</span>
        </div>
        <!-- 文件管理 -->
        <FileManager
            ref="fileManager"
        ></FileManager>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('被操作节点')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="download" :loading="loading">下载</el-button>
            </div>
        </div>
    </div>
</div>  
</template>

<script>
import MainNode from '../components/MainNode.vue'
import OperateNode from '../components/OperateNode.vue'
import FileManager from '../components/DownloadFileManager.vue'
import qs from 'qs'
export default {
    name: 'Download',
    components:{
        MainNode,
        OperateNode,
        FileManager
    },
    props: {
        target_id: {
            typeof: String,
            required: true
        }
    },
    data() {
        return {
            nodeList: [],
            downloadForm: {
                master_node_id: '',
                batch_node_id_list: [],
                current_dir: '',
                filename: ''
            },
            master_node_name: '',
            batch_node_name_list: [],
            visible:false,
            loading: false,
            tag:"主节点",
            form: {}
        }
    },
    methods: {
        // 获取节点列表
        getNodeList() {
            const reqParams = {
                page: 1,
                size: 99
            }
            if (this.target_id && this.target_id !== '') {
                reqParams.target_id = this.target_id
            }
            this.$axios.get(this.$http.api.getNodeList, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.nodeList = res?.result?.items
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {})
        },
        // 选择主节点
        selectMainNode({ id, nick_name }) {
            this.$store.commit('range/setNodeId', id)
            this.downloadForm.master_node_id = id
            this.master_node_name = nick_name
        },
        // 选择被操作节点
        selectOperateNode(selectRows) {
            this.batch_node_name_list = []
            this.downloadForm.batch_node_id_list = selectRows.map(row => {
                this.batch_node_name_list.push(row.nick_name)
                return row.id
            })
        },
        // 选择上传文件
        selectUploadFile({path, file}) {
            this.downloadForm.current_dir = path
            this.downloadForm.file = file
        },
        // 关闭
        close() {
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
            this.tag = '主节点'
            this.resetForm()         
        },
        // 重置
        resetForm() {
            this.form = {}
        },
        // 选择哪个页面
        updateTag(val){
            this.tag=val
        },
        // 提交数据
        download() {
            this.downloadForm.current_dir = this.$refs.fileManager.selectNode.path
            this.downloadForm.filename = this.$refs.fileManager.filename
            const reqParams = qs.stringify(this.downloadForm, { arrayFormat: 'repeat' })
            const url = this.$http.api.batchDownload + '?' + reqParams
            this.$axios.getFile(url).then(res => {
                if (res.status == 200 || res.statusText == "OK") {
                    const { data, headers } = res
                    const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
                    // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
                    //const blob = new Blob([JSON.stringify(data)], ...)
                    const blob = new Blob([data], {type: headers['content-type']})
                    let dom = document.createElement('a')
                    let url = window.URL.createObjectURL(blob)
                    dom.href = url
                    dom.download = decodeURI(fileName)
                    dom.style.display = 'none'
                    document.body.appendChild(dom)
                    dom.click()
                    dom.parentNode.removeChild(dom)
                    window.URL.revokeObjectURL(url)
                    this.$notify({
                        title: '下载文件成功',
                        type: 'success',
                        duration: 2500
                    })
                } else {
                    this.$notify({
                        title: '下载文件失败',
                        type: 'success',
                        duration: 2500
                    })                   
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.close()
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
            text-align: left;
            padding: 11px 0 12px 20px;
            font-size: 20px;
            background-color: #1A2648;
            border-radius: 4px;
            margin-bottom: 2%;
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: row;
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