<template>
  <div class="el-pro-date-interval-temp">
    <gs-date-picker
      v-model="startDate"
      :disabled-date="startDateOptions.disabledDate"
      type="date"
      placeholder="开始日期"
    />

    <span>{{ split }}</span>

    <gs-date-picker
      v-model="endDate"
      :disabled-date="endDateOptions.disabledDate"
      type="date"
      placeholder="截止日期"
    />
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      },
      separator: {
        type: String,
        required: false,
        default: '~'
      }
    },
    data () {
      return {
        startDate: null,
        endDate: null,
        split: ''
      }
    },
    computed: {
      startDateOptions () {
        var me = this
        return {
          disabledDate (time) {
            if (time) {
              if (me.endDate) {
                return new Date(time).getTime() > Date.now() || new Date(time).getTime() > (new Date(me.endDate).getTime())
              } else {
                return new Date(time).getTime() > Date.now()
              }
            } else {
              return false
            }
          }
        }
      },
      endDateOptions () {
        var me = this
        return {
          disabledDate (time) {
            if (time) {
              if (me.startDate) {
                return new Date(time).getTime() > Date.now() || new Date(time).getTime() < (new Date(me.startDate).getTime())
              } else {
                return new Date(time).getTime() > Date.now()
              }
            } else {
              return false
            }
          }
        }
      }
    },
    watch: {
      startDate () {
        var me = this

        if (me.startDate) {
          me.$emit('update:start', moment(me.startDate).format('YYYY-MM-DD'))
        } else {
          me.$emit('update:start', '')
        }
      },
      endDate () {
        var me = this

        if (me.endDate) {
          me.$emit('update:end', moment(me.endDate).format('YYYY-MM-DD'))
        } else {
          me.$emit('update:end', '')
        }
      }
    },
    mounted () {
      var me = this

      if (me.start) {
        me.startDate = new Date(me.start)
      }

      if (me.end) {
        me.endDate = new Date(me.end)
      }

      me.split = me.separator || '~'
    }
  }
</script>
<style lang="scss" scoped>
.el-pro-date-interval-temp {
  display: inline-block;
  background: transparent;
  border: 0;
  border-radius: 0;

  .gs-picker-input-wrapper {

    .gs-picker-input {
      min-width: 168px;
      border: 0;
    }
  }

  &>span {
    vertical-align: initial !important;
  }

}

</style>
