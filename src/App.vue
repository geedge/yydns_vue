<template>
    <div id="app">
      	<router-view/>
    </div>
</template>

<script>
</script>

<style lang="less">
#app{
    width: 100%;
    height: 100%;
    color: #fff;
    background: radial-gradient(circle, #10215C 0%, #070F29 100%);
}

.el-select-dropdown{
    background-color: #ffffff;
    .el-scrollbar{
        background-color: #ffffff;
        ::v-deep .el-select-group__wrap{
            border-color: #ffffff;
        }
    }
}
.el-image-viewer__img{
    width: 70%;
    height: auto;
    backdrop-filter: brightness(40px);

}
.el-image-viewer__wrapper{
    /*margin-top: 300px;*/
    .el-image-viewer__close{
        margin-top: 15%;
        margin-right: 7%;

        /*background-color: #00F1FF;*/
        i{
            color: #00F1FF;
        }
    }
    .el-image-viewer__prev{
        margin-left: 13%;
        i{
            color: #00F1FF;
        }
    }
    .el-image-viewer__next{
        margin-right: 13%;
        i{
            color: #00F1FF;
        }
    }
}

.el-image-viewer__canvas{
    /*margin-top: 2%;*/
    /*margin-top: 10%;*/
    /*margin-left: 15%;*/
    backdrop-filter: blur(20px);
    /*width: 70%;*/
    /*height: auto;*/
}
</style>
