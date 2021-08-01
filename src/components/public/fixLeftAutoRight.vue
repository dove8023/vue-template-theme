<template>
  <div class="fix-left-auto-right-container">
    <div
      :style="leftStyle"
      class="fix-left"
    >
      <slot name="left" />
    </div>
    <div
      :style="rightStyle"
      class="auto-right"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FixLeftAutoRight',
    props: {
      width: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        leftStyle: {
          width: 0,
          float: 'left'
        },
        rightStyle: {
          'margin-left': 0
        }
      }
    },
    watch: {
      width: function () {
        var me = this

        me.leftStyle.width = parseInt(me.width) + 'px'

        me.rightStyle['margin-left'] = parseInt(me.width) + 'px'
      }
    },
    mounted () {
      var me = this
      me.leftStyle.width = parseInt(me.width) + 'px'

      me.rightStyle['margin-left'] = parseInt(me.width) + 'px'
    }
  }
</script>
