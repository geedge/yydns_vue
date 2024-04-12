<template>
<div class="content">
    <el-tree
        ref="tree"
        class="tree-section"
        lazy
        node-key="id"
        :data="treeData"
        :props="defaultProps"
        :load="loadNode"
        @node-click="handleNodeClick"
        v-dragresize="dragConfig"
    >
    </el-tree>
    <div class="tree-content">
        <div style="text-align:left; width: 100%; padding: 10px;border: 1px solid #BAD0F11A;">
            <span>
                {{ dirTitle }}
            </span>
        </div>
        <div  style="clear:both;text-align:left; padding: 10px;border-bottom: 1px solid #BAD0F11A;">
            <img src="../../../../img/icon/file-icon.svg" alt="" style="width: 18px; height: 18px;">
            {{ currentFileName }}
        </div>
        <ul style="clear:both;" class="tree-content-ul">
            <li v-for="fileItem in fileList" :key="fileItem.name">
                <i class="el-icon-document file-info" style="font-size: 20px"></i>
                <span class="file-info">{{ fileItem.name }}</span>
                <span class="file-info">{{ fileItem.size }}</span>
                <span class="file-info">{{ fileItem.time }}</span>
            </li>
        </ul>
        <!-- <div class="empty-box" @contextmenu.prevent="openUploadMenu($event)"></div> -->
    </div>
    <ul
        v-show="visible"
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu"
    >
        <!-- <li>
        <label
            class="button"
            for="file-input"
        >
            <span>上传</span>
            <input
                type="file"
                class="file-input"
                id="file-input"
                @change="upload"
            />
        </label>
        </li> -->
        <!-- <li @click="download">下载</li>
        <li @click="del">删除</li> -->
    </ul>
    <!-- <ul
        v-show="uploadVisible"
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu"
    >
        <li>
        <label
            class="button"
            for="file-input"
        >
            <span>上传</span>
            <input
                type="file"
                class="file-input"
                id="file-input"
                @change="upload"
            />
        </label>
        </li>
    </ul> -->
    <!-- <div v-show="showTreeMenu" class="treeMenu">
        <div @click="makeDir">新建文件夹</div>
        <div @click="delDir">删除文件夹</div>
    </div> -->
    <DirNameForm
        ref="dirNameForm"
        v-model="dirName"
        @makeDirSubmit="makeDirSubmit">
    </DirNameForm>
</div>
</template>

