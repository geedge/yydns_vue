<template>
	<div class="home" ref="appRef">
        <div class="show">
            <div class="top">
                <div class="top-left">
                    <TargetView class="top-left-target"/>
                    <ImageView class="top-left-iamge"/>
                </div>
                <SourceView class="top-right"/>
            </div>
            <NodeView class="bottom"/>
        </div>
	</div>
</template>

<script>
import TargetView from './module/target.vue'
import ImageView from './module/image.vue'
import SourceView from './module/source.vue'
import NodeView from './module/node.vue'
export default {
    name: 'home',
    components: { TargetView, ImageView, SourceView, NodeView }
}
</script>
<style lang="less" scoped>
.home {
    width: 100%;
    height: 100%;
    position: relative; /* 确保相对定位生效 */
}
.show {
    height: 95%;
    width: 95%;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.top {
    height: 49%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .top-left {
        width: 49.5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top-left-target {
            height: 48%;
            background-image:url('../../img/background/homeTargetBg.svg');
            background-repeat: no-repeat;
            background-size: cover;
        }
        .top-left-iamge {
            height: 48%;
            background-image:url('../../img/background/homeTargetBg.svg');
            background-repeat: no-repeat;
            background-size: cover;
        }
    }
    .top-right {
        width: 49.5%;
        background-image:url('../../img/background/homeSourceBg.svg');
        background-repeat: no-repeat;
        background-size: cover;
    }
}
.bottom {
    height: 49%;
    background-image:url('../../img/background/homeNodeBg.svg');
    background-repeat: no-repeat;
    background-size: cover; 
}
</style>
