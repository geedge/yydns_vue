<template>
  <div class="topology-map">
    <!-- <img class="img-topology" src="../../../img/background/topology.svg"> -->
    <div class="img-topology"></div>
  </div>
</template>

<script>
export default {
  name: 'TopologyMap',
}
</script>

<style  lang='less' scoped>
  .topology-map {
    width: 49%;
    height: 100%;
    background-image:url('../../../img/backgroundFourCorner.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .img-topology {
    width: 100%;
    height: 100%;
    background-image:url('../../../img/background/topology.svg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>