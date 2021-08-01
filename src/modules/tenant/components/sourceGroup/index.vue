<template>
  <div class="resource-group-wrap">
    <div
      v-loading="{ loading: isLoading }"
      class="content-warp"
    >
      <div class="header-wrap">
        <div class="left-wrap">
          <h3>所有资源组</h3>
          <span>长按拖动可进行排序</span>
        </div>
        <div class="right-wrap">
          <gs-button
            type="text-primary"
            @click="addRootGroup"
          >
            新建一级资源组
          </gs-button>
        </div>
      </div>

      <gs-trees
        v-if="showTree"
        :allow-drop="allowDrop"
        :render-content="renderMethod"
        :data="resourceGroupdata"
        draggable
        @node-drag-end="dragTree"
      />

      <div
        v-if="!showTree"
        class="empty-content-warp"
      >
        <img src="@/assets/images/icons/empty-icon.png">
        <span>还没有任何资源组</span>
      </div>
    </div>

    <resourceGroup
      ref="groupDialog"
      :is-show="opDialogVisible.resGroup"
      :active-item="activeItem"
      :action-type="actionType"
      :new-sort="resourceGroupdata.length + 1"
      @closeDialog="opDialog"
      @addGroup="addGroup"
      @editGroup="editGroup"
    />

    <deleteResourceGroup
      ref="deleteDialog"
      :is-show="opDialogVisible.delete"
      :item="activeItem"
      @closeDialog="opDialog"
      @deleteGroup="deleteGroup"
    />
  </div>
</template>

<script lang='ts'>
import resourceGroup from "./components/resourceGroup.vue"
import deleteResourceGroup from "./components/deleteResourceGroup.vue"

import { quoteAttentionConfig } from "./static/config"

import ResourceGroupService from "@/service/resourceGroupService" // 资源组 操作

import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
@Component({
  components:{
    resourceGroup,
    deleteResourceGroup
  }
})
export default class SourceGroupIndex extends Vue {
  @Prop({default:''}) readonly tenantCode!: string
 
