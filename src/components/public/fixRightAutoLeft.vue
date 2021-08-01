<template>
  <div class="fix-right-auto-left-container">
    <div
      :style="rightStyle"
      :class="{ 'no-data': !hasData }"
      class="fix-right"
    >
      <slot name="right" />
    </div>
    <div
      :style="leftStyle"
      class="auto-left"
    >
      <slot name="left" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FixRightAutoLeft',
    props: {
      width: {
        type: Number,
        required: true
      },
      hasData: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        leftStyle: {
          'margin-right': 0
        },
        rightStyle: {
          width: 0,
          float: 'right'
        }
      }
    },
    watch: {
      width: function () {
        var me = this

        me.initLayout()
      }
    },
    mounted () {
      var me = this

      me.initLayout()
    },
    methods: {
      initLayout () {
        var me = this
        me.leftStyle['margin-right'] = parseInt(me.width) + 'px'

        me.rightStyle.width = parseInt(me.width) + 'px'
      }
    }
  }
</script>
<style scoped>
.fix-right-auto-left-container {
  overflow: hidden;
}
</style>
