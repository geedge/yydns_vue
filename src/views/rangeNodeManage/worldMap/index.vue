<template>
    <div :class="['world-map', {'is--maximize': isFullscreen}]">
      <Map ref="worldMap"></Map>
      <span class="icon-span" slot="label">
        <svg-icon class="icon-zoom" :icon-class="fullscreenIcon" @click="zoomEvent"></svg-icon>
      </span>
    </div>
  </template>
  
  <script>
  import Map from './Map'
  export default {
    name: 'WorldMap',
    components: { Map },
    data() {
      return {
        isFullscreen: false,
        fullscreenIcon: 'fullscreen'
      }
    },
    methods: {
      zoomEvent() {
        this.isFullscreen = !this.isFullscreen
        this.fullscreenIcon = this.isFullscreen ? 'narrow' : 'fullscreen'
        this.$nextTick(() => {
          this.$refs.worldMap.worldChart.resize()
        })
      },
    }
  
  }
  </script>
  
  <style  lang='less' scoped>
  .world-map {
    position: relative;
    width: 49%;
    height: 100%;
    background-image:url('../../../img/backgroundFourCorner.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .icon-span {
        position: absolute;
        top: 10px;
        right: -10px;
        padding: 12px 20px;
        .icon-zoom {
            font-size: 30px;
            color: #02DDEA;
            margin: 0 15px;
        }
    }
  }
  .is--maximize {
    position: fixed;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    padding: 0.5em 1em;
    // background-color: #17234e;
    background: url(../../../img/background/bgMain.svg);
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-position: center; /* 居中显示 */
    background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */
    z-index: 1000;
  }
  </style>