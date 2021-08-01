<template>
  <h1 class="aa" @click="hello">AAAAAAAAA</h1>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Abb extends Vue {
  hello(){
    alert("hello");
  }
} 
</script>

<style scoped lang="scss">
.aa{
    color: $primary-color;
}
</style>