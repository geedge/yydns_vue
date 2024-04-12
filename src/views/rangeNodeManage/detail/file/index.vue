<template>
<div class="range-config-manage" ref="appRef">
    <Header
        :down-loading="downLoading"
        :start-loading="startLoading"
        :stop-loading="stopLoading"
        @download="download"
        @start="start"
        @end="end"
    ></Header>
    <div class="list" >
        <el-table
            class="custom-table"
            ref="multipleTable"
            v-loading="loading"
            height="100%"
            style="width: 100%;"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                align="center"
                type="selection"
                width="80"/>
            <el-table-column 
                align="center"
                prop="bucket_name"
                label="桶名称"
                min-width="100"/>
            <el-table-column 
                align="center"
                prop="file_name"
                label="文件名"
                min-width="250"/>
            <el-table-column
                align="center"
                prop="size"
                label="文件大小"
                min-width="80"/>
            <el-table-column
                align="center"
                prop="last_modified"
                label="更新时间"
                min-width="100"
            >
            <template slot-scope="scope">
                {{ scope.row.last_modified | formatTime }}
            </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- <el-pagination
        background
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    >
    </el-pagination> -->
</div>
</template>
<script>
import Header from './module/Header.vue'
import { getTargetsResponse } from './mock.js'
export default {
    name: "File",
    components:{ Header},
    data(){
        return{
            target_id: '',
            nodeId: '',
            tableData: [],
            selectFileNameList: [],
            selectTableData: [],
            loading: false,
            downLoading: false,
            startLoading: false,
            stopLoading: false
        }
    },
    mounted() {

    },
    watch: {
        '$store.state.range.nodeId': {
            handler(newVal, oldVal) {
                this.nodeId = newVal
                this.init()
            },
            immediate: true
        },
        '$store.state.node.startTraffic': {
            handler(newVal, oldVal) {
                this.startLoading = newVal
            },
            immediate: true
        },
        '$store.state.node.endTraffic': {
            handler(newVal, oldVal) {
                this.stopLoading = newVal
            },
            immediate: true
        } 
    },
    created() {
    },
    methods:{
        init() {
            // this.tableData = getTargetsResponse?.result
            const reqParams = { node_id: this.nodeId }
            this.loading = true
            this.$axios.get(this.$http.api.getNodeFile, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.tableData = res?.result
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        // 当选择其它角色时，弹窗填写角色窗
        openRoleForm() {
            this.$refs.roleForm.visible = true
        },
        // 下载
        download() {
            if (this.selectFileNameList.length <= 0) {
                this.$notify({
                    title: '请勾选要下载的文件',
                    type: 'warning',
                    duration: 2500
                })
                return
            }
            const reqParams = {
                node_id: this.nodeId,
                object_file_name_list: JSON.stringify(this.selectFileNameList)
            }
            this.downLoading = true
            this.$axios.getFile(this.$http.api.downloadNodeFile, reqParams).then(res => {
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
                this.downLoading = false
            })
        },
        // 开始
        start() {
            const reqParams = {
                node_id: this.nodeId,
                command: 'start'
            }
            // this.startLoading = true
            this.$store.commit('node/setStartTraffic', true)
            this.$axios.get(this.$http.api.flowStartStop, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$notify({
                        title: '开始统计流量',
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
                this.$store.commit('node/setStartTraffic', false)
            }).finally(() => {
                // this.startLoading = false
            })
        },
        // 结束
        end() {
            const reqParams = {
                node_id: this.nodeId,
                command: 'stop'
            }
            // this.stopLoading = true
            this.$store.commit('node/setEndTraffic', true)
            this.$axios.get(this.$http.api.flowStartStop, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$store.commit('node/setStartTraffic', false)
                    this.$notify({
                        title: '结束统计流量',
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setTimeout(() => {
                    // this.stopLoading = false
                    this.$store.commit('node/setEndTraffic', false)
                    this.init()
                }, 5 * 1000);
            }) 
        },
        // 处理选中的数据
        handleSelectionChange(selectData) {
        this.selectTableData = selectData
        this.selectFileNameList = selectData.map(item => {
            return item.file_name
        })
        },
        // // 修改每页数据条数
        // handleSizeChange(val) {
        //     console.log(`每页 ${val} 条`)
        //     this.page=1
        //     this.size=val
        //     this.query()
        // },
        // // 修改页数
        // handleCurrentChange(val) {
        //     console.log(`当前页: ${val}`)
        //     this.page=val
        //     this.query()
        // }
    }
}

</script>

<style lang='less' scoped="scoped">
.el-pagination {
    padding: 15px 55px 0 0 !important;
}
.custom-table {
    width: 100%;
    height: 100%;
}
.range-config-manage{
    width: 100%;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
        .list{
            width: 100%;
            height: 87%;
            background-color: rgba(25, 33, 61, 0.4);
            border: 1px solid rgba(186, 208, 241, 0.1);
            border-radius: 8px;
            // margin-left: 2.5%;
            // overflow-y: auto;
            // overflow-y: scroll;
            // overflow-x: hidden;
            // border: none;
        }
        .list::-webkit-scrollbar {
            width: 0px;  /* 隐藏滚动条 */
            height: 0px;
            background-color: transparent; /* 让背景透明 */

        }
        /* 隐藏火狐浏览器滚动条 */
        @-moz-document url-prefix() {
            .trackSource {
                scrollbar-width: none;
            }
        }
        // 遮罩层
        .mask{
            position: fixed; /*将元素设置为固定定位*/
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5); /*通过rgba函数来控制遮罩层的透明度*/
            display: none; /*将元素隐藏*/
        }
    }
</style>