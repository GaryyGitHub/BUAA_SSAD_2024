<template>
  <NavBar></NavBar>
  <div class="container">
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>文献详情</span>
        </div>
      </template>
      <span class="title">{{ articleDetail.title }}</span>
      <div class="opertation">
        <el-tooltip content="引用格式" placement="top">
          <el-button 
            circle 
            color="var(--v_overall_blue)" 
            :icon="EditPen" 
            style="margin-right: 10px;"
            @click="handleCitation(articleDetail)"
          />
        </el-tooltip>
        <el-tooltip content="收藏" placement="top">
          <el-button 
            circle 
            color="var(--v_overall_blue)" 
            :icon="Star" 
            style="margin-right: 10px;"
            @click="handleFavorite"
          />
        </el-tooltip>
        <el-tooltip content="分享" placement="top">
          <el-button 
            circle 
            color="var(--v_overall_blue)" 
            :icon="Share" 
            style="margin-right: 10px;"
            
          />
        </el-tooltip>
      </div>
      <div class="article">
        <!-- 摘要 -->
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">摘要：</span>
          </el-col>
          <el-col :span="18">
            <span>{{ articleDetail.ess_abs }}</span>
          </el-col>
        </el-row>
        <!-- 作者 -->
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">作者：</span>
          </el-col>
          <el-col :span="18">
            <span v-for="(item, key) in articleDetail.auths" :key="key" >
              <!-- 是平台认证过的作者 -->
              <span v-if="item.id != 0" class="author-authorized" @click="openNewPage(`/scholarInfo/${item.id}/scholarHome/`, true);">
                {{ item.name }};&nbsp;
              </span>
              <span v-else>
                {{ item.name }};&nbsp;
              </span>
            </span>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">关键词：</span>
          </el-col>
          <el-col :span="18">
            <span v-for="(item, key) in articleDetail.keywords" :key="key">
              {{ item }};&nbsp;
            </span>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">文献主题：</span>
          </el-col>
          <el-col :span="18">
            <span>{{ articleDetail.theme }}</span>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">发布日期：</span>
          </el-col>
          <el-col :span="8">
            <span>{{ articleDetail.publish_date }}</span>
          </el-col>
          <el-col :span="2">
            <span class="col">文献类型：</span>
          </el-col>
          <el-col :span="8" style="display: flex; align-items: center;">
            <span><el-tag round style="font-size: 16px;">{{ articleDetail.type }}</el-tag></span>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">主领域：</span>
          </el-col>
          <el-col :span="8">
            <span>{{ articleDetail.mainClassName }}</span>
          </el-col>
          <el-col :span="2">
            <span class="col">子领域：</span>
          </el-col>
          <el-col :span="8">
            <span>{{ articleDetail.subClassName }}</span>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="2">
            <span class="col">来源：</span>
          </el-col>
          <el-col :span="18">
            <span>{{ articleDetail.derivation }}</span>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="6" style="text-align: center;">
            <el-statistic title="被引量" :value=articleDetail.ref_times />
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-statistic title="收藏量" :value=articleDetail.fav_times />
          </el-col>
          <!-- <el-col :span="6" style="text-align: center;">
            <el-statistic title="页数" :value=articleDetail.pages />
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-statistic title="文件大小" :value=articleDetail.size />
          </el-col> -->
        </el-row>
        <el-row justify="center">
          <el-button 
            color="var(--v_overall_blue)" 
            plain 
            :icon="Download" 
            size="large" 
            style="font-size: 16px;" 
            @click="articleDownload">
            PDF下载/预览
          </el-button>
        </el-row>
      </div>
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>文献引用分析</span>
        </div>
      </template>
      {{ articleDetail.title }}
      <el-table 
        :data="articleDetail.refs" 
        style="width: 100%; margin-top: 20px;"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="序号" type="index" width="80"/>
        <el-table-column label="标题" min-width="600">
          <template #default="{ row }">
            <span  @click="openNewPage(`/article/${row.id}/`, true);" class="cite-title">
              {{ row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="作者" min-width="500">
          <template #default="{ row }">
            <span v-if="row.auths && row.auths.length">
              {{ row.auths.map(auth => auth.name).join(', ') }}
            </span>
            <span v-else>无作者信息</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>相关推荐</span>
        </div>
      </template>
      <el-card style="width: 1200px; margin-top: 20px;" v-for="(item, key) in recommendList" :key="key">
        <el-descriptions title="User Info">
          <template #title>
            <span style="text-align: left; cursor: pointer;" @click="openNewPage(`/article/${item.pid}/`, true);">{{ item.title }}</span>
          </template>
          <el-descriptions-item label="作者">
            <span v-for="(item2, key2) in item.auths" :key="key2" >
              <!-- 是平台认证过的作者 -->
              <span v-if="item2.id != 0" class="author-authorized" @click="openNewPage(`/scholarInfo/${item.id}/scholarHome/`, true);">
                {{ item2.name }};&nbsp;
              </span>
              <span v-else>
                {{ item2.name }};&nbsp;
              </span>
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="主领域">{{ item.mainClassName }}</el-descriptions-item>
          <el-descriptions-item label="子领域">{{ item.subClassName }}</el-descriptions-item>
          <el-descriptions-item label="文献类型">
            <span><el-tag round style="font-size: 16px;">{{ item.type }}</el-tag></span>
          </el-descriptions-item>
          <el-descriptions-item label="文献主题">
            {{ item.theme }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-card>
  </div>
  <!-- 引用 -->
  <el-dialog v-model="showCiteBox" title="引用" width="800">
    <el-row justify="center" style="margin-top: 20px;">
      <el-col :span="7">
        <span class="col">GB/T 7714-2015 引用格式：</span>
      </el-col>
      <el-col :span="16" style="text-align: left;">
        {{ citationFormat.gbt }}
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 20px;">
      <el-col :span="7">
        <span class="col">MLA 引用格式：</span>
      </el-col>
      <el-col :span="16" style="text-align: left;">
        {{ citationFormat.mla }}
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 20px;">
      <el-col :span="7">
        <span class="col">APA 引用格式：</span>
      </el-col>
      <el-col :span="16" style="text-align: left;">
        {{ citationFormat.apa }}
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 收藏 -->
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
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import { EditPen, Star, Share, Download } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/axios';  // 根据你的文件结构调整路径
import { ElMessage } from 'element-plus';  
import { useStore } from 'vuex';


const router = useRouter();
const route = useRoute();
const store = useStore();

const articleId = computed(() => {
  return route.params.id;
});

// 文章详情
const articleDetail = ref({});

// 推荐列表
const recommendList = ref([]);

const showCiteBox = ref(false);

const citationFormat = ref({gbt: "", mla: "", apa: ""});

const handleCitation = (row) => {
  citationFormat.value.gbt = `[1]${row.auths.map(author => author.name).join(', ')}. ${row.title}[J]. ${row.derivation}, ${row.publish_date}.`;
  citationFormat.value.mla = `[1]${row.auths.map(author => author.name).join(', ')}. "${row.title}." ${row.derivation}, ${row.publish_date}.`;
  citationFormat.value.apa = `[1]${row.auths.map(author => author.name).join(', ')} (${row.publish_date}). ${row.title}. ${row.derivation}.`;
  showCiteBox.value = true;
}

const folders = ref([]);
const selectedFolderIds = ref([]);
const dialogVisible = ref(false);
const isCreatingNewFolder = ref(false);
const newFolderTitle = ref("");

const handleFavorite = async() => {
  if (!store.getters.isLoggedIn) {
    ElMessage.warning('请登录后再收藏');
    return;
  } 
  getAllFolders();
  dialogVisible.value = true;
}
const getAllFolders = async() => {
  const res = await api.get('/user/fav/pidInUserFav',{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`,  // 将 token 添加到请求头
    },
    params: {
      pid: articleId.value
    }
  });
  folders.value = res.data.data.UserFavs;
  selectedFolderIds.value = res.data.data.pidInFavs.map(String);
  console.log('folders', folders.value, selectedFolderIds.value);
  folders.value = Object.fromEntries(folders.value)
}

const handleConfirm = async() => {
  const formData= new FormData();
  formData.append('pid',articleId.value);
  formData.append('fids',selectedFolderIds.value);
  await api.post('/user/fav/Batch', formData, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`,  // 将 token 添加到请求头
    },
  });
  dialogVisible.value = false;
  ElMessage.success('收藏成功');
}
const startNewFolder = () => {
  isCreatingNewFolder.value = true;
}
const creatNewFolder = async() => {
  const formData= new FormData();
  formData.append('favName', newFolderTitle.value);
  await api.post('/user/fav/createFav', formData, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`,  // 将 token 添加到请求头
    },
  });
  getAllFolders();
  isCreatingNewFolder.value = false;
}

const getArticleDetail = async() => {
  console.log('articleId', articleId.value);
  const res = await api.get(`/document/get/id`, {
    params: { pid: articleId.value }
  })
  if (res.data.data) {
    articleDetail.value = res.data.data;
  } else {
    ElMessage.error('获取文献失败');
    articleDetail.value = {};
  }
  // 对数据进行格式化
  // 领域string -> object
  articleDetail.value.category = JSON.parse(articleDetail.value.category);
  articleDetail.value.mainClassName = articleDetail.value.category.mainClassName;
  articleDetail.value.subClassName = articleDetail.value.category.subClassName;
  // 日期格式化
  articleDetail.value.publish_date = new Date(articleDetail.value.publish_date).toLocaleDateString('zh-CN').replace(/\//g, '-');
  // 作者相关
  articleDetail.value.auths = Object.entries(articleDetail.value.auths).map(([name, id]) => ({
    name: name,
    id: id,
  }));
  for (let i = 0; i < articleDetail.value.refs.length; i++) {
    const res2 = await api.get(`/document/get/id`, {
      params: { pid: articleDetail.value.refs[i] }
    })
    console.log('res2', i, res2.data.data);
    if (res2.data.data) {
      res2.data.data.auths = Object.entries(res2.data.data.auths).map(([name]) => ({name}));
      articleDetail.value.refs[i] = {id: articleDetail.value.refs[i], title: res2.data.data.title, auths: res2.data.data.auths};
    } else {
      articleDetail.value.refs[i] = {id: articleDetail.value.refs[i], title: '未找到文献'};
    }
  }
  console.log('articleDetail', articleDetail.value);
}

const getRecommendList = async() => {
  const res = await api.get(`/document/get/recommend`, {
    params: { num: 10 }
  })
  recommendList.value = res.data.data;
  console.log('recommendList', recommendList.value);
  recommendList.value.forEach(item => {
    item.category = JSON.parse(item.category);
    item.auths = JSON.parse(item.auths);
    item.auths = Object.entries(item.auths).map(([name, id]) => ({
      name: name,
      id: id,
    }));
    if (item.category) {
      item.mainClassName = item.category.mainClassName;
      item.subClassName = item.category.subClassName;
    }
  });
}

const articleDownload = () => {
  if (!store.getters.isLoggedIn) {
    ElMessage.warning('请登录后再下载');
    return;
  }
  console.log("download");
  const url = articleDetail.value.content_url;
  if (!url) {
    ElMessage.warning('文献未提供下载链接');
    return;
  }
  const link = document.createElement('a');
  link.href = url;
  link.download = articleDetail.value.title + ".pdf";
  api.post('/user/history/update', { params:{pid: articleId.value} });
  link.click();
}

// 打开新页面
const openNewPage = (route, isBlank) => {
  if (isBlank) {
    window.open(router.resolve(route).href, '_blank');
  } else {
    router.push(route);
  }
};

onMounted(() => {
  getArticleDetail();
  getRecommendList()
})
</script>

<style scoped>
.container {
  line-height: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.card {
  box-shadow: var(--el-box-shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1400px;
  margin-top: 20px;
}

.card-header {
  width: 500px;
  font-size: 26px;
  font-weight: bold;
  margin-top: 5px;
}

.cite-title {
  cursor: pointer;
}

.opertation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  margin: 0 0 20px 0;
  margin-top: 20px;
  padding-right: 120px;
}

.title {
  color: black;
  font-size: 22px;
  /* font-weight: bold; */
  margin-bottom: 40px;
  width: 1000px;
  text-align: center;
}

.article {
  margin: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: left;
}

.author-authorized {
  color: blue;
  cursor: pointer;
}

.col {
  color: black;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
}

.container .el-row {
  width: 1400px;
  margin-bottom: 20px;
}

</style>