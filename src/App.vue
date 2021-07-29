<template>
  <div>
    <h1 class="test">
      hello world
      <br>
      <router-link to="/a">AA</router-link>
      <router-link to="/b">BB</router-link>
      <router-link to="/hello">Hello</router-link>
    </h1>
    
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {
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
