<template>
  <div class="hot-scale-container">
    <ul class="square-wrapper">
      <li
        v-for="(item, index) in squareArr"
        :key="index"
        :class="getCurClass(index)"
        class="square float-left"
      />
    </ul>
  </div>
</template>

<script type="es6">

  export default {
    name: 'HotScale',
    props: {
      hotScale: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        squareArr: [1, 2, 3, 4, 5]
      }
    },
    computed: {
    },
    watch: {
    },
    mounted () {
    },
    methods: {
      getCurClass (index) {
        if (index + 1 > this.hotScale) {
          return ''
        } else {
          return 'square' + index
        }
      }
    }
  }
</script>
