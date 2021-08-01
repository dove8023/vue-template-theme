<template>
  <div class="graph-info node-form">
    <div class="graph-info-container">
      <div
        v-for="entity in searchComplexData.entities"
        :key="entity.id"
        class="graph-info-panel search-complex"
      >
        <div class="title-sub">
          <h3>查询条件：</h3>
          <!-- <div class="title-sub-btns">
						<span
							class="svg-icon-add"
							@click="addNewEntity(entity)"
						>
							<icon
								name="add"
								width="16"
								height="16"
							/>
						</span>
						<span
							v-if="searchComplexData.entities.length > 1"
							class="attrs-span custom-icon-close"
							@click="deleteEntity(entity)"
						>
							<icon
                name="cancel"
                width="16"
                height="16"
              />
						</span>
          </div>-->
          <div class="divid-line" />
        </div>

        <ul class="form-inline margin-bottom16">
          <li>
            <gs-select
              v-model="entity.label"
              searchable
              placeholder="实体类型"
              @change="bodyNodesChange"
            >
              <gs-option
                v-for="item in bodyAllNodes"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </gs-select>
            <span class="icon-svg">
              <icon name="create-edge" width="16" height="16" />
            </span>
            <gs-input v-model="entity.value" placeholder="实体名称" />
          </li>
        </ul>
        <ul class="form-inline">
          <li :key="attr.pid" v-for="attr in entity.attrs">
            <gs-select
              v-model="attr.pid"
              searchable
              placeholder="属性名称"
              @change="attrChange"
            >
              <gs-option
                v-for="item in entity.attrsOptions"
                :key="item.pid"
                :label="item.name"
                :value="item.pid"
              />
            </gs-select>
            <gs-select v-model="attr.operator" class="select-relation">
              <gs-option
                v-for="item in relationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </gs-select>
            <gs-input
              v-model="attr.value"
              placeholder="请填写数值"
              class="margin-right8"
            />
            <span
              v-if="attr.pid === entity.attrs[entity.attrs.length - 1].pid"
              class="svg-icon-add"
              @click="addNewAttr(entity)"
            >
              <icon name="add" width="16" height="16" />
            </span>
            <span
              v-if="entity.attrs.length > 1"
              class="attrs-span custom-icon-close"
              @click="deleteAttr(entity, attr)"
            >
              <icon name="cancel" width="16" height="16" />
            </span>
          </li>
        </ul>
      </div>

      <div class="graph-info-panel">
        <div class="title-sub">
          <h3>交汇图参数</h3>
          <div class="divid-line" />
        </div>

        <div class="parameter-row">
          <span>X轴：</span>
          <gs-select
            v-model="searchComplexData.x_name"
            placeholder="孔隙度"
            :disabled="x_options.length > 1 ? false : true"
          >
            <gs-option
              v-for="item in x_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </gs-select>
        </div>
        <div class="parameter-row">
          <span>Y轴：</span>
          <gs-select
            v-model="searchComplexData.y_name"
            placeholder="渗透率"
            :disabled="y_options.length > 1 ? false : true"
          >
            <gs-option
              v-for="item in y_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </gs-select>
        </div>
      </div>

      <div class="btns">
        <gs-button
          v-for="item in btns"
          :type="item.type"
          :key="item.name"
          @click="action(item)"
          >{{ item.name }}</gs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Config from "../config/config";
import KnowledgeManageService from "../../../service/knowledgeManageService";
import { deepCopy } from '@/utils/comUtils';

