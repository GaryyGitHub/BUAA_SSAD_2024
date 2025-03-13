<template>
  <NavBar></NavBar>
  <el-container>
    <el-header>
      <div class="search-bar-container" v-if="!isAiSearch">
        <div class="search-bar">
          <!-- 可选条件 -->
          <el-select v-model="condition" placeholder="请选择" class="search-condition">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>

          <el-autocomplete
            v-model="keyword"
            :fetch-suggestions="onSearchInput"
            placeholder="请输入搜索内容"
            :trigger-on-focus="false"
            @select="onSelect"
            class="autocomplete-input"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon :size="16"><Search /></el-icon>
              </el-button>
            </template>
          </el-autocomplete>
        </div>
      </div>
    </el-header>
    <el-container>
      <!-- 侧栏 -->
      <el-aside width="300px" style="margin-top: 20px;">
        <el-text size="large" tag="p" style="margin-bottom: 10px;">筛选条件</el-text>
        <el-collapse>
          <!-- 筛选类别：年份 -->
          <el-collapse-item name="1">
            <template #title>
              <span style="padding-left: 50px;font-size: 14px;">年份</span>
            </template>
            <el-checkbox-group v-model="selectedYears" class="checkbox-group-vertical">
              <el-checkbox v-for="year in sortedYears" :label="year" :key="year">
                <span>{{ year }} ({{ years[year] }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>

          <!-- 筛选类别：来源 -->
          <el-collapse-item name="2">
            <template #title>
              <span style="padding-left: 50px;font-size: 14px;">来源</span>
            </template>
            <el-checkbox-group v-model="selectedSources" class="checkbox-group-vertical">
              <el-checkbox v-for="source in sortedSources" :label="source" :key="source">
                <span>{{ source }} ({{ sources[source] }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>

          <!-- 筛选类别：类型 -->
          <el-collapse-item name="3">
            <template #title>
              <span style="padding-left: 50px;font-size: 14px;">类型</span>
            </template>
            <el-checkbox-group v-model="selectedTypes" class="checkbox-group-vertical">
              <el-checkbox v-for="type in sortedTypes" :label="type" :key="type">
                <span>{{ type }} ({{ types[type] }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>

          <!-- 筛选类别：主题 -->
          <el-collapse-item name="4">
            <template #title>
              <span style="padding-left: 50px;font-size: 14px;">主题</span>
            </template>
            <el-checkbox-group v-model="selectedSubjects" class="checkbox-group-vertical">
              <el-checkbox v-for="subject in sortedSubjects" :label="subject" :key="subject">
                <span>{{ subject }} ({{ subjects[subject] }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
        <el-table ref="table" v-loading="loading" element-loading-text="正在加载数据..." :data="documentList" style="width: 100%" @sort-change="handleSort" >
          <el-table-column prop="title" label="文献标题" width="300"  align="center"></el-table-column>
          <el-table-column prop="auths" label="作者" align="center">
            <template #default="{ row }">
              <!-- 循环显示所有作者，并在作者之间添加逗号 -->
              <span v-for="(id, name, index) in row.auths" :key="id">
                <span v-if="id != 0" @click="handleAuthorClick(id)" style="color: blue;cursor: pointer;">
                  {{ name }}
                </span>
                <span v-else>
                  {{ name }}
                </span>
                <!-- 添加逗号，避免最后一个作者后面有逗号 -->
                <span v-if="index < Object.keys(row.auths).length - 1">, </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="derivation" label="来源" align="center"></el-table-column>
          <el-table-column prop="publishDate" label="发表时间" align="center" sortable :formatter="formatDate"></el-table-column>
          <el-table-column prop="refTimes" label="被引量" width="100" align="center" sortable></el-table-column>
          <el-table-column prop="favTime" label="收藏量" width="100" align="center" sortable></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-tooltip content="查看" placement="top">
                <el-button @click="handleView(scope.row)" icon="View" type="text"></el-button>
              </el-tooltip>
              <el-tooltip content="下载" placement="top">
                <el-button @click="handleDownload(scope.row)" icon="Download" type="text"></el-button>
              </el-tooltip>
              <el-tooltip content="引用" placement="top">
                <el-button @click="handleCitation(scope.row)" icon="Document" type="text"></el-button>
              </el-tooltip>
              <el-tooltip content="收藏" placement="top">
                <el-button @click="handleFavorite(scope.row)" icon="Star" type="text"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="offset"
          :page-size="size"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-left: 20px; margin-top: 10px;">
        </el-pagination>
      </el-main>
      <!-- 引用格式弹窗 -->
      <el-dialog v-model="citationVisible" title="引用" width="800">
        <div style="text-align: left; ">
            <p><strong>GB/T 7714-2015 引用格式：</strong>{{ citationFormat.gbt }}</p>
            <p><strong>MLA 引用格式：</strong> {{ citationFormat.mla }}</p>
            <p><strong>APA 引用格式：</strong> {{ citationFormat.apa }}</p>
        </div>
      </el-dialog>
      <!-- 收藏夹选择和新建收藏夹的弹窗 -->
      <el-dialog
        title="选择收藏夹"
        v-model="dialogVisible"
        width="600"
      >
        <el-checkbox-group v-model="selectedFolderIds">
          <el-checkbox 
            v-for="(value,key) in folders" 
            :key="key" 
            :label="key">
            {{ value }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 新建收藏夹的输入框 -->
        <div v-if="isCreatingNewFolder">
          <el-input
            v-model="newFolderTitle"
            placeholder="请输入新收藏夹名称"
          ></el-input>
        </div>

        <template #footer>
          <!-- 新建收藏夹按钮 -->
          <el-button
            v-if="!isCreatingNewFolder"
            @click="startNewFolder"
            type="primary"
          >
            新建收藏夹
          </el-button>
          <el-button @click="dialogVisible = false" v-if="!isCreatingNewFolder">取消</el-button>
          <el-button
            type="primary"
            @click="handleConfirm"
            v-if="!isCreatingNewFolder"
            :disabled="!selectedFolderIds"
          >
            确认
          </el-button>
          <el-button
            type="primary"
            @click="isCreatingNewFolder = false"
            v-if="isCreatingNewFolder"
          >
            返回
          </el-button>
          <el-button
            type="primary"
            @click="creatNewFolder"
            v-if="isCreatingNewFolder"
            :disabled="!newFolderTitle"
          >
            新建
          </el-button>
        </template>
      </el-dialog>
      <!-- 下载弹窗 -->
      <el-dialog v-model="isDownload" title="提示">
        <p>暂无下载链接</p>
        <template #footer>
          <el-button @click="isDownload = false" style="padding: 5px 10px;">关闭</el-button>
        </template>
      </el-dialog>
    </el-container>
  </el-container>
  
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { ElMessage } from 'element-plus';
export default {
  components: {
        NavBar
  },
  data() {
    return {
      //加载ing
      loading: false,
      // 检索
      condition: 'theme',  // 选中的搜索条件
      keyword: '' ,        // 搜索的关键词
      advancedLogic: [],        // 逻辑关系
      advancedCondition: [],  // 高级搜索条件
      advancedKeyword: [],  // 高级搜索关键词
      isAiSearch: false,  // 是否使用 AI 检索
      options: [
        {
          value: 'theme',
          label: '主题',
        },
        {
          value: 'keywords',
          label: '关键词',
        },
        {
          value: 'title',
          label: '篇名',
        },
        {
          value: 'field',
          label: '领域',
        },
        {
          value: 'auths',
          label: '作者',
        }
      ],
      //筛选
      years: [],
      sources: [],
      types: [],
      subjects: [],
      selectedYears: [],
      selectedSources: [],
      selectedTypes: [],
      selectedSubjects: [],
      //分页
      offset: 1,
      size: 10,
      total: 0,
      //排序
      sortType: 1,
      order: 0,
      // 文献列表
      documentList: [],
      // 引用弹窗相关数据
      citationVisible: false,
      citationFormat: {
        gbt: '',
        mla: '',
        apa: ''
      },
      // 收藏夹相关数据
      dialogVisible: false,
      isCreatingNewFolder: false,
      newFolderTitle: '',
      selectedFolderIds: [],
      folders: [],
      // 下载
      isDownload: false,
    };
  },
  methods: {
    //搜索推荐
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
      this.keyword = item.value; // 将选中的内容填充到输入框
      console.log('选中的推荐项:', item);
    },
    //获取文献列表
    async fetchDocumentList() {
      this.loading = true;
      this.$router.push({
        path: '/searchResult', // 路径
        query: {
          searchType: 0,
          keyword: this.keyword,
          condition:this.condition
        }
      });
      try {
        //像后端/search发送get请求，字段为condition，keyword，size，offset，type，order，并console他们的值
        console.log("搜索条件：", this.condition);
        console.log("搜索关键词：", this.keyword);
        console.log("每页数量：", this.size);
        console.log("页码：", this.offset);
        console.log("排序类型：", this.sortType);
        console.log("排序顺序：", this.order);
        const response = await this.$api.get('/document/get/keyword', {
          params: {
            condition: this.condition,
            keyword: this.keyword,
            size: this.size,
            offset: this.offset,
            sortType: this.sortType,
            order: this.order
          }
        });
        this.documentList = response.data.data.result; // 假设返回的数据格式为 { documents: [...] }
        this.total = response.data.data.total; // 假设返回的数据格式为 { total: 1000 }
        this.years = response.data.data.options.years;
        this.sortedYears = Object.entries(this.years).sort((a, b) => b[1] - a[1]).map(entry => entry[0]); 
        this.sources = response.data.data.options.derivations;
        this.sortedSources = Object.entries(this.sources).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        this.types = response.data.data.options.types;
        this.sortedTypes = Object.entries(this.types).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        this.subjects = response.data.data.options.themes;
        this.sortedSubjects = Object.entries(this.subjects).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        console.log("作者列表：", this.documentList[0].auths);
        const formData = new FormData();
        formData.append("keyword", this.keyword);
        await this.$api.post('/user/search/word/add', formData);
      } catch (error) {
        console.error('获取文献列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchAiDocumentList() {
      this.loading = true;
      try {
        const airesponse = await this.$api.get('/document/AI/generateKeywords', {
          params: {
            query: this.query,
          }
        }); // 替换为你的接口路径
        console.log(airesponse.data.data);
        const response = await this.$api.get('/document/get/keyword', {
          params: {
            condition: "keywords",
            keyword: airesponse.data.data[0],
            size: this.size,
            offset: this.offset,
            sortType: this.sortType,
            order: this.order
          }
        });
        
        this.documentList = response.data.data.result; // 假设返回的数据格式为 { documents: [...] }
        this.total = response.data.data.total; // 假设返回的数据格式为 { total: 1000 }
        this.years = response.data.data.options.years;
        this.sortedYears = Object.entries(this.years).sort((a, b) => b[1] - a[1]).map(entry => entry[0]); 
        this.sources = response.data.data.options.derivations;
        this.sortedSources = Object.entries(this.sources).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        this.types = response.data.data.options.types;
        this.sortedTypes = Object.entries(this.types).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        this.subjects = response.data.data.options.themes;
        this.sortedSubjects = Object.entries(this.subjects).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        // 解析年份、来源、类型、主题的集合
      } catch (error) {
        console.error('获取文献列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchAdvancedDocumentList() {
      this.loading = true;
      try {
        console.log("搜索条件：", this.advancedLogic);
        console.log("高级检索条件：", this.advancedCondition);
        console.log("高级检索关键词：", this.advancedKeyword);
        
        const response = await this.$api.get('/document/get/advanced', {
          params: {
            logic: this.advancedLogic.join(','),
            condition: this.advancedCondition.join(','),
            keyword: this.advancedKeyword.join(','),
            size: this.size,
            offset: this.offset,
            sortType: this.sortType,
            order: this.order,
          }
        }); // 替换为你的接口路径
        this.documentList = response.data.data.result; // 假设返回的数据格式为 { documents: [...] }
        this.total = response.data.data.total; // 假设返回的数据格式为 { total: 1000 }
        this.years = response.data.data.options.years;
        this.sortedYears = Object.entries(this.years).sort((a, b) => b[1] - a[1]).map(entry => entry[0]); 
        this.sources = response.data.data.options.derivations;
        this.sortedSources = Object.entries(this.sources).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        this.types = response.data.data.options.types;
        this.sortedTypes = Object.entries(this.types).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
        this.subjects = response.data.data.options.themes;
        this.sortedSubjects = Object.entries(this.subjects).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
      } catch (error) {
        console.error('获取文献列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.fetchDocumentList();
    },
    //排序
    handleSort({prop, order}) {
      this.order = order === 'ascending'? 1 : 0;
      if(prop === 'publishDate'){
        this.sortType = 1;
      }else if(prop === 'refTimes'){
        this.sortType = 2;
      }else if(prop === 'favTime'){
        this.sortType = 3;
      }
      this.updatePapers();
      
    },
    //分页
    handleCurrentChange(newPage) {
      this.offset = newPage;
      this.updatePapers();
    },
    handleSizeChange(newSize) {
      this.size = newSize;
      this.updatePapers();
    },
    //文献操作
    handleView(row) {
      // 查看文献
      this.$router.push({name: 'article', params: {id: row.pid}});
    },
    handleDownload(row) {
      // 下载文献
      if(!this.$store.getters.isLoggedIn){
        ElMessage.error('请登录后再下载');
        return;
      }
      const url = row.contentUrl;
      console.log(url);
      if(!url){
        console.log("没有下载链接");
        this.isDownload = true;
      }else{
        const link = document.createElement('a');
        link.href = url;
        link.download = row.contentUrl + ".pdf";
        this.updateDownloadHistory(row.pid);
        link.click();
        //window.location.href = url;
        
      }    
    },
    updateDownloadHistory(pid) {
      try{
        const formData = new FormData();
        formData.append('pid', pid);
        this.$api.post('/user/history/update', formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.$store.getters.getToken}`
          }
        })
        .then(response => {
          console.log('历史记录更新成功', response.data);
        })
        .catch(error => {
          console.error('更新历史记录失败', error);
        });
      }catch(error){
        console.error('更新历史记录失败', error);
      }
    },
    handleCitation(row) {
      // 引用文献
      // 获取 Map 中的所有作者名
      // 获取作者名字数组
      let authors = row.auths ? Object.keys(row.auths) : [];
      
      // 格式化作者列表
      let formattedAuthors = authors.length > 1 
        ? `${authors.slice(0, authors.length - 1).join(", ")} and ${authors[authors.length - 1]}`
        : authors[0] || 'Unknown Author'; // 如果没有作者，显示默认值

      // 格式化日期
      let publishDate = row.publishDate ? new Date(row.publishDate) : null;
      let formattedDate = publishDate && !isNaN(publishDate.getTime()) 
        ? `${publishDate.getFullYear()}-${String(publishDate.getMonth() + 1).padStart(2, '0')}-${String(publishDate.getDate()).padStart(2, '0')}` 
        : 'Unknown Date'; // 如果日期格式不正确，显示默认值
      // 生成引用格式
      console.log(row.source);
      this.citationFormat.gbt = `[1] ${formattedAuthors}. ${row.title}[J]. ${row.derivation}, ${formattedDate}.`;
      this.citationFormat.mla = `[1] ${formattedAuthors}. "${row.title}." ${row.derivation}, ${formattedDate}.`;
      this.citationFormat.apa = `[1] ${formattedAuthors} (${formattedDate}). ${row.title}. ${row.derivation}.`;

      this.citationVisible = true;
    },
    handleFavorite(row) {
      if(!this.$store.getters.isLoggedIn){
        ElMessage.warning('请登录后再收藏');
        return;
      }
      this.pid = row.pid;
      console.log(this.pid);
      this.getAllFolders();
      this.dialogVisible = true;
    },
    async getAllFolders(){
      try {
        const response = await this.$api.get('/user/fav/pidInUserFav',{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
          },
          params: {
            pid: this.pid
          }
        });
        this.folders = response.data.data.UserFavs;
        this.selectedFolderIds = response.data.data.pidInFavs.map(String);
         
        this.folders = Object.fromEntries(this.folders);
      } catch (error) {
        console.error('获取收藏夹列表失败:', error);
      }
    },
    async handleConfirm(){
      const formData= new FormData();
      formData.append('pid',this.pid);
      formData.append('fids',this.selectedFolderIds);
      await this.$api.post('/user/fav/Batch', formData,{
        headers: {
          'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
        },
      });
      this.dialogVisible = false;
    },
    startNewFolder() {
      this.isCreatingNewFolder = true;
    },
    async creatNewFolder(){
      try {
        const formData= new FormData();
        formData.append('favName',this.newFolderTitle);
        await this.$api.post('/user/fav/createFav', formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
          },
        });
        this.getAllFolders();
        this.isCreatingNewFolder = false;
      } catch (error) {
        console.error('创建收藏夹失败:', error);
      }
    },
    //筛选
    async updatePapers() {
      // 根据当前筛选条件更新文献列表
      this.loading = true;
      try {
        console.log(this.selectedYears);
        const queryParams = new URLSearchParams({
          size: this.size,             // 页大小
          offset: this.offset,         // 页偏移量
          sortType: this.sortType,         // 排序类型
          order: this.order            // 排序顺序
        }).toString();

        const filterCondition = {
          year: this.selectedYears,    // 年份过滤条件
          derivation: this.selectedSources,  // 来源过滤条件
          type: this.selectedTypes,    // 类型过滤条件
          theme: this.selectedSubjects // 主题过滤条件
        };
        const response = await this.$api.post(`/document/get/filter?${queryParams}`, filterCondition);
        this.documentList = response.data.data.resultPapers; // 更新文献列表
        this.total = response.data.data.total; // 更新总数量
      } catch (error) {
        console.error('更新文献列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(row, column, cellValue) {
      const date = new Date(cellValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    handleAuthorClick(id) {
      this.$router.push(`/scholarInfo/${id}/scholarHome/`);
      
    },
    printSelectedFolderIds() {
      console.log(this.selectedFolderIds);
    }
  },
  mounted() {
    console.log(this.$route.query);
    const searchType = this.$route.query.searchType;
    switch(searchType){
      case '0':
        this.condition = this.$route.query.condition;
        this.keyword = this.$route.query.keyword;
        this.fetchDocumentList();
        break;
      case '1':
        this.advancedLogic = this.$route.query.logic;
        this.advancedCondition = this.$route.query.condition;
        this.advancedKeyword = this.$route.query.keyword;
        this.fetchAdvancedDocumentList();
        this.isAiSearch= true;
        break;
      case '2':
        this.query = this.$route.query.query;
        this.isAiSearch = true;
        this.fetchAiDocumentList();
        break;
      default:
        this.errorMessage = '无效的查询类型';
        break;
    }
  },
  watch: {
    // 监听筛选条件变化
    selectedYears: 'updatePapers',
    selectedFolderIds: 'printSelectedFolderIds',
    selectedSources: 'updatePapers',
    selectedTypes: 'updatePapers',
    selectedSubjects: 'updatePapers'
  },
};
</script>

<style scoped>
/* 为外层容器添加加深的边框 */
.search-bar-container {
  display: flex;
  padding-top: 10px;
  justify-content: center;
  margin: 20px 0;
}

/* 搜索框外部整体加深边框 */
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #646363; /* 外层边框加深 */
  border-radius: 4px; /* 圆角效果 */
}

/* 让选择框和输入框紧邻，且不加粗它们之间的边框 */
.search-condition {
  width: 150px;
  border-right: none; /* 去掉选择框右边的边框 */
}

.search-input {
  width: 300px;
  border-left: none; /* 去掉输入框左边的边框 */
}

.el-aside {
  background-color: #f5f7fa;
  padding: 20px;
}
.el-main {
  padding: 20px;
}
.checkbox-group-vertical {
  display: flex;
  flex-direction: column;
}
.el-checkbox-group{
  padding-left: 30px;
}
/* 调整侧栏中文本的内边距和对齐方式 */
.el-checkbox span {
  padding-left: 10px;
  display: inline-block;
  max-width: 200px; /* 根据需要设置最大宽度 */
  white-space: normal;  /* 允许文字换行 */
  word-wrap: break-word;  /* 自动换行 */
}
.el-checkbox {
  height: auto;  /* 设置复选框的高度为自适应 */
  padding: 8px 0;  /* 给复选框上下添加空间 */
  line-height: 1.5;  /* 调整行高，增加上下空间 */
}

.checkbox-group-vertical span {
  word-wrap: break-word; /* 自动换行 */
  white-space: normal;   /* 正常显示 */
}

/* 调整筛选栏左侧的文本位置，给每个类别的文本一个合理的内边距 */
.el-collapse-item .el-checkbox {
  margin-bottom: 10px;
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}
.author-authorized {
  color: blue;
  cursor: pointer;
}
</style>
