<template>
  <NavBar></NavBar>
  <div class="home">
      <div class="query-section">
        <div class="background-pic" :style="{ filter: `blur(${blurValue}px)`, backgroundColor: `rgba(255, 255, 255, ${whiteOverlay})` }">
            <img alt="" src="../assets/bg.jpg">
        </div>
        <div class="header-text">启研汇</div>
        <div class="search-wrap" :style="{height: isRegularSearch?  '220px' : qSectionHeight + 'px'}">
            <!-- <div class="input-area">
                <div class="input-query">
                    <el-input
                        v-model="input"
                        style="max-width: 600px"
                        class="input-with-select"
                    >
                        <template #prepend>
                            <el-select
                                v-model="value"
                                :empty-values="[null, undefined]"
                                class="input-select"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </template>
                    </el-input>

                </div>
                <div class="super-search">高级搜索 ></div>
                <div class="btn-wrap">
                    <el-button class="search-btn" @click="search" color="var(--v_overall_blue_light)" v-html="buttonText"></el-button>
                </div>
                <el-input
                    class="ai-area"
                    v-model="AIArea"
                    style="width: 75%; font-size: 18px; color: black"
                    ref="inputBox"
                    :autosize="{minRows: 2, maxRows: 5}"
                    type="textarea"
                    placeholder="AI辅助检索"
                    @input="adjustHeight"
                />
            </div> -->
            <div class="input-area">
                <div v-if="isRegularSearch" class="input-query">
                    <el-input
                        v-model="input"
                        style="max-width: 600px"
                        class="input-with-select"
                    >
                        <template #prepend>
                            <el-select
                                v-model="value"
                                :empty-values="[null, undefined]"
                                class="input-select"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </template>
                    </el-input>
                </div>
                <el-input
                    v-else
                    class="ai-area"
                    v-model="AIArea"
                    style="width: 75%; font-size: 18px; color: black"
                    ref="inputBox"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    type="textarea"
                    placeholder="AI辅助检索"
                    @input="adjustHeight"
                    maxlength="300"
                />

                <div class="toggle-search-up">
                    <el-button
                        class="change-btn"
                        @click="toggleSearchMode"
                    ></el-button>
                    <div class="ai-button-text" @click="toggleSearchMode">
                        AI
                    </div>
                </div>

                <div class="toggle-search-down">
                    <el-button
                        class="advanced-btn"
                        @click="toggleSearchAdvanced"
                    ></el-button>
                    <div class="advanced-button-text" @click="toggleSearchAdvanced">
                        PRO
                    </div>
                </div>


                <div class="btn-wrap" :style="{ top: isRegularSearch ? '125px' : qSectionHeight - 140 + 'px' }">
                    <el-button
                        class="search-btn"
                        @click="search"
                        color="var(--v_overall_blue_light)"
                        v-html="buttonText"
                    ></el-button>
                </div>
            </div>
        </div>
      </div>
      <!--<div class="info-section">
          <div class="rank-table-wrap">
              <div class="rank-table">
                  <h2 class="table-title">热度排行榜</h2>
                  <el-table :data="rankings" border :show-header="true" style="border: none">
                      <el-table-column
                          label="名次"
                          prop="rank"
                          width="20"
                          align="left"
                      ></el-table-column>
                      <el-table-column
                          label="名称"
                          prop="name"
                          align="left"
                      ></el-table-column>
                      <el-table-column
                          label="热度值"
                          prop="popularity"
                          align="right"
                      >
                          <template #default="{ row }">
                              <span>{{ row.popularity }}</span>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
          </div>
      </div> -->
      <div class="info-test">
          <el-container style="height: 650px; width: 100vw;">
              <!-- 左侧热度排行榜 -->
              <el-aside width="400px" style="background-color: rgba(245, 245, 245, 1);padding: 20px">
                  <h3>热度排行榜</h3>
                  <!--<el-menu :default-active="activeRankItem">
                      <el-menu-item v-for="item in rankList" :key="item.id">
                          {{ item.title }}
                      </el-menu-item>
                  </el-menu>-->
                  <el-table :data="rankings" border :show-header="true" style="border: none">
                      <el-table-column
                          label="名次"
                          prop="rank"
                          width="20"
                          align="left"
                      ></el-table-column>
                      <el-table-column
                          label="名称"
                          prop="name"
                          align="left"
                      ></el-table-column>
                      <el-table-column
                          label="热度值"
                          prop="popularity"
                          align="right"
                      >
                          <template #default="{ row }">
                              <span>{{ row.popularity }}</span>
                          </template>
                      </el-table-column>
                  </el-table>
              </el-aside>
              <!--<div class="rank-table">
                  <h2 class="table-title">热度排行榜</h2>
                  <el-table :data="rankings" border :show-header="true" style="border: none">
                      <el-table-column
                          label="名次"
                          prop="rank"
                          width="20"
                          align="left"
                      ></el-table-column>
                      <el-table-column
                          label="名称"
                          prop="name"
                          align="left"
                      ></el-table-column>
                      <el-table-column
                          label="热度值"
                          prop="popularity"
                          align="right"
                      >
                          <template #default="{ row }">
                              <span>{{ row.popularity }}</span>
                          </template>
                      </el-table-column>
                  </el-table>
              </div> -->
              <!-- 右侧主要内容 -->
              <el-container style="align-items: center">
                  <!-- 顶部导航栏 -->
                  <el-header style="background-color: transparent;display: flex; justify-content: center; width: 100%; margin-top: 10px;">
                      <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="tabs">
                          <el-tab-pane label="期刊" name="journal" class="menu-tab"></el-tab-pane>
                          <el-tab-pane label="会议" name="conference" class="menu-tab"></el-tab-pane>
                          <el-tab-pane label="论文" name="paper" class="menu-tab"></el-tab-pane>
                      </el-tabs>
                  </el-header>

                  <!-- 内容部分 -->
                  <el-main class="info-right">
                      <el-row>
                          <!-- 左侧热门 -->
                          <el-col :span="12" style="padding: 10px;" class="column">
                              <h3 class="hot-header">热门{{ getSelectedTabLabel() }}</h3>
                              <el-card v-for="item in hotItems" :key="item.id" class="card-content" shadow="never">
                                  <template #header>
                                      <div class="card-header">
                                          <span>SOSP18-NetCache- Balancing Key-Value Stores with Fast In-Network Caching</span>
                                      </div>
                                  </template>
                                  <p class="abstract">{{ item.title }}</p>
                                  <template #footer>
                                      <div class="card-footer">Xin Jin   Xiaozhou Li</div>
                                  </template>
                              </el-card>
                          </el-col>

                          <!-- 右侧为你推荐 -->
                          <el-col :span="12" style="padding: 10px;" class="column">
                              <h3 class="hot-header">为你推荐{{ getSelectedTabLabel() }}</h3>
                              <el-card v-for="item in recommendedItems" :key="item.id" class="card-content" shadow="never">
                                  <template #header>
                                      <div class="card-header">
                                          <span>作者</span>
                                      </div>
                                  </template>
                                  <p class="abstract">{{ item.title }}</p>
                                  <template #footer>
                                      <div class="card-footer">Xin Jin   Xiaozhou Li</div>
                                  </template>
                              </el-card>
                          </el-col>
                      </el-row>
                  </el-main>
              </el-container>
          </el-container>
      </div>
      <div class="page-bottom">
          <FooterBar />
      </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterBar from "@/components/FooterBar.vue";
