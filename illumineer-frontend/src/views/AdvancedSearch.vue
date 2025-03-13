<template>
    <NavBar></NavBar>
    <div class="search-options">
        <!-- 高级搜索选项（可选） -->
        <el-button
            type="primary"
            :plain="false"
            class="option-button"
        >高级搜索</el-button
        >

        <!-- 其他选项（不可选） -->
        <el-button
            v-for="(option, index) in otherOptions"
            :key="index"
            type="text"
            class="option-button disabled-option"
            disabled
        >{{ option }}</el-button
        >
    </div>
    <div class="decoration"></div>
    <div class="search-area">
        <div class="search-container">
            <!-- 条目列表 -->
            <div v-for="(item, index) in entries" :key="item.id" class="entry-row">
                <!-- 逻辑关系选择器 -->
                <el-select v-if="index > 0" v-model="item.logic" placeholder="AND" class="entry-relation">
                    <el-option label="AND" value="1" />
                    <el-option label="OR" value="2" />
                    <el-option label="NOT" value="3" />
                </el-select>

                <!-- 属性选择器和输入框 -->
                <el-select v-model="item.condition" placeholder="选择属性" class="entry-attribute">
                    <el-option label="主题" value="theme" />
                    <el-option label="作者" value="auths" />
                    <el-option label="题目" value="title" />
                    <el-option label="关键词" value="keywords" />
                    <el-option label="领域" value="field" />
                </el-select>
                <el-input v-model="item.keyword" placeholder="请输入内容" class="entry-input" />

                <!-- + / - 按钮 -->
                <el-button @click="addEntry(index)" :icon="Plus" />
                <el-button v-if="entries.length > 1" @click="removeEntry(index)" :icon="Minus" />
            </div>

            <!-- 其他筛选条件 -->
            <div class="additional-filters">
                <!-- <el-checkbox-group v-model="filters">
                    <el-checkbox label="OA出版" />
                    <el-checkbox label="网络首发" />
                    <el-checkbox label="增强出版" />
                    <el-checkbox label="基金文献" />
                    <el-checkbox label="中英文扩展" />
                    <el-checkbox label="同义词扩展" />
                </el-checkbox-group> -->

                <!-- 时间范围选择器 -->
                <div class="date-range">
                    <label>时间范围：</label>
                    <el-date-picker v-model="dateRange" type="yearrange" start-placeholder="开始年份" end-placeholder="结束年份" />
                </div>
            </div>

            <!-- 检索按钮 -->
            <div class="search-buttons">
                <el-button @click="resetEntries">重置条件</el-button>
                <el-button type="primary" @click="search">检索</el-button>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer-instruction">
                <p>高级搜索使用方法</p>
            </div>
            <div class="footer-copyright">
                <p>高级检索支持使用运算符*、+、-、''、""、()进行同一检索项内多个检索词的组合运算，检索框内输入的内容不得超过120个字符。</p>
                <p>输入运算符*(与)、+(或)、-(非)时，前后要空一个字节，优先级需用英文半角括号确定。</p>
                <p>若检索词本身含空格或*、+、-、()、/、%、=等特殊符号，进行多词组合运算时，为避免歧义，须将检索词用英文半角单引号或英文半角双引号引起来。</p>
            </div>
        </div>
    </div>

    <div class="footer-social">
        <a href="/">
            <img src="../assets/logo.png" alt="" class="logo"/>
        </a>
    </div>

    <!-- Bottom Section -->
    <div class="footer-bottom">
        <div class="footer-info">
            <a href="#">关于我们</a> | <a href="#">CNKI 荣誉</a> | <a href="#">客服中心</a> | <a href="#">用户建议</a>
        </div>
        <div class="footer-copyright">
            <p>© 启研汇（Illumineer）</p>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import NavBar from "@/components/NavBar.vue";
import {Minus, Plus} from '@element-plus/icons-vue';
//import axios from "axios";

