<script setup>

</script>

<template>
    <div class="scroll-wrap">
        <img class="left" src="../assets/scrollLeft.png" alt="">
        <img class="right" src="../assets/scrollRight.png" alt="">
    </div>
</template>

<style scoped lang="scss">
.scroll-wrap{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25px;
  background: url('../assets/scroll.png') 0 0 repeat-x;
  &.active{
    left: 11px;
    width: calc(100% - 22px);
  }
  .left{
    position: absolute;
    left: -11px;
    top: 0;
  }
  .right{
    position: absolute;
    right: -11px;
    top: 0;
  }
}
</style>