//import {get} from "axios";
//import axios, {get} from "axios";
//import {ElMessage} from "element-plus";
//import axios from "axios";

// @ is an alias to /src


export default {
    name: "HomeView",
    components: {
        NavBar,
        FooterBar
    },
    data() {
        return {
            input: '',
            value: '',
            options: [
                {
                    value: '',
                    label: '关键词',
                },
                {
                    value: 'theme',
                    label: '主题',
                },
                {
                    value: 'title',
                    label: '题目',
                },
                {
                    value: 'field',
                    label: '领域',
                },
                {
                    value: 'auths',
                    label: '作者',
                },
            ],
            AIArea: '',
            qSectionHeight: 270,
            buttonText: 'Illumineer',
            blurValue: 0,
            whiteOverlay: 0,
            rankings: [
                { rank: 1, name: '项目 A', popularity: 300 },
                { rank: 2, name: '项目 B', popularity: 250 },
                { rank: 3, name: '项目 C', popularity: 200 },
                { rank: 4, name: '项目 D', popularity: 150 },
                { rank: 5, name: '项目 E', popularity: 100 },
                { rank: 5, name: '项目 E', popularity: 100 },
                { rank: 5, name: '项目 E', popularity: 100 },
                { rank: 5, name: '项目 E', popularity: 100 },
                { rank: 5, name: '项目 E', popularity: 100 },
            ],
            activeTab: 'journal',
            hotItems: [
                { id: '1', title: 'We present NetCache, a new key-value store architecture that\n' +
                        'leverages the power and flexibility of new-generation programmable switches to handle queries on hot items and balance the load across storage nodes. NetCache provides high\n' +
                        'aggregate throughput and low latency even under highlyskewed and rapidly-changing workloads...' },
                { id: '2', title: '热门期刊2' }
            ],
            recommendedItems: [
                { id: '1', title: '推荐期刊1' },
                { id: '2', title: '推荐期刊2' }
            ],
            isRegularSearch: true,
        }
    },
    watch: {
        AIArea(newVal) {
            this.buttonText = newVal? '<span class="ai-color">AI</span>llumineer!' : 'Illumineer!';
        },
    },
    methods: {
        adjustHeight() {
            const inputElement = this.$refs.inputBox.$el.querySelector('textarea');
            const inputBoxHeight = inputElement.scrollHeight;
            this.qSectionHeight = Math.min(inputBoxHeight + 200, 380);
        },
        updateBlur() {
            const scrollY = window.scrollY;
            const maxBlur = 10;
            const maxWhite = 1;
            this.blurValue = Math.min(scrollY/100, maxBlur);
            this.whiteOverlay = Math.min(scrollY/10, maxWhite);
        },
        /*handleTabClick(tab) {
            // 切换导航栏后更新热门和推荐内容
            this.updateItems(tab.name);
        },*/
        handleTabClick(tab) {
            this.activeTab = tab.name;

            // Fetch hot and recommended items based on the selected tab
            this.fetchItemsByTab(tab.name);
        },
        getSelectedTabLabel() {
            switch (this.activeTab) {
                case 'journal':
                    return '期刊';
                case 'conference':
                    return '会议';
                case 'paper':
                    return '论文';
                default:
                    return '';
            }
        },
        /*updateItems(tabName) {
            // 根据导航栏项动态更新热门和推荐数据
            if (tabName === 'journal') {
                this.hotItems = [
                    { id: '1', title: '热门期刊1' },
                    { id: '2', title: '热门期刊2' }
                ];
                this.recommendedItems = [
                    { id: '1', title: '推荐期刊1' },
                    { id: '2', title: '推荐期刊2' }
                ];
            } else if (tabName === 'conference') {
                this.hotItems = [
                    { id: '1', title: '热门会议1' },
                    { id: '2', title: '热门会议2' }
                ];
                this.recommendedItems = [
                    { id: '1', title: '推荐会议1' },
                    { id: '2', title: '推荐会议2' }
                ];
            } else if (tabName === 'paper') {
                this.hotItems = [
                    { id: '1', title: '热门论文1' },
                    { id: '2', title: '热门论文2' }
                ];
                this.recommendedItems = [
                    { id: '1', title: '推荐论文1' },
                    { id: '2', title: '推荐论文2' }
                ];
            }
        },*/
        toggleSearchMode() {
            this.isRegularSearch = !this.isRegularSearch;
        },
        toggleSearchAdvanced() {
            this.$router.push({ name: 'advancedSearch' });
        },
        async search() {
            /*try {
                let params = {};

                if (this.isRegularSearch) {
                    // 普通搜索模式，发送 input 和 value
                    params = {
                        type: 1,
                        input: this.input,
                        value: this.value,
                    };
                } else {
                    // AI搜索模式，发送 AIArea
                    params = {
                        type: 2,
                        aiArea: this.AIArea,
                    };
                }

                // 向后端发送请求
                const response = await axios.post('api/search', params);
                console.log('响应数据:', response.data);
                ElMessage.success("检索成功");

                this.$store.commit('setSearchResults', response.data);

                this.$router.push({ name: 'searchResult' });
                // 在这里处理成功后的逻辑，例如展示结果
            } catch (e) {
                console.error("检索失败:", e);
                ElMessage.error("检索失败，请重试");
            }*/
            console.log(this.value);
            if (this.isRegularSearch) {
                if(this.value === '') {
                    this.$router.push({path:'/searchResult', query:{searchType:0, keyword:this.input, condition: 'keywords'}});
                } else {
                    this.$router.push({path:'/searchResult', query:{searchType:0, keyword:this.input, condition: this.value}});
                }
            } else {
                this.$router.push({path:'/searchResult', query:{searchType:2, query: this.AIArea}});
            }
        },
        async fetchItemsByTab(tabName) {
            try {
                // Make API request to the backend
                const response = await this.$api.get(`/api/items`, {
                    params: { category: tabName },
                });

                // Assume the response returns an object with 'hotItems' and 'recommendedItems'
                this.hotItems = response.data.hotItems;
                this.recommendedItems = response.data.recommendedItems;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async fetchRankings() {
            try {
                const response = await this.$api.get('/api/rankings');
                this.rankings = response.data;
            } catch (error) {
                console.error("Error fetching rankings", error);
            }
        }
    },
    mounted() {
        this.fetchRankings();
        this.fetchItemsByTab(this.activeTab);
        window.addEventListener('scroll', this.updateBlur);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.updateBlur);
    }
}
</script>

<style scoped>
.home {
    width: 100%;
    background-color: #fafafa;
}

:deep(.el-aside) {
    height: 50vh; /* 假设 aside 的高度与视口一致，滚动效果会出现 */
}

.query-section {
    position: relative;
    width: 100%;
    height: 750px;
}

.background-pic {
    width: 100%;
    height: 100%;
    /* display: flex; */
    justify-content: center;
    align-items: center;
    transition: filter 0.1s ease-out, background-color 0.1s ease-out;
}

.background-pic img {
    width: 100%;
    height: 100%;
}

.search-wrap {
    position: relative;
    width: 60%;
    top: -350px;
    left: 50%;
    border-radius: 35px;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(15px);
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
}

.header-text {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 75px;
    font-weight: lighter;
    color: #fff;
    text-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.input-area {
    width: 100%;
    height: 160px;
    padding-top: 20px;
    padding-bottom: 20px;
}

.input-query {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    margin: 30px 0;
}

.input-select {
    border-color: transparent;
    height: 30px;
    width: 120px;
}

.input-with-select {
    width: 700px;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 20px;
    font-size: 20px;
    letter-spacing: 1px;
    color: #162938;
    font-weight: 400;
    padding: 0 35px 0 5px;
}

.btn-wrap {
    position: absolute;
    width: 65%;
    left: 50%;
    top: 125px;
    transform: translateX(-50%);
    height: 50px;
    margin: 30px 0;
}

.search-btn {
    width: 60%;
    height: 45px;
    border-radius: 6px;
    font-size: 25px;
    font-weight: bold;
}

.search-btn:hover {
    font-weight: bolder;
}

.super-search {
    position: absolute;
    left: 79%;
    top: 65px;
    font-size: 16px;
    transition: text-decoration 0.3s ease;
    cursor: pointer;
}

.super-search:hover {
    text-decoration: underline;
    font-weight: bold;
}

.toggle-search-up {
    position: absolute;
    top: 0;
    height: 50%;
    left: 96%;
    cursor: pointer;
}

.change-btn {
    height: 100%;
    border-radius: 0 35px 0 0;
    margin-left: 3px;
}

.toggle-search-down {
    position: absolute;
    top: 50%;
    height: 50%;
    left: 96%;
    cursor: pointer;
}

.advanced-btn {
    height: 100%;
    border-radius: 0 0 35px 0;
    margin-left: 3px;
}

.ai-button-text {
    position: absolute;
    right: 10px;
    top: 50px;
    font-size: 24px;
    font-weight: bold;
    font-style: italic;
    cursor: pointer;
}

.advanced-button-text {
    position: absolute;
    right: 3px;
    top: 42px;
    font-weight: bold;
    font-style: oblique;
    font-size: 18px;
    cursor: pointer;
}

:deep(.el-button, .el-button.is-round) {
    padding-top: 8px;
    padding-right: 20px;
    padding-bottom: 8px;
    padding-left: 20px;
}

.ai-area {
    position: absolute;
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
    /* padding-top: 60px; */
}

.ai-color {
    color: coral;
}

.info-section {
    position: absolute;
    display: flex;
    padding-top: -50px;
    width: 100%;
    height: 500px;
    background-color: pink;
}

.rank-table-wrap {
    display: flex;
    left: 20px;
    background-color: green;
    align-items: center;
    justify-content: center;
}

.rank-table {
    width: 250px;
}

.tabs {
    width: 80%;
    display: flex;
    justify-content: center;
}

:deep(.el-tabs__nav) {
    display: flex;
    justify-content: center;
    width: 100%;
}

:deep(.el-tabs__item.is-active) {
    font-weight: bold;
    color: #409EFF;
}

:deep(.el-main) {
    --el-main-padding: 0;
    box-sizing: border-box;
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: auto;
}

.info-right {
    width: 80%;
    margin-top: -20px;
}

.hot-header {
    height: 30px;
}

.card-content {
    box-shadow: none;
    transition: box-shadow 0.3s ease; /* 添加过渡效果，使阴影变化更平滑 */
    border: 1px solid #eaeaea;
    margin-bottom: 10px;
}

.card-content:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); /* 鼠标悬停时显示的阴影 */
}

:deep(.el-card__body) {
    padding: 0 0 0 10px;
    border-color: transparent;
    color: gray;
    font-size: 14px;
    text-align: left;
}

:deep(.el-card__footer) {
    border-color: transparent;
    font-size: 10px;
    text-align: left;
    font-style: italic;
    padding: 10px 0 15px 10px;
}

:deep(.el-card__header) {
    padding: 10px 20px 10px 20px;
}


.card-footer:hover {
    color: #2371ef;
    cursor: pointer;
}

.abstract {
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 设置显示最大行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

/*.card-footer {

}

.card-header {

}*/

.page-bottom {
    padding-top: -50px;
    /* background-color: #2371ef; */
}

/* 去掉表格内的分割线 */
:deep(.el-table) {
    border-radius: 10px; /* 添加圆角效果 */
    overflow: hidden; /* 防止内容溢出圆角 */
    border: none !important; /* 不显示表格的边框 */
}

:deep(.el-table .el-table__header) {
    display: none; /* 隐藏各列标题 */
}

:deep(.el-table th, .el-table td) {
    border: none !important; /* 不显示表头和单元格的边框 */
}

:deep(.el-tabs__item) {
    font-size: 20px;
}
</style>