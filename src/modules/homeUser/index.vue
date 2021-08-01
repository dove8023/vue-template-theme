<template>
  <div class="home-query-container hidden-height home-user-container">
      <div class="content-layout-container scroll-container customer query-main-container">
        <noViewAuth v-if="!pageAuth.view" />
        <div v-else class="user-main-container">
          <div class="top-container">
            <div class="left-main-info float-left">
              <div class="profile-wrapper float-left rel-pos">
                <img :src="personInfo.profilePhoto" alt="头像" class="profile-img" />
                <i class="download-info">
                  <span class="download-txt">下载</span>
                  <span class="download-count">{{ personInfo.downloadCount || '' }}</span>
                </i>
              </div>
              <div class="basic-info-wrapper float-left">
                <div class="name-title">
                  <span class="name">{{ personInfo.userName||'未知' }}</span>
                  <span class="title">{{ personInfo.roleTitle||'' }}</span>
                </div>
                <div v-if="personInfo.contactInfo" class="contact-info">
                  <span class="contact-name">联系方式</span>
                  <span class="contact-value">{{ personInfo.contactInfo || '' }}</span>
                </div>
              </div>
            </div>
            <ul class="right-count-info float-left">
              <li
                v-for="(item, index) in personInfo.counts"
                :key="index"
                :title="item.value"
                class="count-item float-left"
              >
                <div class="count-value">{{ item.value }}</div>
                <div class="count-name">{{ item.name }}</div>
              </li>
            </ul>
            <div class="clearfix" />
          </div>
          <div class="bottom-container">
            <gs-tabs v-model="activeNav" type="content-tab" @tab-click="changeTab">
              <gs-tab-pane
                v-for="(item, index) in tabs"
                :key="index"
                :label="item"
                :name="item"
                class="tab-item scroll-container"
              >
                <h5 v-if="index===5">当前审核任务</h5>
                <base-table :table-config="tableConfig[index]" />
                <h5 v-if="index===5" class="margin-top48">申请审核历史</h5>
                <base-table v-if="index===5" :table-config="tableConfig[6]" />
              </gs-tab-pane>
            </gs-tabs>
          </div>
        </div>
      </div>
  </div>
</template>

<script type="es6">
import BaseTable from "@/components/public/baseTable.vue";
import noViewAuth from "@/components/public/noViewAuth";
import { mapGetters } from "vuex";
import { getPageAuth } from "@/utils/comUtils";