<script>
import DirNameForm from './DirNameForm.vue' 
export default {
components: { DirNameForm },
props: ['isFullscreen'],
data() {
    return{
        visible: false,
        uploadVisible: false,
        top: 0,
        left: 0,
        nodeId: '',
        dirTitle: '>',
        currentFileName: '',
        fileList: [],
        selectFile: {},
        selectNode: {path: '/'},
        rightClickNode: {},
        defaultProps: {
            children: 'children',
            label: 'name',
        },
        showTreeMenu: false, // 文件夹数据
        contextNode: {}, // 文件夹数据
        dirName: '', // 新建文件名
        treeData: []
    }
},
computed: {
    dragConfig() {
        return [
        {
            dragBorder: "right",
            setCssProperty: "width",
        },
        ];
    },
},
watch: {
    '$store.state.range.nodeId': {
        handler(newVal, oldVal) {
            this.nodeId = newVal
            // this.getCurrentDirFile('/')
        },
        immediate: true
    },
    visible(value) {
        if (value) {
            document.body.addEventListener('click', this.closeMenu)
        } else {
            document.body.removeEventListener('click', this.closeMenu)
        }
    },
    uploadVisible(value) {
        if (value) {
            document.body.addEventListener('click', this.closeUploadMenu)
        } else {
            document.body.removeEventListener('click', this.closeUploadMenu)
        }
    },
},
methods: {
    // upload(e) {
    //     this.$emit('selectUploadFile', {path: this.selectNode.path, file: e.target.files[0]})
    //     const params = {
    //         node_id : this.nodeId,
    //         current_dir: this.selectNode.path,
    //         file: e.target.files[0]
    //     }
    // },
    updateCurrentPath() {
        this.handleNodeClick(this.selectNode)
        this.setCurrentHighlight(this.selectNode.$treeNodeId);
    },
    download() {
        // this.downLoading = true
        const reqParams = {
            node_id : this.nodeId,
            current_dir: this.selectNode.path,
            filename: this.selectFile.name
        }
        this.$axios.getFile(this.$http.api.downloadFile, reqParams).then(res => {
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
        // this.downLoading = false
        })
    },
    del() {
        const params = {
            node_id : this.nodeId,
            current_dir: this.selectNode.path,
            filename: this.selectFile.name
        }
        this.$axios.delete(this.$http.api.delFile, params).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.$notify({
                    title: '删除文件成功',
                    type: 'success',
                    duration: 2500
                })
                // 更新当前路径下的文件信息
                this.handleNodeClick(this.selectNode)
                // console.log('选中了节点id===', this.selectNode.$treeNodeId)
                this.setCurrentHighlight(this.selectNode.$treeNodeId);
                // this.init()
            }
        }).catch(err => {
            console.log(err)
        })
    },
    // 设置当前选中高亮
    setCurrentHighlight (id) {
        this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(id)
        })
    },
    openMenu(fileItem, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 60 // 15: margin right

        if (left > maxLeft) {
        this.left = maxLeft
        } else {
        this.left = left
        }

        if (this.isFullscreen) {
        this.top = e.clientY - 180 // fix 位置bug
        } else {
        this.top = e.clientY - 160 // fix 位置bug
        }
        this.uploadVisible = false
        this.visible = true
        this.selectFile = fileItem
    },
    closeMenu() {
        this.visible = false
    },
    openUploadMenu(e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 60 // 15: margin right

        if (left > maxLeft) {
        this.left = maxLeft
        } else {
        this.left = left
        }

        if (this.isFullscreen) {
        this.top = e.clientY - 120 // fix 位置bug
        } else {
        this.top = e.clientY - 160 // fix 位置bug
        }
        this.visible = false
        this.uploadVisible = true
    },
    closeUploadMenu() {
        this.uploadVisible = false
    },
    // 获取当前路径下文件
    getCurrentDirFile(currentDir) {
        const reqParams = { node_id: this.nodeId, current_dir: currentDir }
        return this.$axios.get(this.$http.api.getCurrentDir, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                const dirs = res?.result?.object?.dir || []
                this.fileList = res?.result?.object?.file || []
                // console.log('请求回来files===', files)
                const nodeData = dirs.map(dir => {
                    return { 
                        name: dir.name,
                        path: currentDir === '/' ? currentDir + dir.name : `${currentDir}/${dir.name}`,
                        fileList: []
                    }
                })
                // console.log('请求回来nodeData====', nodeData)
                return nodeData
            }
        }).catch(err => {
            console.log(err)
        })        
    },
    // 点击加载子节点
    async loadNode(node, reslove) {
        // console.log('执行了loadNode', node)
        if (node.level == 0) {
            let nodeData = await this.getCurrentDirFile('/')
            // console.log('初始化数据===', nodeData)
            // this.selectNode = nodeData.fileList
            return reslove(nodeData)
        } else {
            let nodeData = await this.getCurrentDirFile(node.data.path)
            // 判断是否为最底层节点 根据自己接口返回的数据判断即可
            nodeData.forEach(item => {
            item.hasChildren == false ? item.lastNode = ture : null
            });
            // this.selectNode = nodeData.fileList
            return reslove(nodeData)
        }
    },
    handleNodeClick(node) {
        // this.fileList = []
        // console.log('选中了节点===', node)
        // console.log('选中了节点id===', node.$treeNodeId)
        this.selectNode = node
        this.dirTitle = node.path.split('/').join('>')
        this.currentFileName = node.name
        // this.fileList = node.fileList
        const reqParams = { node_id: this.nodeId, current_dir: node.path }
        this.$axios.get(this.$http.api.getCurrentDir, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.fileList = res?.result?.object?.file || []
            }
        }).catch(err => {
            console.log(err)
        }) 
    },
    openTreeMenu(event, data, node, target) {
        // console.log(event, data, node, target)
        this.showTreeMenu = true // 显示菜单
        this.contextNode = data // 存储数据
        // console.log(this.contextNode, 'contextNode')
        // console.log(node, 'rightClickNode=======')
        // console.log(target, 'target')
        this.rightClickNode = node
        document.querySelector('.treeMenu').setAttribute('style',`top:${event.clientY + 30}px;left:${event.clientX + 30}px;`)
        document.addEventListener('click', this.closeTreeMenu)
        document.addEventListener('contextmenu', this.closeTreeMenu)
    },
    closeTreeMenu() {
        this.showTreeMenu = false // 关闭菜单
        document.removeEventListener('click', this.closeTreeMenu)
        document.removeEventListener('contextmenu', this.closeTreeMenu)
    },
    // 当新建文件夹时，先填写名字
    openDirNameForm() {
        this.$refs.dirNameForm.visible = true
    },
    // 新建文件夹
    makeDir() {
        this.openDirNameForm()
    },
    // 新建文件夹接口提交
    makeDirSubmit() {
        const reqParams = { node_id: this.nodeId, current_dir: this.contextNode.path, new_dir_name: this.dirName }
        this.$axios.get(this.$http.api.makeDir, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.$notify({
                    title: '新建文件夹成功',
                    type: 'success',
                    duration: 2500
                })
                // 页面增加子节点
                let id = Math.ceil(Math.random() * 1000000)
                var addNode = {
                        path: this.contextNode.path + '/' + this.dirName,
                        name: this.dirName,
                        fileList: []
                    // id: id,
                    // name: this.dirName,
                    // data: {
                    //     path: this.contextNode.path,
                    //     name: this.dirName,
                    //     fileList: []
                    // }
                }
                    // console.log(addNode, 'addNode======')
                this.$refs.tree.append(addNode, this.rightClickNode)
            }
        }).catch(err => {
            console.log(err)
        }) 
    },
    // 删除文件夹
    delDir() {
        const index = this.contextNode.path.lastIndexOf('/')
        const path = this.contextNode.path.substring(0, index);
        const params = {
            node_id : this.nodeId,
            current_dir: path,
            dir_name: this.contextNode.name
        }
        this.$axios.delete(this.$http.api.delDir, params).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.$notify({
                    title: '删除文件成功',
                    type: 'success',
                    duration: 2500
                })
                // 页面删除子节点
                this.$refs.tree.remove(this.rightClickNode)
            }
        }).catch(err => {
            console.log(err)
        })        
    }
}
}
</script>

