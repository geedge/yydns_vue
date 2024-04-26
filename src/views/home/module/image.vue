<template>
    <div>
        <span style="color: #dfe6ec;font-size: 20px;float: left;margin-left: 3%;margin-top: 2%">已探测目标</span>
        <div class="box" id="show-loading" v-loading="loading">
            <div class="card">
                <div class="title">IPv6</div>
                <div>
                    <span class="info-span">{{ target.v6dns }}</span>
                    <span class="unit-span">个</span>
                </div>
            </div>
            <div class="card">
                <div class="title">DNSSEC</div>
                <div>
                    <span class="info-span">{{ target.dnssec }}</span>
                    <span class="unit-span">个</span>
                </div>
            </div>
            <div class="card">
                <div class="title">DoT</div>
                <div>
                    <span class="info-span">{{ target.dot }}</span>
                    <span class="unit-span">个</span>
                </div>
            </div>
            <div class="card">
                <div class="title">DoH</div>
                <div>
                    <span class="info-span">{{ target.doh }}</span>
                    <span class="unit-span">个</span>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
import { Loading } from 'element-ui'
import { getTargetsResponse } from './imageMock.js'
export default {
    name: 'imageView',
    data() {
        return {
            loading: false,
            imageData: {},
            target:{
                dnssec:0,
                doh:0,
                dot:0,
                v6dns:0
            }
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
            // this.imageData = getTargetsResponse?.result
            this.loading = true
            this.$axios.get(this.$http.api.sysNum).then(res => {
                if (res.code == 200) {
                    this.target.dnssec=res?.target?.dnssec
                    this.target.doh=res?.target?.doh
                    this.target.dot=res?.target?.dot
                    this.target.v6dns=res?.target?.v6dns

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
    height: 80%;
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