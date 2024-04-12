<template>
    <div :class="['range-config-manage', {'is--maximize': isFullscreen}]" ref="appRef">
        <Header
            :is-fullscreen="isFullscreen"
            :fullscreen-icon="fullscreenIcon"
            :down-loading="downLoading"
            :close-icon="closeIcon"
            @query="query"
            @download="download"
            @zoomEvent="zoomEvent"
        ></Header>
        <div class="list">
            <el-table
                class="custom-table"
                ref="multipleTable"
                v-loading="loading"
                height="100%"
                style="width: 100%;"
                :data="tableData"
                tooltip-effect="dark"
                highlight-current-row
            >
                <el-table-column
                    align="center"
                    prop="id"
                    label="id"
                    min-width="50"/>
                <el-table-column 
                    align="left"
                    prop="content"
                    label="日志内容"
                    min-width="500"
                    show-overflow-tooltip/>
            </el-table>
        </div>
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
            fullscreenIcon: 'fullscreen',
            isFullscreen: false,
            target_id: '',
            nodeId: '',
            downLoading: false,
            tableData: [],
            inverterMonTimer: null,
            loading: false,
            closeIcon: false
        }
    },
    mounted() {
        this.closeIcon = this.$route.params.closeIcon
    },
    watch: {
        '$store.state.range.nodeId': {
            handler(newVal, oldVal) {
                this.nodeId = newVal
                this.init()
            },
            immediate: true
        } 
    },
    created() {
        this.inverterMonTimer = setInterval(() => {
            this.init()
        }, 5 * 1000)
    },
    beforeDestroy() {
        if (this.inverterMonTimer) {
        clearInterval(this.inverterMonTimer);
        this.inverterMonTimer = null;
        }
    },

    methods:{
        zoomEvent() {
            this.isFullscreen = !this.isFullscreen
            this.fullscreenIcon = this.isFullscreen ? 'narrow' : 'fullscreen'
        },
        init(params={}) {
            // const responseData = getTargetsResponse?.result
            // this.tableData = responseData.map((item, index) => {
            //   return {
            //     id: index,
            //     content: item
            //   }
            // })
            // TODO: 暂时注释接口
            const reqParams = {
                node_id: this.nodeId,
                ...params
            }
            this.loading = true
            this.$axios.get(this.$http.api.getLog, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                  const responseData = res?.result
                  this.tableData = responseData.map((item, index) => {
                    return {
                      id: index,
                      content: item
                    }
                  })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        query(params) {
            // 清除日志轮询器
            if (this.inverterMonTimer) {
                clearInterval(this.inverterMonTimer);
                this.inverterMonTimer = null;
            }
            // 立即查询一次
            this.init(params)
            // 开启新的日志轮询器
            this.inverterMonTimer = setInterval(() => {
                this.init(params)
            }, 5 * 1000)
        },
        // 下载
        download() {
          this.downLoading = true
          const reqParams = { node_id: this.nodeId }
          this.$axios.getFile(this.$http.api.downloadLog, reqParams).then(res => {
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
                        title: '下载日志成功',
                        type: 'success',
                        duration: 2500
                    })
                } else {
                    this.$notify({
                        title: '下载日志失败',
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
.is--maximize {
    position: fixed;
    top: 9%;
    left: 10%;
    width: 90% !important;
    height: 91% !important;
    padding: 0.5em 1em;
    // background-color: #17234e;
    background: url(../../../../img/background/bgMain.svg);
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-position: center; /* 居中显示 */
    background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */
    z-index: 1000;
}
.el-pagination {
    padding: 15px 55px 0 0 !important;
}
.custom-table {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    background-color: transparent !important;
}
.range-config-manage{
    width: 100%;
    height: 100%;
        .list{
            width: 100%;
            height: calc(100% - 85px);
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