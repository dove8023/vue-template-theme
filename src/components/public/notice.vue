<template>
  <div class="notice">
    <gs-modal
      v-model="propConfig.visible"
      :title="propConfig.title"
      :show-footer="false"
      :width="propConfig.width || 420"
      class="notice"
    >
      <template>
        <div
          v-if="propConfig.selectObj"
        >
          <div
            v-for="(item, index) in getKeys(propConfig.selectObj)"
            :key="index"
            class="tag-select"
          >
            <span class="attr-label">{{ item }}</span>
            <gs-select
              v-model="propData[propData[item]]"
              class="relation-select"
              @change="change"
            >
              <gs-option
                v-for="(selectItem, selectIndex) in propConfig.selectObj[item]"
                :key="selectIndex"
                :label="selectItem.label || selectItem"
                :value="selectItem.nodeId || selectItem"
              />
            </gs-select>
          </div>
        </div>
        <p
          v-else
          class="text"
        >{{ propConfig.notice }}</p>
      </template>
      <div class="footer">
        <gs-button
          type="text"
          @click="cancel"
        >取消
        </gs-button>
        <gs-button
          :disabled="disableConfirm"
          type="text"
          @click="ok"
        >{{ propConfig.buttonName }}
        </gs-button>
      </div>
    </gs-modal>
  </div>
</template>

<script type="es6">

  export default {
    props: {
      propConfig: {
        type: Object,
        default: function () {
          return {}
        }
      },
      propData: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    computed: {
      disableConfirm () {
        if (this.propData.selectedType === '' ||
          this.propData.selectedRelation === '' ||
          this.propData.selectedAttr === '') {
          return true
        }
        return false
      }
    },
    mounted () {
    },
    methods: {
      getKeys (obj) {
        return Object.keys(obj)
      },
      change (val) {
        if (this.propConfig.selectObj['关系标签']) {
          var index = this.propConfig.selectObj['连接实体'].findIndex(item => {
            return item.nodeId === val
          })
          if (index > -1) {
            const tagLabel = this.propConfig.selectObj['连接实体'][index].label
            this.propConfig.selectObj['关系标签'] = this.propConfig.allRelation[tagLabel]
          }
        }
      },
      cancel () {
        this.$emit('cancel')
      },
      ok () {
        let options = {
          type: this.propConfig.type,
          data: this.propData
        }
        this.$emit('ok', options)
      }
    }
  }
</script>

