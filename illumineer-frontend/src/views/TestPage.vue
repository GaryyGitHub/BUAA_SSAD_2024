<template>
    <NavBar></NavBar>
    <div class="homepage">
        <!-- 中心内容区域 -->
        <main class="content">
            <div class="text-section">
                <h1 class="headline">Illumineer 启研汇</h1>
                <p class="subtitle">
                    启研汇 -- 让研究从这里开启<br />
                    从智能搜索到学者入驻，构建专业的学术成果分享平台<br />
                    汇聚全球学术资源，构建专业交流桥梁——这里是学术研究的新起点。
                </p>

                <!-- 搜索框 -->
                <div class="search-bar">
                    <!-- <el-select v-model="searchType" class="search-type" placeholder="论文">
                        <el-option label="论文" value="论文"></el-option>
                        <el-option label="学者" value="学者"></el-option>
                        <el-option label="期刊" value="期刊"></el-option>
                        <el-option label="机构" value="机构"></el-option>
                        <el-option label="领域" value="领域"></el-option>
                    </el-select> -->
                    <!-- <el-input v-model="searchQuery" placeholder="搜索" class="search-input">
                    </el-input> -->
                    <div v-if="selectedSection===2 || selectedSection === 3" class="input-query">
                        <!-- <el-input
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
                        </el-input> -->
                        <el-select v-model="value" class="search-type" placeholder="关键词">
                            <el-option label="关键词" value=""></el-option>
                            <el-option label="主题" value="theme"></el-option>
                            <el-option label="题目" value="title"></el-option>
                            <el-option label="领域" value="field"></el-option>
                            <el-option label="作者" value="auths"></el-option>
                        </el-select>
                        <el-autocomplete
                            v-model="input"
                            :fetch-suggestions="onSearchInput"
                            placeholder="搜索"
                            :trigger-on-focus="false"
                            @select="onSelect"
                            class="autocomplete-input"
                        >
                        </el-autocomplete>
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
                        maxlength="1000"
                    />
                </div>

                <ResizableSections @update-selected="handleSelectionUpdate" @section-clicked="search"/>

                <!-- 统计数据展示 -->
                <div class="stats">
                    <div class="stat-item">
                        <el-icon><Memo /></el-icon>
                        <p>论文</p>
                        <h3>945,397</h3>
                    </div>
                    <div class="stat-item">
                        <el-icon><Avatar /></el-icon>
                        <p>报告</p>
                        <h3>213,956</h3>
                    </div>
                    <div class="stat-item">
                        <el-icon><Collection /></el-icon>
                        <p>书摘</p>
                        <h3>266,277</h3>
                    </div>
                    <div class="stat-item">
                        <el-icon><House /></el-icon>
                        <p>概览</p>
                        <h3>38,928</h3>
                    </div>
                    <div class="stat-item">
                        <el-icon><Platform /></el-icon>
                        <p>领域</p>
                        <h3>4713</h3>
                    </div>
                </div>
            </div>
        </main>

        <!-- 背景图片 -->
        <div class="background">
            <img class="earth-image" src="../assets/ae.gif" alt="Earth" />
        </div>



        <!-- 悬停弹出窗口 -->
        <div class="btn">
            <!-- 右箭头按钮 -->
            <div
                class="arrow-btn"
                :class="{ bounce: isHovered }"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
                @click="toggleDrawer"
            >
                <el-icon class="arrow"><arrow-left /></el-icon>
            </div>

            <!-- 弹出窗口 -->
            <el-drawer
                v-model="drawerVisible"
                direction="rtl"
                size="50%"
                :with-header="false"
                class="custom-drawer"
            >
                <div class="drawer-content">
                    <!-- 当前日期 -->
                    <div class="date-display">
                        Up to {{ currentDate }}
                        <div class="underline"></div>
                    </div>
                    <!-- 嵌入的页面 -->
                    <el-container style="align-items: center">
                        <!-- 内容部分 -->
                        <el-main class="info-right">
                            <el-row>
                                <!-- 左侧热门 -->
                                <el-col :span="12" style="padding: 10px;" class="column">
                                    <h3 class="hot-header">热门文献</h3>
                                    <div class="scrollable-content">
                                        <el-card v-for="item in hotItems" :key="item.id" class="card-content" shadow="never" @click="openNewPage(`/article/${item.pid}/`);">
                                            <template #header>
                                                <div class="card-header">
                                                    <span>{{item.title}}</span>
                                                </div>
                                            </template>
                                            <p class="abstract">{{ item.abs }}</p>
                                            <template #footer>
                                                <div class="card-footer">{{item.author}}</div>
                                                <div class="keyword">{{item.keywords}}</div>
                                            </template>
                                        </el-card>
                                    </div>
                                </el-col>

                                <!-- 右侧为你推荐 -->
                                <el-col :span="12" style="padding: 10px;" class="column">
                                    <h3 class="hot-header">为你推荐</h3>
                                    <div class="scrollable-content">
                                        <el-card v-for="item in recommendedItems" :key="item.id" class="card-content" shadow="never" @click="openNewPage(`/article/${item.pid}/`);">
                                            <template #header>
                                                <div class="card-header">
                                                    <span>{{item.title}}</span>
                                                </div>
                                            </template>
                                            <p class="abstract">{{ item.abs }}</p>
                                            <template #footer>
                                                <div class="card-footer">{{item.author}}</div>
                                                <div class="keyword">{{item.keywords}}</div>
                                            </template>
                                        </el-card>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-container>
                </div>
            </el-drawer>
        </div>
    </div>
    <!-- <div class="page-bottom">
        <FooterBar />
    </div> -->

