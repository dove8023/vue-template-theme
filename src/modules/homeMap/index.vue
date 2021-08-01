<template>
  <div
    class="home-query-container hidden-height"
  >
    <div class="content-layout-container scroll-container customer">
        <noViewAuth v-if="!pageAuth.view"/>
        <div v-else class="home-map-container">
            <div class="home-map clearfix">
            <div class="left">
                <div
                class="doc-detail panel"
                style="height: 428px;"
                >
                <h3>文档库详情</h3>
                <div
                    v-if="false"
                    class="description"
                >
                    描述：描述描述描述描述描述描述描述描述描述描述描述描述描述
                </div>
                <div class="box">
                    <ul>
                    <li><b>1700</b><span>文档数</span></li>
                    <li><b>10</b><span>涉及主题量</span></li>
                    <li><b>1988-2019</b><span>时间跨度</span></li>
                    <li><b>20T</b><span>存储量</span></li>
                    <li><b>2019-04-04</b><span>最后数据更改时间</span></li>
                    </ul>
                </div>
                <gs-table
                    :data="docTableData"
                    :stripe="false"
                    height="278"
                >
                    <gs-table-column
                    prop="id"
                    label="序号"
                    data-align="right"
                    width="40"
                    />
                    
                    <gs-table-column
                    :show-overflow-tooltip="true"
                    prop="name"
                    label="文档名称"
                    />
                    <gs-table-column
                    label="浏览热度"
                    width="50"
                    >
                    <template slot-scope="scope">
                        <ul class="progress progress-red">
                        <li class="one"/>
                        <li class="two"/>
                        <li class="tree"/>
                        <li class="four"/>
                        <li class="five"/>
                        </ul>
                    </template>
                    </gs-table-column>
                    <gs-table-column
                    :show-overflow-tooltip="true"
                    prop="date"
                    width="90"
                    label="上传时间"
                    />
                </gs-table>
                </div>
                <div
                class="knowledge-map-detail panel"
                style="height: 408px;"
                >
                <h3>知识图谱详情</h3>
                
                <div
                    v-if="false"
                    class="description"
                >
                    描述：描述描述描述描述描述描述描述描述描述描述描述描述描述
                </div>
                
                <div class="box">
                    <ul>
                    <li><b>434</b><span>本体节点数</span></li>
                    <li><b>2825</b><span>实体节点数</span></li>
                    <li><b>5281</b><span>实体关系数</span></li>
                    <li><b>20T</b><span>存储量</span></li>
                    <li><b>8:00:00</b><span>最后数据更改时间</span></li>
                    </ul>
                </div>
                
                <div class="map-table-wrap clearfix">
                    
                    <div class="map-table">
                    <gs-table
                        :data="mapTableData"
                        :stripe="false"
                        height="278"
                    >
                        <gs-table-column
                        prop="id"
                        label="序号"
                        data-align="right"
                        width="40"
                        />
                        <gs-table-column
                        prop="name"
                        label="本体节点名称"
                        />
                        <gs-table-column
                        prop="level"
                        width="90"
                        label="连接热度"
                        >
                        <template slot-scope="scope">
                            <ul class="progress progress-blue">
                            <li class="one"/>
                            <li class="two"/>
                            <li class="tree"/>
                            <li class="four"/>
                            <li class="five"/>
                            </ul>
                        </template>
                        </gs-table-column>
                    </gs-table>
                    </div>
                    
                    <div class="node-num">
                    
                    <h4 class="tit">
                        <div class="line"/>
                        <span>实体节点数量</span>
                    </h4>
                    
                    <ul>
                        <li><b>油藏</b><span style="width: 60px;">3</span></li>
                        <li><b>盆地</b><span style="width: 40px;">2</span></li>
                        <li><b>油田</b><span style="width: 120px;">6</span></li>
                        <li><b>抽油井</b><span style="width: 200px;">10</span></li>
                    </ul>
                    
                    </div>
                </div>
                
                </div>
            </div>
            <div class="right panel">
                
                <h3>人员使用排名</h3>
                
                <div class="order-box">
                
                <h4 class="tit">
                    <div class="line"/>
                    <span>积分排名</span>
                </h4>
                
                <ul class="order-list">
                    <li>
                    <span class="order order-first">1</span>
                    <span class="name">Anna Fali</span>
                    <span class="score">22131分</span>
                    </li>
                    <li>
                    <span class="order order-second">2</span>
                    <span class="name">Chukwudi Udo</span>
                    <span class="score">22131分</span>
                    </li>
                    <li>
                    <span class="order order-three">3</span>
                    <span class="name">Constanza Mariano</span>
                    <span class="score">2131分</span>
                    </li>
                    <li>
                    <span class="order">4</span>
                    <span class="name">Gopichand Sana</span>
                    <span class="score">14212分</span>
                    </li>
                    <li>
                    <span class="order">5</span>
                    <span class="name">Homayoun Shakibaii</span>
                    <span class="score">8977分</span>
                    </li>
                    <li>
                    <span class="order">6</span>
                    <span class="name">Leo Knight</span>
                    <span class="score">7896分</span>
                    </li>
                    <li>
                    <span class="order">7</span>
                    <span class="name">Lidmila Vilensky</span>
                    <span class="score">6574分</span>
                    </li>
                    <li>
                    <span class="order">8</span>
                    <span class="name">Mahnaz Farzin</span>
                    <span class="score">5988分</span>
                    </li>
                    <li>
                    <span class="order">9</span>
                    <span class="name">Miglena Tadic</span>
                    <span class="score">5576分</span>
                    </li>
                    <li>
                    <span class="order">10</span>
                    <span class="name">Pan Hyuk</span>
                    <span class="score">5434分</span>
                    </li>
                </ul>
                
                </div>
                
                <div class="order-box">
                
                <h4 class="tit">
                    <div class="line"/>
                    <span>下载排名</span>
                </h4>
                
                <ul class="order-list">
                    <li>
                    <span class="order order-first">1</span>
                    <span class="name">Alex Walker</span>
                    <span class="score">22131次</span>
                    </li>
                    <li>
                    <span class="order order-second">2</span>
                    <span class="name">Alice Krejčová</span>
                    <span class="score">14212次</span>
                    </li>
                    <li>
                    <span class="order order-three">3</span>
                    <span class="name">Chandravadan Karmakar</span>
                    <span class="score">12333次</span>
                    </li>
                    <li>
                    <span class="order">4</span>
                    <span class="name">Fukuyo Kazutoshi</span>
                    <span class="score">8977次</span>
                    </li>
                    <li>
                    <span class="order">5</span>
                    <span class="name">Georges Embolo</span>
                    <span class="score">7896次</span>
                    </li>
                    <li>
                    <span class="order">6</span>
                    <span class="name">Gvozden Boskovsky</span>
                    <span class="score">6574次</span>
                    </li>
                    <li>
                    <span class="order">7</span>
                    <span class="name">Huỳnh Quỳnh Nhung</span>
                    <span class="score">6433次</span>
                    </li>
                    <li>
                    <span class="order">8</span>
                    <span class="name">Kiandra Lowe</span>
                    <span class="score">5988次</span>
                    </li>
                    <li>
                    <span class="order">9</span>
                    <span class="name">Mgbankwo Orjee</span>
                    <span class="score">5576次</span>
                    </li>
                    <li>
                    <span class="order">10</span>
                    <span class="name">Takamaru Ayako</span>
                    <span class="score">5434次</span>
                    </li>
                </ul>
                
                </div>
            
            </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  import noViewAuth from '@/components/public/noViewAuth'
  import {mapGetters} from 'vuex'
  import {getPageAuth} from '@/utils/comUtils'
  
  export default {
    components: {noViewAuth},
    data () {
      return {
        label: '知识地图',
        loading: false,
        docTableData: [{
          id: 1,
          date: '2018-11-01 18:00:00',
          name: '任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1.txt',
          level: ''
        }, {
          id: 2,
          date: '2018-11-01 18:00:00',
          name: '任务2.txt',
          level: ''
        }, {
          id: 3,
          date: '2018-11-01 18:00:00',
          name: '任务3.txt',
          level: ''
        }, {
          id: 4,
          date: '2018-11-01 18:00:00',
          name: '任务4.txt',
          level: ''
        }, {
          id: 5,
          date: '2018-11-01 18:00:00',
          name: '任务5.txt',
          level: ''
        }, {
          id: 6,
          date: '2018-11-01 18:00:00',
          name: '任务6.txt',
          level: ''
        }],
        
        mapTableData: [{
          id: 1,
          name: '油藏1',
          level: ''
        }, {
          id: 2,
          name: '油藏2',
          level: ''
        }, {
          id: 3,
          name: '油藏3',
          level: ''
        }, {
          id: 4,
          name: '油藏4',
          level: ''
        }, {
          id: 5,
          name: '油藏5',
          level: ''
        }],
        pageAuth: {
          view: false
        }
      }
    },
    computed: {
      ...mapGetters(['resourceGroup'])
    },
    created () {
      this.initPage()
    },
    methods: {
      initPage () {
        let auth = getPageAuth(this.resourceGroup, this.$route.path)
        this.pageAuth = {...this.pageAuth, ...auth}
      }
    }
  }
</script>