export default {
    name: "AdvancedSearch",
    computed: {
        Plus() {
            return Plus
        },
        Minus() {
            return Minus
        }
    },
    components: {
        NavBar,
    },
    data() {
        return {
            // 条目数据
            entries: [

            ],
            // 筛选条件和日期范围
            filters: [],
            dateRange: [],
            otherOptions: ['专业检索', '作者发文检索', '句子检索']
        };
    },
    created() {
        const defaultCondition = this.$route.query.condition || "";
        const defaultKeyword = this.$route.query.keyword || "";

        this.entries = [{
            id: 0,
            logic: "",
            condition: defaultCondition,
            keyword: defaultKeyword
        }]
    },
    methods: {
        // 添加条目
        addEntry(index) {
            this.entries.splice(index + 1, 0, {
                id: index + 1,
                logic: "1",
                condition: "",
                keyword: ""
            });
        },
        // 删除条目
        removeEntry(index) {
            this.entries.splice(index, 1);
        },
        // 重置条目
        resetEntries() {
            this.entries.splice(1);
            Object.assign(this.entries[0], {
                logic: "",
                condition: "",
                keyword: ""
            });
            this.filters = [];
            this.dateRange = [];
        },
        // 执行检索
        async search() {
            if (this.entries.some(entry => !entry.condition || !entry.keyword)) {
                ElMessage.error("请确保所有条目都已选择属性并输入内容");
                return;
            }
            console.log("检索条件：", {
                entries: this.entries,
                filters: this.filters,
                dateRange: this.dateRange
            });
            /*try {
                const response = await axios.post("api/search", {
                    type: 3,
                    entries: this.entries,
                    dataRange: this.dateRange,
                    filters: this.filters
                });
                console.log("respond:", response.data);

                this.$store.commit('setSearchResults', response.data);

                this.$router.push({ name: 'searchResult' });
                ElMessage.success("检索成功");
            } catch (e) {
                console.error("fail:", e);
                ElMessage.error("检索失败，请重试");
            }
            ElMessage.success("检索成功");*/
            const logicArray = this.entries.map(entry => entry.logic || "0");
            const conditionArray = this.entries.map(entry => entry.condition);
            const keywordArray = this.entries.map(entry => entry.keyword);
            this.$router.push({path:'/searchResult', query:{searchType:1, logic: logicArray, condition: conditionArray
                    , keyword: keywordArray, time: this.dateRange}});
            console.log("检索条件：", {
                logic: logicArray,
                condition: conditionArray,
                keyword: keywordArray
            });
        }
    }
};
</script>

<style scoped>
.search-area {
    background-color: #f3f3f3;
}

.search-container {
    padding: 20px 40px 20px 40px;
}

.entry-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.entry-relation {
    width: 120px;
    margin-right: 10px;
}

.entry-attribute {
    width: 150px;
    margin-right: 10px;
}

.entry-input {
    flex-grow: 1;
    margin-right: 10px;
}

.entry-accuracy {
    width: 80px;
    margin-right: 10px;
}

.additional-filters {
    margin-top: 15px;
}

.date-range {
    margin-top: 10px;
}

.search-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.footer-bottom {
    margin-top: 20px;
    text-align: center;
    color: #999;
    font-size: 12px;
}

.footer-instruction p{
    font-size: 16px;
    font-weight: bold;
}

.footer-social {
    margin-top: 20px;
    font-size: 24px;
    color: #666;
}

.logo {
    height: 120px; /* 你可以根据需要调整最大高度 */
    object-fit: contain;
}

.footer-bottom {
    margin-top: 20px;
    padding-bottom: 10px;
    text-align: center;
    color: #999;
    font-size: 12px;
}

.search-options {
    padding-top: 10px;
    padding-left: 75px;
    display: flex;
    align-items: center;
    gap: 50px;
    height: 30px;
}

.option-button {
    border-radius: 4px 4px 0 0;
    padding: 8px 16px;
    font-size: 16px;
    border: 0;
    background-color: var(--v_overall_blue);
}

.disabled-option {
    color: #666; /* 灰色 */
    cursor: not-allowed;
}

.settings {
    margin-left: auto;
    color: var(--v_overall_blue);
    cursor: pointer;
}

.decoration {
    height: 4px;
    background-color: var(--v_overall_blue);
}
</style>