export default {
  props: {
    btns: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      formLayout: true,
      searchComplexData: {
        entities: [
          {
            id: "entity0",
            label: "",
            value: "",
            attrs: [
              {
                pid: "",
                name: "",
                type: "",
                operator: 0,
                value: ""
              }
            ],
            attrsOptions: [],
            entityOptions: []
          }
        ],
        x_name: [], // X轴参数
        y_name: [], // Y轴参数
        edges: []
      },
      searchConst: {
        floor: 2,
        limit: 100
      },
      nodeAttrs: [],
      relationOptions: Config.relationOptions,
      x_options: [],
      y_options: [], // xy轴参数选项
      bodyEdges: [],
      entityIndex: 0,
      number: 0,
      bodyAllNodes: [] // 实体类型节点
    };
  },

  created () {
    this.getExtraAttrs(); // 获取请求属性和参数的选项

    // this.getNodeAttrs()  //请求属性的下拉选项
    // this.getBodyEdges()  //请求参数的下拉选项
    this.getBodyNodesList(); // 获取实体类型列表下拉
  },

  mounted () { },
  methods: {
    action (item) {
      console.log("click");
      // 只有信息进行提交的时候 需要校验
      switch (item.action) {
        case "searchAnalysisData":
          let status = this.validate();
          if (!status) {
            this.$Message.error({
              duration: 2.5,
              content: "请选择实体类型"
            });
          } else {
            let data = this.handleData();
            this.excute(item, data);
          }
          break;

        default:
          this.excute(item);
      } // 根据按钮储存的方法命判断后续处理
    },

    validate () {
      // 业务要求： 实体类型是必选的
      let status = true;
      this.searchComplexData.entities.forEach(item => {
        if (item.label === undefined || item.label.length === 0) {
          status = false;
        }
      });
      return status;
    },

    handleData () {
      let newSearchComplexData = {
        entity: {
          floor: this.searchConst.floor,
          limit: this.searchConst.floor,
          searchs: {
            edges: this.searchComplexData.entities.edges,
            entities: []
          }
        },
        x_name: this.searchComplexData.x_name,
        y_name: this.searchComplexData.y_name
      };
      let searchData = deepCopy(this.searchComplexData.entities); // 深度拷贝搜索结果以进行请求参数的修饰操作
      searchData.forEach(item => {
        // 获取实体label 即本体的value
        item.label = this.getNodeValue(item.label);

        item.attrs.forEach(attr => {
          // 获取属性name
          let temp = item.attrsOptions.filter(option => {
            return option.pid === attr.pid;
          });
          if (temp.length !== 0) {
            attr.name = temp[0].name;
          }

          // 获取操作符名称
          let tempOperator = this.relationOptions.filter(option => {
            return option.value === attr.operator;
          });

          if (tempOperator.length !== 0) {
            attr.operator = tempOperator[0].label;
          } else {
            attr.operator = this.relationOptions[0].label; // 默认值
          }
        });
      });

      let tempEntities = searchData.map(entity => {
        return {
          label: entity.label,
          value: entity.value,
          attrs: entity.attrs
        };
      });

      newSearchComplexData.entity.searchs.entities = tempEntities;
      return newSearchComplexData;
    },
    excute (item, data) {
      this.$emit(item.action, data);
    },

    bodyNodesChange (id) {
      this.getNodeAttrsUnique(id);
      let tempLabel = this.getNodeValue(id);
      this.getEntityNodesList(id, tempLabel);
    },

    getNodeValue (id) {
      let tempLabel;
      this.bodyAllNodes.forEach(item => {
        if (item.id === id) {
          tempLabel = item.value;
        }
      });
      return tempLabel;
    },

    addNewAttr (entity) {
      this.searchComplexData.entities.forEach(item => {
        if (item.id === entity.id) {
          item.attrs.push({
            pid: "temp" + this.number++,
            name: "",
            type: "",
            operator: 0,
            value: ""
          });
        }
      });
    },

    addNewEntity () {
      this.searchComplexData.entities.push({
        id: "entity" + ++this.entityIndex,
        label: "",
        value: "",
        attrs: [
          {
            pid: "",
            name: "",
            type: "",
            operator: 0,
            value: ""
          }
        ],
        attrsOptions: [],
        entityOptions: []
      });
    },

    attrChange (pid) {
      this.searchComplexData.entities.forEach(item => {
        item.attrs.forEach(unit => {
          let temp = item.attrsOptions.filter(attr => {
            return attr.pid === unit.pid;
          });
          unit.type = temp[0].type !== undefined ? temp[0].type : ""; // 不选实体的时候 给出的属性列表 没有type属性
        });
      });
    },

    deleteAttr (entity, attr) {
      this.searchComplexData.entities.forEach(item => {
        if (item.id === entity.id) {
          item.attrs.splice(item.attrs.indexOf(attr), 1);
        }
      });
    },

    deleteEntity (entity) {
      let currentIndex;
      this.searchComplexData.entities.forEach((item, index) => {
        if (entity.id === item.id) {
          currentIndex = index;
        }
      });
      this.searchComplexData.entities.splice(currentIndex, 1);
    },

    getNodeAttrsUnique (id) {
      let This = this;
      let ids = [];
      ids.push(id);

      let param = {
        id: "",
        date: "1986-07-08",
        data: {
          schema: {
            nodeIds: ids
          }
        }
      };

      KnowledgeManageService.bodyManage
        .nodeAttrsUnique(param)
        .then(res => {
          if (res.code === 0) {
            This.searchComplexData.entities.forEach(unit => {
              if (unit.label === id) {
                let temp = res.data.schema.nodes.filter(node => {
                  return node.nodeId === id;
                });
                unit.attrsOptions = temp[0].attrs.map(item => {
                  return {
                    pid: item.pid,
                    name: item.name,
                    type: item.type,
                    unit: item.unit,
                    value: ""
                  };
                });
              }
            });
          } else {
            This.$Message.error({
              duration: 2.5,
              content: res.message
            });
          }
        })
        .catch(err => {
          This.$Message.error({
            duration: 2.5,
            content: err.message
          });
        });
    },
    getExtraAttrs () {
      let This = this;
      let param = {
        id: "",
        date: "1986-07-08",
        data: {}
      };

      KnowledgeManageService.bodyManage
        .nodeAttrs(param)
        .then(res => {
          if (res.code === 0) {
            this.handlePropertyOption(res.data); // 将所有结果加载为属性参数
            this.handlePrameterOption(res.data); // 将结果经过过滤加载为交汇图参数选项
          } else {
            This.$Message.error({
              duration: 2.5,
              content: res.message
            });
          }
        })
        .catch(err => {
          This.$Message.error({
            duration: 2.5,
            content: err.message
          });
        });
    }, // 一次获取属性参数

    handlePropertyOption (data) {
      let This = this;
      This.nodeAttrs = data.schema.node.attrs.map((item, index) => {
        return {
          pid: index,
          name: item
        };
      });
      This.handleAttrsOptions();
    }, // 处理属性选项
    handlePrameterOption (data) {
      let This = this;
      let xOptions = data.schema.node.attrs.filter(str => {
        return /\s*孔隙度\s*/.test(str);
      });
      let yOptions = data.schema.node.attrs.filter(str => {
        return /\s*渗透率\s*/.test(str);
      });
      This.x_options = xOptions.map(item => {
        return {
          value: item,
          label: item
        };
      });
      This.y_options = yOptions.map(item => {
        return {
          value: item,
          label: item
        };
      });

      if (xOptions.length < 2) {
        This.searchComplexData.x_name = xOptions[0];
      }
      if (yOptions.length < 2) {
        This.searchComplexData.y_name = yOptions[0];
      }
    }, //处理参数选项
    getNodeAttrs () {
      let This = this;
      let param = {
        id: "",
        date: "1986-07-08",
        data: {}
      };

      KnowledgeManageService.bodyManage
        .nodeAttrs(param)
        .then(res => {
          if (res.code === 0) {
            This.nodeAttrs = res.data.schema.node.attrs.map((item, index) => {
              return {
                pid: index,
                name: item
              };
            });

            This.handleAttrsOptions();
          } else {
            This.$Message.error({
              duration: 2.5,
              content: res.message
            });
          }
        })
        .catch(err => {
          This.$Message.error({
            duration: 2.5,
            content: err.message
          });
        });
    },

    getEntityNodesList (id, label) {
      let This = this;
      let param = {
        id: "",
        date: "1988-10-25",
        data: {
          schema: {
            label: label
          }
        }
      };

      KnowledgeManageService.entityManage
        .entityNodesList(param)
        .then(res => {
          if (res.code === 0) {
            This.searchComplexData.entities.forEach(item => {
              if (item.label === id) {
                item.entityOptions = res.data.entity.nodes;
              }
            });
          } else {
            This.$Message.error({
              duration: 2.5,
              content: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getBodyEdges (params) {
      let This = this;
      let param = {
        id: "",
        date: "1986-07-08",
        data: {}
      };

      KnowledgeManageService.bodyManage
        .nodeAttrs(param)
        .then(res => {
          if (res.code === 0) {
            This.bodyEdges = res.data.schema.node.attrs.map((item, index) => {
              return {
                value: index,
                label: item
              };
            });

            This.handleAttrsOptions();
          } else {
            This.$Message.error({
              duration: 2.5,
              content: res.message
            });
          }
        })
        .catch(err => {
          This.$Message.error({
            duration: 2.5,
            content: err.message
          });
        });
    }, // 获取x y轴参数

    getBodyNodesList () {
      let This = this
      
      const param = {
        id:"",
        date:"1988-10-25",
        data:{}
      }

      KnowledgeManageService.bodyManage
        .allBodyNodes(param)
        .then(res => {
          console.log(res, "获取所有实体类型 /noumenon/only/node/types");
          if (res.code === 0) {
            This.bodyAllNodes = res.data.schema.nodes.map(item => {
              return {
                id: parseInt(item.nodeId),
                value: item.value,
                color: item.color,
                size: item.size,
                caption: item.caption,
                shape: item.shape
              };
            });
          } else {
            This.$Message.error({
              duration: 2.5,
              content: res.message
            });
          }
        })
        .catch(err => {
          This.$Message.error({
            duration: 2.5,
            content: err.message
          });
        });
    }, // 获取实体类型节点列表

    handleAttrsOptions () {
      this.searchComplexData.entities.forEach(entity => {
        entity.attrsOptions = this.nodeAttrs;
      });
    }
  }
};
</script>
