<template>
  <span class="word-limit">
    <span :class="showWarn ? 'warning' : ''">{{ calcStrLen(val) }}</span>
    /
    {{ max }}
  </span>
</template>
<script>
export default {
  props: {
    max: {
      type: Number,
      default: 16,
    },
    val: {
      required: true,
    },
  },
  computed: {
    showWarn() {
      const len = this.calcStrLen(this.val)
      if (len > this.max) {
        return true
      }
      return false
    },
  },
  watch: {},
  methods: {
    calcStrLen(str) {
      str = !str ? '' : str.toString().trim()
      let len = 0
      for (let i = 0; i < str.length; i++) {
        len++
      }
      return Math.ceil(len)
    },
  },
}
</script>
<style lang="scss" scoped>
.word-limit {
  font-weight: 100;
  color: #ccc;
  padding-left: 10px;
  float: right;
}

.warning {
  color: red;
}
</style>
