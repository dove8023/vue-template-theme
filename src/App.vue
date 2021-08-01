<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
    mounted(){
        console.log("mounted");
    }
});
</script>
<style lang="scss" scoped>
#app {
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
}

#nav a {
  color: #2c3e50;
  font-weight: bold;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