export default {
  components: {
    BaseTable,
    noViewAuth
  },
  data() {
    return {
      label: "个人中心",
      personInfo: {
        profilePhoto: "@/static/assets/images/profile.png"
      },
      tabs: [
        "积分明细",
        "上传明细",
        "下载明细",
        "我的订阅",
        "未上传明细",
        "审核明细"
      ],
      activeNav: "积分明细",
      tableConfig: [
        {
          width: "616px",
          columns: [
            {
              prop: "resource",
              label: "下载资源",
              width: 226
            },
            {
              prop: "downloadTime",
              label: "时间",
              width: 240
            },
            {
              prop: "score",
              label: "分数",
              width: 150
            }
          ],
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        },
        {
          columns: [
            {
              minWidth: 80,
              prop: "fileName",
              label: "文档名称"
            },
            {
              minWidth: 220,
              tag: true,
              notShowTip: true,
              prop: "fileTag",
              label: "文档标签"
            },
            {
              minWidth: 80,
              prop: "uploadTime",
              label: "上传时间"
            },
            {
              minWidth: 72,
              align: "right",
              prop: "downloadCount",
              label: "下载量"
            },
            {
              minWidth: 80,
              align: "right",
              prop: "earnScore",
              label: "所得积分"
            },
            {
              minWidth: 104,
              hotScale: true,
              prop: "hotScale",
              label: "热度"
            }
          ],
          showImg: true,
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        },
        {
          maxWidth: "1036px",
          columns: [
            {
              minWidth: 90,
              prop: "fileName",
              label: "文档名称"
            },
            {
              minWidth: 220,
              tag: true,
              notShowTip: true,
              prop: "fileTag",
              label: "文档标签"
            },
            {
              minWidth: 120,
              prop: "downloadTime",
              label: "下载时间"
            },
            {
              minWidth: 80,
              prop: "useScore",
              label: "使用积分"
            },
            {
              minWidth: 104,
              prop: "hotScale",
              hotScale: true,
              label: "热度"
            }
          ],
          showImg: true,
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        },
        {
          width: "616px",
          columns: [
            {
              width: 212,
              prop: "subscription",
              label: "我的订阅"
            },
            {
              width: 198,
              prop: "hotScale",
              hotScale: true,
              label: "订阅热度"
            },
            {
              width: 98,
              prop: "updatedState",
              colorFn: this.getColor,
              labelFn: this.showUpdateState,
              label: "状态"
            }
          ],
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        },
        {
          maxWidth: "800px",
          columns: [
            {
              minWidth: 120,
              prop: "fileName",
              label: "文档名称"
            },
            {
              minWidth: 180,
              prop: "locate",
              label: "文档位置"
            }
          ],
          operList: [
            {
              width: 98,
              labelFn: this.showLabel,
              event: this.goToDataImport
            }
          ],
          showImg: true,
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        },
        {
          maxWidth: "800px",
          columns: [
            {
              minWidth: 120,
              prop: "applyOpr",
              label: "申请操作"
            },
            {
              minWidth: 180,
              prop: "oprDetail",
              label: "操作详情"
            },
            {
              minWidth: 128,
              prop: "oprTime",
              label: "操作时间"
            }
          ],
          operList: [
            {
              width: 80,
              label: "审核",
              event: this.checkTask
            }
          ],
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        },
        {
          maxWidth: "800px",
          columns: [
            {
              minWidth: 120,
              prop: "applyOpr",
              label: "申请操作"
            },
            {
              minWidth: 180,
              prop: "oprDetail",
              label: "操作详情"
            },
            {
              minWidth: 128,
              prop: "oprTime",
              label: "操作时间"
            },
            {
              width: 80,
              prop: "state",
              label: "状态"
            }
          ],
          data: [],
          select: () => {
            console.log(1);
          },
          selectAll: () => {
            console.log(1);
          }
        }
      ],
      testData: [
        {
          errorCode: 0,
          total: 4,
          data: [
            {
              resource: "某油田XXXX研究.pdf",
              downloadTime: "2018-08-08 15:33:32",
              score: "+1"
            },
            {
              resource: "油藏231.pdf",
              downloadTime: "2018-09-08 15:33:32",
              score: "+1"
            },
            {
              resource: "油藏232.pdf",
              downloadTime: "2018-09-10 15:33:32",
              score: "+1"
            },
            {
              resource: "油藏233.pdf",
              downloadTime: "2018-09-18 15:33:32",
              score: "+1"
            }
          ]
        },
        {
          errorCode: 0,
          total: 8,
          data: [
            {
              fileName: "某油田XXXX研究.pdf",
              fileTag: ["地形（陆上或海上）-海上", "岩性", "标签三", "标签四"],
              uploadTime: "2018-08-08 15:33:32",
              downloadCount: 167,
              earnScore: "+167",
              hotScale: 5
            },
            {
              fileName: "excel文档.xlsx",
              fileTag: [],
              uploadTime: "2018-10-08 15:33:32",
              downloadCount: 22,
              earnScore: "+22",
              hotScale: 2
            },
            {
              fileName: "油藏1.jpg",
              fileTag: [],
              uploadTime: "2018-09-08 15:33:32",
              downloadCount: 167,
              earnScore: "+167",
              hotScale: 4
            },
            {
              fileName: "油藏2.gif",
              fileTag: [],
              uploadTime: "2018-08-18 15:33:32",
              downloadCount: 167,
              earnScore: "+167",
              hotScale: 4
            },
            {
              fileName: "油藏3.csv",
              fileTag: null,
              uploadTime: "2018-08-28 15:33:32",
              downloadCount: 167,
              earnScore: "+167",
              hotScale: 3
            },
            {
              fileName: "油藏4.ppt",
              fileTag: [],
              uploadTime: "2018-11-08 15:33:32",
              downloadCount: 166,
              earnScore: "+166",
              hotScale: 4
            },
            {
              fileName: "油藏5.doc",
              fileTag: [],
              uploadTime: "2018-08-08 15:33:32",
              downloadCount: null,
              earnScore: "",
              hotScale: null
            },
            {
              fileName: "油藏6.png",
              fileTag: [],
              uploadTime: "2018-08-08 15:33:32",
              downloadCount: null,
              earnScore: "",
              hotScale: null
            }
          ]
        },
        {
          errorCode: 0,
          total: 8,
          data: [
            {
              fileName: "某油田XXXX研究.pdf",
              fileTag: ["地形（陆上或海上）-海上", "岩性", "标签三", "标签四"],
              downloadTime: "2018-08-08 15:33:32",
              useScore: "2",
              hotScale: 5
            },
            {
              fileName: "excel文档.xlsx",
              fileTag: [],
              downloadTime: "2018-10-08 15:33:32",
              useScore: "2",
              hotScale: 2
            },
            {
              fileName: "油藏1.jpg",
              fileTag: [],
              downloadTime: "2018-09-08 15:33:32",
              useScore: "1",
              hotScale: 4
            },
            {
              fileName: "油藏2.gif",
              fileTag: [],
              downloadTime: "2018-08-18 15:33:32",
              useScore: "2",
              hotScale: 4
            },
            {
              fileName: "油藏3.csv",
              fileTag: null,
              downloadTime: "2018-08-28 15:33:32",
              useScore: "2",
              hotScale: 3
            },
            {
              fileName: "油藏4.ppt",
              fileTag: [],
              downloadTime: "2018-11-08 15:33:32",
              useScore: "2",
              hotScale: 4
            },
            {
              fileName: "油藏5.doc",
              fileTag: [],
              downloadTime: "2018-08-08 15:33:32",
              useScore: "",
              hotScale: null
            },
            {
              fileName: "油藏6.png",
              fileTag: [],
              downloadTime: "2018-08-08 15:33:32",
              useScore: "",
              hotScale: null
            }
          ]
        },
        {
          errorCode: 0,
          total: 4,
          data: [
            {
              subscription: "某油田1",
              hotScale: 5,
              updatedState: true
            },
            {
              subscription: "某油田2",
              hotScale: 4,
              updatedState: false
            },
            {
              subscription: "某油田3",
              hotScale: 3,
              updatedState: false
            },
            {
              subscription: "某油田4",
              hotScale: 2,
              updatedState: false
            }
          ]
        },
        {
          errorCode: 0,
          total: 4,
          data: [
            {
              fileName: "某油田1XXXX研究文档.pdf",
              locate: "\\frogveo\\文稿\\AxureUserData\\Axure-8-0\\cache3"
            },
            {
              fileName: "某油田2XXXX研究文档.xlsx",
              locate: ""
            },
            {
              fileName: "某油田3XXXX研究文档.ppt",
              locate: ""
            },
            {
              fileName: "某油田4XXXX研究文档.png",
              locate: ""
            }
          ]
        },
        {
          errorCode: 0,
          total: 3,
          data: [
            {
              applyOpr: "修改本体",
              oprDetail: "页性改为岩性",
              oprTime: "2018-08-08 15:33:32",
              state: "审核中"
            },
            {
              applyOpr: "增加本体节点",
              oprDetail: "增加岩性",
              oprTime: "2018-09-08 15:33:32",
              state: "已审核"
            },
            {
              applyOpr: "修改关系",
              oprDetail: "关系xxx改为yyy",
              oprTime: "2018-07-18 15:33:32",
              state: "已审核"
            }
          ]
        },
        {
          errorCode: 0,
          total: 3,
          data: [
            {
              applyOpr: "修改岩性",
              oprDetail: "页性改为岩性",
              oprTime: "2018-08-08 15:33:32",
              state: "审核中"
            },
            {
              applyOpr: "增加本体节点",
              oprDetail: "增加岩性",
              oprTime: "2018-09-08 15:33:32",
              state: "已审核"
            },
            {
              applyOpr: "修改关系",
              oprDetail: "关系xxx改为yyy",
              oprTime: "2018-07-18 15:33:32",
              state: "已审核"
            }
          ]
        }
      ],
      pageAuth: {
        view: false
      }
    };
  },
  computed: {
    ...mapGetters(["resourceGroup"])
  },
  mounted() {
    let me = this;

    let res = {
      errorCode: 0,
      data: {
        userName: "李倩",
        roleTitle: "咨询师",
        contactInfo: "18700001111",
        profilePhoto:
          "https://askdev.gridsumdissector.com/images/icon_xxyx%403x.png",
        downloadCount: 3,
        totalScore: 0,
        totalRank: 20,
        uploadFileCount: 0,
        downloadFileCount: 10,
        unUploadFileCount: 30,
        counts: [
          {
            name: "积分",
            value: 0
          },
          {
            name: "总排名",
            value: 203234
          },
          {
            name: "上传文件",
            value: 0
          },
          {
            name: "下载文件",
            value: 0
          },
          {
            name: "未上传文件",
            value: 30
          }
        ]
      }
    };

    me.personInfo = res.data;

    me.tableConfig[0].data = me.testData[0].data;

    // queryService.getPersonInfo().then(res => {
    //   console.log('res:', res)
    //   if (res && res.data) {
    //     me.personInfo = res.data
    //   }
    // }, err => {
    //   console.log('err:', err)
    // })
    this.initPage();
  },
  methods: {
    initPage() {
      let auth = getPageAuth(this.resourceGroup, this.$route.path);
      this.pageAuth = { ...this.pageAuth, ...auth };
    },
    changeTab(value) {
      if (value.index === "5") {
        this.tableConfig[5].data = this.testData[5].data;
        this.tableConfig[6].data = this.testData[6].data;
      } else {
        this.tableConfig[value.index].data = this.testData[value.index].data;
      }
    },
    checkTask(row) {
      // console.log(row)
    },
    goToDataImport(row) {
      // console.log(row)
    },
    showLabel(item) {
      return item.locate ? "上传" : "";
    },
    showUpdateState(item) {
      return item.updatedState ? "有更新" : "无更新";
    },
    getColor(item) {
      return item.updatedState ? "#0073E8" : "#999";
    }
  }
};
</script>
