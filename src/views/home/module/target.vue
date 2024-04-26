<template>
    <div class="box" v-loading="loading">
        <div class="card">
            <div class="title">已部署代理</div>
            <div>
                <span class="info-span">{{ agent_num }}</span>
                <span class="unit-span">台</span>
            </div>
        </div>
        <div class="card">
            <div class="title">已执行任务</div>
            <div>
                <span class="info-span">{{ task_num }}</span>
                <span class="unit-span">次</span>
            </div>
        </div>
        <div class="card">
            <div class="title">已运行时间</div>
            <div>
                <span class="info-span">{{ workday }}</span>
                <span class="unit-span">天</span>
            </div>
        </div>
<!--        <div class="card">-->
<!--            <div class="title">未部署</div>-->
<!--            <div>-->
<!--                <span class="info-span">{{ targetData.no_deploy_count }}</span>-->
<!--                <span class="unit-span">个</span>-->
<!--            </div>           -->
<!--        </div>-->
    </div>
</template>

<script>
import { Loading } from 'element-ui'
import { getTargetsResponse } from './targetMock.js'
export default {
    name: 'TargetView',
    data() {
        return {
            loading: false,
            targetData: {},
            //num
            agent_num:0,
            task_num:0,
            workday:0,
        }
    },
    created() {
        this.init()
    },
    mounted() {
        // this.init()
    },
    methods: {
        init () {
            // this.targetData = getTargetsResponse?.result
            
            this.loading = true
            this.$axios.get(this.$http.api.sysNum).then(res => {
                if (res.code == 200) {
                    this.agent_num=res?.agent_num
                    this.task_num=res?.task_num
                    this.workday=res?.workday
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
.box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .card {
        flex: 1;
        .title {
            color: #FFF;
            font-family: PingFang HK;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin-bottom: 10px;
        }
        .info-span {
            color: #03F4FA;
            font-family: PingFang HK;
            font-size: 32px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            padding: 5px;
        }
        .unit-span {
            color: #FFF;
            opacity: 0.7;
            font-family: PingFang HK;
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
    }
}
.box .card:not(:last-child) {
    border-right: 1px solid rgba(216, 216, 216, 0.2);
}
</style>