</template>

<script>
import {ArrowLeft} from "@element-plus/icons-vue";
import NavBar from '@/components/NavBar.vue';
// import FooterBar from "@/components/FooterBar.vue";
import ResizableSections from "./TestComponent.vue"

export default {
    components: {
        ArrowLeft,
        NavBar,
        // FooterBar,
        ResizableSections
    },
    data() {
        return {
            input: '',
            value: '',
            AIArea: '',
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
            showPopup: false,
            popupHovered: false,
            drawerVisible: false,
            isHovered: false,
            currentDate: new Date().toLocaleDateString(),
            hotItems: [
                { id: 1, title: "", author: "", abs: '', keywords: "", pid: ''},
            ],
            recommendedItems: [
                { id: 1, title: "" , author: "", abs: '', keywords: "", pid: ''},
            ],
            selectedSection: 2,
        };
    },
    methods: {
        async onSearchInput(query, callback) {
            if (query.length > 2) { // 输入长度达到一定数量时才开始请求
                try {
                // 调用后端接口获取推荐数据
                    const response = await this.$api.get('/user/search/word/get', {
                        params: { keyword: query },
                    });
                    // 调用 Element Plus 的 callback 返回建议列表
                    callback(response.data.data.map(item => ({ value: item })));
                    console.log('Suggestions:', response.data.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                callback([]); // 如果输入少于 3 个字符，则清空推荐
            }
        },
            // 选择推荐项时的处理
        onSelect(item) {
            this.input = item.value; // 将选中的内容填充到输入框
            console.log('选中的推荐项:', item);
        },
        handleSelectionUpdate(index) {
            this.selectedSection = index;
        },
        toggleDrawer() {
            this.drawerVisible = !this.drawerVisible;
        },
        onMouseEnter() {
            this.isHovered = true;
        },
        onMouseLeave() {
            this.isHovered = false;
        },
        handleTabClick(tab) {
            console.log("Tab clicked:", tab);
        },
        async search() {
            console.log(this.value, this.input);
            if (this.selectedSection === 2) {
                if(this.value === '') {
                    this.$router.push({path:'/searchResult', query:{searchType:0, keyword:this.input, condition: 'keywords'}});
                } else {
                    this.$router.push({path:'/searchResult', query:{searchType:0, keyword:this.input, condition: this.value}});
                }
            } else if (this.selectedSection === 1) {
                this.$router.push({path:'/searchResult', query:{searchType:2, query: this.AIArea}});
            } else {
                if(this.value === '' && this.input === '') {
                    console.log("1111");
                    this.$router.push({path:'/advancedSearch', query:{searchType:0, keyword:this.input, condition: this.value}});
                } else if (this.value === ''){
                    console.log("2222");
                    this.$router.push({path:'/advancedSearch', query:{searchType:0, keyword:this.input, condition: "keyword"}});
                } else {
                    console.log("3333")
                    this.$router.push({path:'/advancedSearch', query:{searchType:0, keyword:this.input, condition: this.value}});
                }
            }
        },
        async getHotList() {
            const response = await this.$api.get(`/document/get/recommend`, {
                params: {num : 10}
            })
            const data = response.data.data;

            this.hotItems = data.map((item, index) => {
                const authors = JSON.parse(item.auths || '{}');
                const firstAuth = Object.keys(authors)[0] || '';
                return {
                    id: index + 1,
                    title: item.title || '',
                    //abs: item.abs || '',
                    keywords: item.keywords.replace(/[[\]"]/g, ''),
                    author: firstAuth,
                    pid: item.pid,
                    abs: item.essAbs,
                };
            });
        },
        async getRecList() {
            const response = await this.$api.get(`/document/get/recommend`, {
                params: {num : 5}
            })
            const data = response.data.data;

            this.recommendedItems = data.map((item, index) => {
                const authors = JSON.parse(item.auths || '{}');
                const firstAuth = Object.keys(authors)[0] || '';
                return {
                    id: index + 1,
                    title: item.title || '',
                    //abs: item.abs || '',
                    keywords: item.keywords.replace(/[[\]"]/g, ''),
                    author: firstAuth,
                    pid: item.pid,
                    abs: item.essAbs
                };
            });
        },
        openNewPage(path) {
            window.open(path, '_blank');
        }
    },
    async created() {
        await this.getHotList();
        await this.getRecList();
    }
};
</script>

<style scoped>
.homepage {
    font-family: 'Arial', sans-serif;
    color: white;
    background-color: #000307;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    box-shadow: 0 -10px #000307;
}

.navbar {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem;
    background-color: transparent;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.title {
    font-size: 1.2rem;
}

.content {
    flex: 1;
    padding: 3rem 2rem;
}

.text-section {
    text-align: left;
    width: 55%;
    padding-left: 1rem;
}

.headline {
    font-size: 5rem;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.subtitle {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    padding-top: 20px;
    font-weight: bolder;
}

.subtitle {
    color: white; /* 霓虹灯颜色 */
    text-shadow: 0 0 10px #2371ef, 0 0 20px #2371ef, 0 0 30px #2371ef, 0 0 40px #2371ef;
    animation: blink 4s infinite;
}

@keyframes blink {
    0%, 100% {
        text-shadow: 0 0 10px #2371ef, 0 0 20px #2371ef, 0 0 30px #2371ef, 0 0 40px #2371ef;
        opacity: 1;
    }
    50% {
        text-shadow: 0 0 0px #2371ef, 0 0 2px #2371ef, 0 0 4px #2371ef, 0 0 6px #2371ef;
        opacity: 1;
    }
}

.search-bar {
    padding-top: 7rem;
    padding-bottom: 1rem;
    display: flex;
}

.search-type {
    margin-right: 1rem;
    width: 8rem;
}

.ai-area {
    width: 500px;
}

.search-input {
    width: 48rem;
    height: 33px;
}

.stats {
    display: flex;
    gap: 6rem;
    padding-left: 2.5rem;
    padding-top: 10rem;
    width: 50px;
}

.stat-item {
    text-align: center;
}

.stat-item i {
    font-size: 25px;
}

.stat-item p {
    margin-top: 0;
    font-weight: bolder;
    text-shadow: 0 0 10px #2371ef, 0 0 20px #2371ef, 0 0 30px #2371ef, 0 0 40px #2371ef;
    font-size: 12px;
}

.stat-item h3 {
    font-size: 16px;
    text-shadow: 0 0 10px #2371ef, 0 0 20px #2371ef, 0 0 30px #2371ef, 0 0 40px #2371ef;
    margin-top: -0.5rem;
}

.background {
    position: absolute;
    top: -10%;
    right: -30%;
    width: 1280px;
    height: 1060px;
    overflow: visible;
}

.earth-image {
    width: 100%;
    height: 100%;
    transform: rotate(270deg);
    object-fit: cover;
}

.popup {
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 2rem;
    display: flex;
    gap: 2rem;
    flex-direction: row;
}

.popup-column {
    flex: 1;
}

.popup-column h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.popup-column ul {
    list-style: none;
    padding: 0;
}

.popup-column ul li {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.arrow-btn {
    position: absolute;
    top: 42%;
    right: -10px;
    width: 60px;
    height: 140px;
    font-size: 50px;
    font-weight: bolder;
    background-color: transparent;
    color: white;
    display: flex;
    justify-content: left;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s;
    border-radius: 5px 0 0 5px;
}

.arrow-btn.bounce {
    transform: translateX(-10px);
}

.drawer-content {
    display: flex;
    flex-direction: column;
}

.date-display {
    padding-top: 20px;
    font-size: 24px;
    font-weight: bolder;
    font-style: italic;
    color: #e9e9f8;
}

.hot-header {
    height: 30px;
    color: #e9e9f8;
    margin-block-end: 10px;
    margin-block-start: 0;
}


.scrollable-content {
    max-height: 750px;
    overflow-y: auto;
    border-radius: 4px;
}

/* 自定义滚动条样式（可选） */
.scrollable-content::-webkit-scrollbar {
    width: 20px;
}

.scrollable-content::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.card-content {
    box-shadow: none;
    transition: box-shadow 0.3s ease; /* 添加过渡效果，使阴影变化更平滑 */
    border: 1px solid #eaeaea;
    margin-bottom: 15px;
    background-color: #000210;
    cursor: pointer;
}

.card-content:hover {
    box-shadow: 0 5px 12px #543224; /* 鼠标悬停时显示的阴影 */
}

.card-footer {
    color: #8f8d8d;
    text-align: left;
}

.card-footer:hover {
    color: #2371ef;
    cursor: pointer;
}

.keyword {
    color: #2371ef;
    text-align: right;
}

.abstract {
    display: -webkit-box;
    -webkit-line-clamp: 6; /* 设置显示最大行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.underline {
    position: absolute;
    height: 2px;
    top: 53px;
    width: 22%;
    left: 39%;
    opacity: 0.8;
    background-color: whitesmoke;
    box-shadow: 0 4px 4px #bb4a02;
}

.input-query {
    display: flex;
    width: 900px;
    height: 50px;
}

.input-select {
    border-color: transparent;
    height: 40px;
    width: 200px;
}

.input-with-select {
    width: 900px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 20px;
    font-size: 18px;
    letter-spacing: 1px;
    color: #162938;
    font-weight: 400;
    padding: 0 35px 0 5px;
}

:deep(.el-card__body) {
    padding: 0 10px 0 10px;
    border-color: transparent;
    color: whitesmoke;
    font-size: 12px;
    text-align: left;
}

:deep(.el-card__footer) {
    border-color: transparent;
    font-size: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-style: italic;
    padding: 0 10px 5px 10px;
}

:deep(.el-card__header) {
    padding: 10px 20px 10px 20px;
    font-weight: bolder;
    color: whitesmoke;
}

:deep(.el-select__wrapper) {
    border-radius: 16px 6px 6px 16px;
}

:deep(.el-drawer) {
    background-color: transparent;
}

:deep(.el-drawer__body) {
    background-color: #000307;
    border-radius: 6px;
    padding: 10px 0 0 0;
}

:deep(.el-main) {
    padding: 10px 5px 5px 5px;
}

:deep(.el-textarea__inner) {
    width: 56rem;
    font-size: 14px;
}

</style>