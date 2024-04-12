<template>
<el-table
    class="main-table styleTable"
    ref="operateTable"
    height="500px"
    style="width: 100%;"
    :data="nodeList"
    tooltip-effect="dark"
    highlight-current-row
    @selection-change="handleSelectionOperateNode"
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
        {{ scope.row.create_time | formatTime }}
    </template>
    </el-table-column>
        <el-table-column
        align="center"
        prop="complete_time"
        label="创建完成时间"
        min-width="100"
    >
    <template slot-scope="scope">
        {{ scope.row.complete_time | formatTime }}
    </template>
    </el-table-column>
</el-table>  
</template>

<script>
export default {
    name: 'OperateNode',
    props: {
        nodeList: {
            typeof: Array,
            require: true
        }
    },
    data() {
        return {

        }
    },
    methods: {
        // 选择被操作节点
        handleSelectionOperateNode(selectRows) {
            this.$emit('selectOperateNode', selectRows)
        },
    }
}
</script>

<style lang="less" scoped>

</style>