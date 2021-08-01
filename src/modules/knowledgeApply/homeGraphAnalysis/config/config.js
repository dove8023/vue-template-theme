// color size shape toolbar-left

export default {
  colors: [
    {
      value: 1,
      label: '#4977FC'
    },
    {
      value: 2,
      label: '#187D2D'
    },
    {
      value: 3,
      label: '#AA8400'
    },
    {
      value: 4,
      label: '#AA05A8'
    },
    {
      value: 5,
      label: '#E5003B'
    },
    {
      value: 6,
      label: '#183B7D'
    },
    {
      value: 7,
      label: '#EA5300'
    },
    {
      value: 8,
      label: '#92B8FF'
    }],

  sizes: [
    {
      value: 1,
      label: '16'
    },
    {
      value: 2,
      label: '19'
    },
    {
      value: 3,
      label: '22'
    },
    {
      value: 4,
      label: '26'
    },
    {
      value: 5,
      label: '28'
    },
    {
      value: 6,
      label: '32'
		}],

	shapes: {
		star: "M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z",
		apple: "M24.32,10.85c-1.743,1.233-2.615,2.719-2.615,4.455c0,2.079,1.078,3.673,3.232,4.786c-0.578,1.677-1.416,3.134-2.514,4.375c-1.097,1.241-2.098,1.862-3.004,1.862c-0.427,0-1.009-0.143-1.748-0.423l-0.354-0.138c-0.725-0.281-1.363-0.423-1.92-0.423c-0.525,0-1.1,0.11-1.725,0.331l-0.445,0.16l-0.56,0.229c-0.441,0.176-0.888,0.264-1.337,0.264c-1.059,0-2.228-0.872-3.507-2.616c-1.843-2.498-2.764-5.221-2.764-8.167c0-2.095,0.574-3.781,1.725-5.061c1.149-1.279,2.673-1.92,4.568-1.92c0.709,0,1.371,0.13,1.988,0.389l0.423,0.172l0.445,0.183c0.396,0.167,0.716,0.251,0.959,0.251c0.312,0,0.659-0.072,1.04-0.217l0.582-0.229l0.435-0.16c0.693-0.251,1.459-0.377,2.297-0.377C21.512,8.576,23.109,9.334,24.32,10.85zM19.615,3.287c0.021,0.267,0.033,0.473,0.033,0.617c0,1.317-0.479,2.473-1.438,3.467s-2.075,1.49-3.347,1.49c-0.038-0.297-0.058-0.51-0.058-0.639c0-1.12,0.445-2.171,1.337-3.153c0.891-0.982,1.922-1.558,3.096-1.725C19.32,3.329,19.447,3.311,19.615,3.287z",
		glasses: "M14.075,9.531c0,0-2.705-1.438-5.158-1.438c-2.453,0-4.862,0.593-4.862,0.593L3.971,9.869c0,0,0.19,0.19,0.528,0.53c0.338,0.336,0.486,3.741,1.838,5.094c1.353,1.354,4.82,1.396,5.963,0.676c1.14-0.718,2.241-3.466,2.241-4.693c0-0.38,0-0.676,0-0.676c0.274-0.275,1.615-0.303,1.917,0c0,0,0,0.296,0,0.676c0,1.227,1.101,3.975,2.241,4.693c1.144,0.72,4.611,0.678,5.963-0.676c1.355-1.353,1.501-4.757,1.839-5.094c0.338-0.34,0.528-0.53,0.528-0.53l-0.084-1.183c0,0-2.408-0.593-4.862-0.593c-2.453,0-5.158,1.438-5.158,1.438C16.319,9.292,14.737,9.32,14.075,9.531z"
	},

  bodyActicons: [
    { // 本体左侧工具条
      text: '新建节点',
      svgIconName: 'create-node',
      action: 'createBodyNode'
    },
    {
      text: '新建关系',
      svgIconName: 'create-edge',
      action: 'createBodyEdge'
    },
    {
      text: '批量更新',
      svgIconName: 'batch-update',
      action: 'bodyBatchUpdate'
		}],
		
// 实体左侧工具条
  entityActions: [
    { 
      text: '新建节点',
      svgIconName: 'create-node',
      action: 'createNode'
    },
    {
      text: '新建关系',
      svgIconName: 'create-edge',
      action: 'createEdge'
    },
    {
      text: '批量更新',
      svgIconName: 'batch-update',
      action: 'batchUpdate'
    },
    {
      text: '下载',
      svgIconName: 'download',
      action: 'download'
    },
    // {
    //   text: '布局',
    //   svgIconName: 'layout',
    //   action: 'setLayout'
    // },
    {
      text: '在线推理',
      svgIconName: 'modify',
      action: 'onlineReasoning'
    },
    {
      text: '删除',
      svgIconName: 'delete',
      action: 'deleteAll'
    },
    {
      text: '路径探索',
      svgIconName: 'discovery',
      action: 'discovery'
		},
		{
      text: 'cypher查询',
      svgIconName: 'search',
      action: 'cpyherSearch'
    },{
      text: '连通图',
      svgIconName: 'connect',
      action: 'connectGraph'
    }],

  /**
   * type 弹框内动作的依据
   * action 具体的接口名称，一个动作会包含多个接口
   *  */
  actionConfig: [{
    type: 'createBodyNode',
    title: '新建节点',
    buttons: [{
      name: '确定',
      action: 'bodyNodeUpdate',
      type: 'primary'
    }, {
      name: '取消',
      action: 'nodeClose',
      type: 'normal'
    }]
  }, {
    type: 'bodyNodeInfo',
    title: '节点信息',
    buttons: [{
      name: '更改',
      action: 'modifyBodyNodeInfo',
      type: 'primary'
    }, {
      name: '删除',
      action: 'bodyNodeDelete',
      type: 'normal'
    }]
  },
  {
    type: 'bodyBatchUpdate',
    title: '批量更新',
    buttons: [{
      name: '模板下载',
      action: 'downBatchModal',
      type: 'primary'
    }
  //   {
  //     name: '删除',
  //     action: 'bodyNodeDelete',
  //     type: 'normal'
  //   }
  ]}, 
  {
    type: 'modifyBodyNodeInfo',
    title: '节点信息',
    buttons: [{
      name: '保存',
      action: 'bodyNodeUpdate',
      type: 'primary'
    }, {
      name: '取消更改',
      action: 'goBodyNodeInfoPage',
      type: 'normal'
    }]
  },
  {
    type: 'createBodyEdge',
    title: '新建关系',
    buttons: [{
      name: '确定',
      action: 'bodyEdgeUpdate',
      type: 'primary'
    }, {
      name: '取消',
      action: 'edgeClose',
      type: 'normal'
    }]
  }, {
    type: 'bodyEdgeInfo',
    title: '关系信息',
    buttons: [{
      name: '更改',
      action: 'modifyBodyEdgeInfo',
      type: 'primary'
    }, {
      name: '删除',
      action: 'bodyEdgeDelete',
      type: 'normal'
    }]
  }, {
    type: 'modifyBodyEdgeInfo',
    title: '关系信息',
    buttons: [{
      name: '保存',
      action: 'bodyEdgeUpdate',
      type: 'primary'
    }, {
      name: '取消更改',
      action: 'goBodyEdgeInfoPage',
      type: 'normal'
    }]
	}],

	entityActionConfig: [{
    type: 'createNode',
    title: '新建节点',
    buttons: [{
      name: '确定',
      action: 'entityNodeUpdate',
      type: 'primary'
    }, {
      name: '取消',
      action: 'nodeClose',
      type: 'normal'
    }]
  }, {
    type: 'nodeInfo',
    title: '节点信息',
    buttons: [{
      name: '更改',
      action: 'modifyNodeInfo',
      type: 'primary'
    }, {
      name: '删除',
      action: 'entityNodeDelete',
      type: 'normal'
    }]
  }, {
    type: 'modifyNodeInfo',
    title: '节点信息',
    buttons: [{
      name: '保存',
      action: 'entityNodeUpdate',
      type: 'primary'
    }, {
      name: '取消更改',
      action: 'goNodeInfoPage',
      type: 'normal'
    }]
  },
  {
    type: 'createEdge',
    title: '新建关系',
    buttons: [{
      name: '确定',
      action: 'entityEdgeUpdate',
      type: 'primary'
    }, {
      name: '取消',
      action: 'edgeClose',
      type: 'normal'
    }]
  }, {
    type: 'edgeInfo',
    title: '关系信息',
    buttons: [{
      name: '更改',
      action: 'modifyEdgeInfo',
      type: 'primary'
    }, {
      name: '删除',
      action: 'entityEdgeDelete',
      type: 'normal'
    }]
  }, {
    type: 'modifyEdgeInfo',
    title: '关系信息',
    buttons: [{
      name: '保存',
      action: 'entityEdgeUpdate',
      type: 'primary'
    }, {
      name: '取消更改',
      action: 'goEdgeInfoPage',
      type: 'normal'
    }]
	}, {
      type: 'searchComplex',
      title: '高级搜索',
      buttons: [{
        name: '确定',
        action: 'searchComplexFunc',
        type: 'primary'
      }, {
        name: '取消',
        action: 'searchClose',
        type: 'normal'
      }]
    }, {
      type: 'download',
      title: '下载',
      buttons: []
    }, {
      type: 'onlineReasoning',
      title: '在线推理',
      buttons: []
    }, {
      type: 'deleteAll',
      title: '删除',
      buttons: []
    }, {
			type: 'discovery',
			title: '路径探索',
			buttons: [{
				name: '确定',
				action: 'discovery',
				type: 'primary'
			}, {
				name: '取消',
				action: 'discoveryClose',
				type: 'normal'
			}]
    }, {
      type: 'connectGraph',
      title: '连通图',
      buttons: []
    }, {
      type: 'batchUpdate',
      title: '批量更新',
      buttons: []
		}, {
      type: 'cpyherSearch',
      title: 'cypher查询',
      buttons: [{
				name: '查询',
				action: 'cpyherSearch',
				type: 'primary'
			}, {
				name: '取消',
				action: 'cpyherSearchClose',
				type: 'normal'
			}]
		}],
		
	relationOptions: [{
		value: 0,
		label: '=',
		text: '等于'
	}, {
		value: 1,
		label: '<>',
		text: '不等于'
	}, {
		value: 2,
		label: '>',
		text: '大于'
	}, {
		value: 3,
		label: '<',
		text: '小于'
	}, {
		value: 4,
		label: '>=',
		text: '大于等于'
	}, {
		value: 5,
		label: '<=',
		text: '小于等于'
	}, {
		value: 6,
		label: '=~',
		text: '模糊等于'
	}]
}
