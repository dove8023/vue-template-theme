<template>
  <div class="test">
    hello world
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components: {
    HelloWorld,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.test {
  color: $primary-color;
  font-size: 30px;
}
</style>