  activeItem: any = {}
  editNode: any = {} // 编辑的节点信息
  addData: any = {} // 编辑的节点信息
  deleteNode: any = {} // 删除的节点信息
  opDialogVisible: any = {
    resGroup: false,
    delete: false,
    quote: false,
    attention: false
  }
  resourceGroupdata: Array<any> = []
  actionType: string = ""
  isLoading: boolean = false
  get showTree() {
    return this.resourceGroupdata.length > 0
  }
  get config() {
    return quoteAttentionConfig
  }
  @Ref('groupDialog') readonly refGroupDialog: any
  @Ref('deleteDialog') readonly refDeleteDialog: any
  mounted() {
    this.getGroupList()
  }
  opDialog(row: any) {
    this.opDialogVisible[row.type] = row.value
  }
  showDialog(node: any, type: any) {
    this.activeItem = node
    this.opDialogVisible[type] = true
  } // 资源组树操作的统一打开弹窗
  allowDrop(draggingNode: any, dropNode: any, type: any) {
    if (draggingNode.$node.level === dropNode.$node.level) {
      return type === "prev" || type === "next" // 向上拖拽 || 向下拖拽
    } else {
      return false // 不同级进行处理
    }
  } // 对拖拽进行限制
  renderMethod(h: any, { node, data }) {
    return h(`<span
        class="is-ellipsis"
        style="padding: 4px 0; display: flex; align-items: center;"
      >
        <span style="margin-right:20px;">{${data.name}}</span>
        <div class="btn-group">
          <gs-button
            type="text-primary"
            on-click={ev => this.append(ev, { ${node}, ${data} })}
          >
            添加子资源组
          </gs-button>
          <gs-button
            type="text-primary"
            on-click={ev => this.edit(ev, { ${node}, ${data} })}
          >
            编辑
          </gs-button>
          <gs-button
            type="text-primary"
            on-click={ev => this.delete(ev, { ${node}, ${data} })}
          >
            删除
          </gs-button>
        </div>
      </span>`
    )
  }
  // 新增树节点
  append(ev: any, { node, data }) {
    ev.stopPropagation()
    this.addData = data
    this.actionType = "addChild" // 判断当前操作的状态标识
    if (node.$node.level > 5) {
      this.$Message.warning({
        duration: 2,
        content: "最多支持6层，无法新建"
      }, 2)
    } else {
      this.showDialog(JSON.parse(JSON.stringify(node)), "resGroup") //新增资源对话框
    }
  }
  // 编辑树节点
  edit(ev: any, { node }) {
    ev.stopPropagation()
    this.editNode = node
    if (node.$node.parent) {
      this.actionType = "editChild"
    } else {
      this.actionType = "editRoot" // 用操作来区别
    }
    this.showDialog(JSON.parse(JSON.stringify(node)), "resGroup")
  }
  // 删除树节点
  delete(ev: any, { node }) {
    ev.stopPropagation()
    this.deleteNode = node
    this.actionType = "delete" // 判断当前操作的状态标识
    this.showDialog(JSON.parse(JSON.stringify(node)), "delete") // 打开删除确认对话框
  }
  dragTree(node: any, last: any, position: any) {
    if (position) {
      let sort = last.data.sort
      if (node.data.sort < last.data.sort) {
        sort--
      } // 当节点是自下往上拖的时候 sort需要加1
      if (position === "after") {
        sort++
      } // 当节点位于某节点后面时 sort需要加1
      let params = {
        id: "",
        date: "",
        data: {
          id: node.data.id,
          'destiny_sort': sort
        }
      }
      this.updateTree(params)
    }
  } // 拖拽资源获取当前位置数据
  updateTree(...params: any) {
    ResourceGroupService.dragGroup(params).then((res: any) => {
      this.getGroupList()
      if (res.code !== 0) {
        this.$Message.error({
          duration: 2,
          content: res.message
        }, 2)
      }
    })
  } // 更新树的位置
  getGroupList() {
    this.isLoading = true
    ResourceGroupService.getGroupList(this.tenantCode).then((res: any) => {
      if (res.code === 0) {
        this.isLoading = false
        this.resourceGroupdata = res.data
      } else {
        this.$Message.error({
          duration: 2,
          content: res.message
        }, 2)
      }
    }).catch(error => {
      this.$Message.error({
        duration: 2,
        content: error.errorMessage
      }, 2)
      this.isLoading = false
    })
  }
  addRootGroup() {
    this.actionType = "addRoot"
    this.opDialog({ type: "resGroup", value: true })
  } // 打开新建一级资源组弹窗
  addGroup(data: any) {
    let params = {
      id: "",
      date: "",
      data: {
        ...data,
        'tenant_code': this.tenantCode
      }
    }
    ResourceGroupService.addGroup(params)
      .then((res: any) => {
        if (res.code === 0) {
          this.$Message.success({
            duration: 3,
            content: "新增成功"
          }, 2)
          this.getGroupList() // 重新加载资源组
          this.refGroupDialog.closeDialog() // 成功时关闭弹窗
        } else {
          this.$Message.error({
            duration: 2,
            content: res.error
          }, 2)
          this.refGroupDialog.isLoading = false //报错时清除弹窗loading效果
        }
      })
      .catch(error => {
        this.$Message.error({
          duration: 2,
          content: error.errorMessage
        }, 2)
        this.refGroupDialog.isLoading = false
      })
  } // 新增资源组
  editGroup(data: any) {
    let params = {
      id: "",
      date: "",
      data: {
        ...data,
        'tenant_code': this.tenantCode
      }
    }
    ResourceGroupService.editGroup(params)
      .then((res: any) => {
        if (res.code === 0) {
          this.$Message.success({
            duration: 3,
            content: "修改成功"
          }, 2)
          this.getGroupList() // 重新加载资源组
          this.refGroupDialog.closeDialog() // 成功时关闭弹窗
        } else {
          this.$Message.error({
            duration: 2,
            content: res.error
          }, 2)
          this.refGroupDialog.isLoading = false  // 报错时清除弹窗loading效果
        }
      })
      .catch(error => {
        this.$Message.error({
          duration: 2,
          content: error.errorMessage
        }, 2)
        this.refGroupDialog.isLoading = false
      })
  } // 编辑资源组
  deleteGroup(id: any) {
    ResourceGroupService.deleteGroup(id)
      .then((res: any) => {
        if (res.code === 0) {
          this.$Message.success({
            duration: 3,
            content: "删除成功"
          }, 2)
          this.getGroupList() // 重新加载资源组
          this.refDeleteDialog.closeDialog() // 成功时关闭弹窗
        } else {
          this.$Message.error({
            duration: 2,
            content: res.error
          }, 2)
          this.refDeleteDialog.isLoading = false //报错时清除弹窗loading效果
        }
      })
      .catch(error => {
        this.$Message.error({
          duration: 2,
          content: error.errorMessage
        }, 2)
        this.refDeleteDialog.isLoading = false
      })
  } // 删除资源组
}
</script>

<style lang="scss">
.resource-group-wrap {
  position: relative;
  height: calc(100% - 20px);
  min-width: 488px;
  margin-top: 10px;
  border-radius: 5px;

  .content-warp {
    height: calc(100% - 48px);
    width: 500px;
    padding: 0 24px 24px 24px;
    margin-top: -30px;
    overflow-y: auto;
    background-color: #fff;

    .header-wrap {
      display: flex;
      height: 80px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eceff1;
      margin-bottom: 15px;

      .left-wrap {
        h3 {
          font-weight: bold;
          color: #666;
          font-size: 16px;
        }

        span {
          font-size: 12px;
          color: #c5c5c5;
        }
      }

      .right-wrap {
        display: flex;

        .gs-button {
          font-size: 14px;
        }

        .other-action {
          cursor: pointer;
        }
      }
    }

    .env-select {
      position: absolute;
      width: 200px;
      right: 16px;
      top: 8px;

      .gs-select-wrap {
        border: 0;
        text-align: right;

        &:hover {
          box-shadow: 0 0 0 0 #fff;
        }

        &:focus {
          box-shadow: 0 0 0 0 #fff;
        }
      }
    }

    .content-table {
      margin-top: 16px;
    }

    .gs-virtual-list {
      height: auto;

      .gs-virtual-list-content {
        .is-ellipsis {
          .btn-group {
            display: none;
          }

          &:hover {
            .btn-group {
              display: block;
            }
          }
        }
      }
    }

    .empty-content-warp {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc(100% - 105px);
    }

    .gs-button-text-primary {
      color: #4877fa;
    }
  }
}

.other-action-menu {
  &.gs-popover {
    &.gs-popover-supernatant {
      padding: 8px 0;
    }
  }

  // span {
  //   display: block;
  //   cursor: pointer;
  //   width: 100%;
  //   padding: 10px 15px;
  //   color: #4877fa;
  //   &:hover {
  //     background-color: #edf0fa;
  //   }
  // }
}
</style>
