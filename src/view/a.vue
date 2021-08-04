<template>
  <div>
    <h1 class="aa" @click="hello">AAAAAAAAABBBBBB</h1>
    <p>{{ok}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// @Component

export default class Good extends Vue{
  public ok = "ok man. Good here.";
  public hello(){
    alert("hello");
  }
};
</script>

<style scoped lang="scss">
.aa{
    color: $primary-color;
}
</style>