<style lang='less' scoped="scoped">
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    color: #ffffff;
    .tree-section {
        width: 25%;
        height: 100%;
        // background-color: #1A2648;
        background: transparent;
        border: 1px solid #BAD0F11A;
        color: #06F7FF;
        overflow-y: auto;
        ::v-deep .el-tree-node__content:hover {
            background-color: rgba(14, 61, 138, 0.3) !important;
        }
        ::v-deep .el-tree-node.is-current > .el-tree-node__content {
            background-color: rgba(14, 61, 138, 0.3) !important;
        }
    }
    .tree-content {
        width: 75%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .tree-content-ul {
            width: 100%;
            background-color: rgba(25, 33, 61, 0.4);
            overflow-y: auto;
            li {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                border-bottom: 1px solid #BAD0F11A;
                padding: 5px;
                .file-info {
                    flex: 1 1 100px;
                }
            }
        }
        .empty-box {
            flex: 1;
        }
    }
}
.contextmenu {
    margin: 0;
    border-radius: 6px;
    border: 0.5px solid rgba(6, 247, 255, 0.20);
    background: #0E3D8A;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    font-size: 12px;
    font-weight: 400;
    color: #06F7FF;
    // box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.10), 0px 8px 10px 1px rgba(0, 0, 0, 0.06), 0px 3px 14px 2px rgba(0, 0, 0, 0.05);
    li {
        margin: 0;
        padding: 7px 30px;
        cursor: pointer;
        &:hover {
        border-radius: 3px;
        background: rgba(6, 247, 255, 0.10);
        }
    }
    .file-input {
        display: none;
    }
    }

.treeMenu {
    position: fixed;
    z-index: 99999;
    top: 50%;
    left: 50%;
    color: #06F7FF;
    background-color: #0E3D8A;
    overflow: hidden;
    border-radius: 5px;
    border: 0.5px solid rgba(6, 247, 255, 0.20);
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.10), 0px 8px 10px 1px rgba(0, 0, 0, 0.06), 0px 3px 14px 2px rgba(0, 0, 0, 0.05);
    div{
    padding: 7px 30px;
    box-sizing: border-box;
    //width: 50px;
    text-align: center;
    }
    div:hover{
    border-radius: 3px;
    background: rgba(6, 247, 255, 0.10);
    cursor: pointer;
    }
}
</style>
