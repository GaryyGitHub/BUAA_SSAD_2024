<template>
  <div class="gray-rounded-rect"
    :style="{ backgroundImage: `url(${this.user.bgUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }">
    <div class="inner-rect1" style="background-color: white;">
      <el-descriptions class="margin-top" title="Info" :column="3" :size="size" border>
        <template #extra>
          <el-button type="primary" @click="toggleEdit()" v-if="this.$route.params.id == this.$store.state.uid">{{
            !this.editing ? '编辑学者信息' : '取消修改' }}</el-button>
          <el-button type="success" @click="updateInfo()" v-if="this.editing">提交信息</el-button>
        </template>
        <!-- 姓名 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              姓名
            </div>
          </template>
          {{ user.userName }}
        </el-descriptions-item>

        <!-- 性别 -->
        <el-descriptions-item v-if="!editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Female />
              </el-icon>
              <el-icon :style="iconStyle">
                <Male />
              </el-icon>
              性别
            </div>
          </template>
          {{ user.gender }}
        </el-descriptions-item>
        <el-descriptions-item v-if="editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Female />
              </el-icon>
              <el-icon :style="iconStyle">
                <Male />
              </el-icon>
              性别
            </div>
          </template>
          <el-input v-model="user.gender" size="small" />
        </el-descriptions-item>

        <!-- 联系方式 -->
        <el-descriptions-item v-if="!editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              联系方式
            </div>
          </template>
          {{ user.telephone }}
        </el-descriptions-item>
        <el-descriptions-item v-if="editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              联系方式
            </div>
          </template>
          <el-input v-model="user.telephone" size="small" />
        </el-descriptions-item>

        <!-- 地区 -->
        <el-descriptions-item v-if="!editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <View />
              </el-icon>
              昵称
            </div>
          </template>
          {{ user.nickname }}
        </el-descriptions-item>
        <el-descriptions-item v-if="editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              昵称
            </div>
          </template>
          <el-input v-model="user.nickname" size="small" />
        </el-descriptions-item>

        <!-- 研究领域 -->
        <el-descriptions-item v-if="!editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <CollectionTag />
              </el-icon>
              研究领域
            </div>
          </template>
          <!-- <el-tag v-for="remark in user.remarks" :key="remark" size="small">{{ remark }}</el-tag> -->
          {{ user.remarks }}
        </el-descriptions-item>
        <el-descriptions-item v-if="editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <CollectionTag />
              </el-icon>
              研究领域
            </div>
          </template>
          <el-input v-model="user.remarks" size="small" />
        </el-descriptions-item>

        <!-- 大学 -->
        <el-descriptions-item v-if="!editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <office-building />
              </el-icon>
              大学
            </div>
          </template>
          {{ user.college }}
        </el-descriptions-item>
        <el-descriptions-item v-if="editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <office-building />
              </el-icon>
              大学
            </div>
          </template>
          <el-input v-model="user.college" size="small" />
        </el-descriptions-item>

        <!-- 头像 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Avatar />
              </el-icon>
              头像
            </div>
          </template>
          <el-row class="demo-avatar demo-basic">
            <el-col :span="12">
              <div class="demo-basic--circle">
                <div class="block">
                  <el-avatar :size="100" :src=user.touXiangUrl />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-descriptions-item>

        <!-- 荣誉 -->
        <el-descriptions-item v-if="!editing && formattedHonor">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Trophy />
              </el-icon>
              荣誉
            </div>
          </template>
          <p v-html="formattedHonor"></p>
        </el-descriptions-item>
        <el-descriptions-item v-if="editing && formattedHonor">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Trophy />
              </el-icon>
              荣誉
            </div>
          </template>
          <el-input v-model="user.honor" size="small" type="textarea" />
        </el-descriptions-item>
      </el-descriptions>


      <el-descriptions class="margin-top" title="  " :column="3" :size="size" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Tickets />
              </el-icon>
              发文总量
            </div>
          </template>
          {{ user.paperNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Star />
              </el-icon>
              代表性论文总量
            </div>
          </template>
          {{ user.paperStarNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <DataAnalysis />
              </el-icon>
              H指数
            </div>
          </template>
          {{ user.HNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Link />
              </el-icon>
              被引用次数
            </div>
          </template>
          {{ user.citeNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Download />
              </el-icon>
              收藏总量
            </div>
          </template>
          {{ user.downloadNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <DataAnalysis />
              </el-icon>
              G指数
            </div>
          </template>
          {{ user.GNumber }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="inner-rect2" style="background-color: white;">
      <el-descriptions class="margin-top" title="Sign" :column="3" :size="size" border>
        <el-descriptions-item v-if="!this.editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              Introduction
            </div>
          </template>
          <p v-html="formattedIntro"></p>
        </el-descriptions-item>
        <el-descriptions-item v-if="this.editing">
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              Introduction
            </div>
          </template>
          <el-input v-model="this.user.introduction" style="width: 240px" :rows="2" type="textarea"
            placeholder="Please input" />
        </el-descriptions-item>

      </el-descriptions>
    </div>

    <div class="inner-rect3" style="background-color: white;">
      <div>相关文献</div>
      <el-table v-loading="loading1" element-loading-text="正在加载数据..." ref="multipleTableRef" size='large' height="450"
        :data="user.literatureData" class="noChooseTable" scrollbar-always-on>
        <el-table-column property="pid" label="文献编号" width="180" />
        <el-table-column label="篇名">
          <template #default="scope">
            <a :href="'/article/' + scope.row.pid" target="_blank" class="literature-link">
              {{ scope.row.title }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="作者">
          <template #default="scope">
            <span>
              <!-- 假设author字段是一个对象或数组，遍历并显示多个作者 -->
              {{ formatAuthors(scope.row.auths) }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column property="source" label="来源" /> -->
        <el-table-column property="publishDate" label="时间" />
      </el-table>
    </div>

    <div class="inner-rect4" style="background-color: white;">
      <div>学术关系网</div>
      <AcademicNetwork />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import AcademicNetwork from '@/views/scholar/AcademicNetwork.vue';
import { ElMessage } from 'element-plus';
export default defineComponent({
  setup() {
    // let user = reactive({
    //   userName: 'DingZhen',
    //   telephone: '18888888888',
    //   place: 'SiChuan',
    //   remarks: [
    //     'Geography',
    //     'Literature',
    //   ],
    //   college: [
    //     'BUAA'
    //   ],
    //   address: 'LiTang',
    //   touXiangUrl: require('@/assets/dingzhen.jpg'),
    //   introduction: "丁真珍珠（汉语名：丁真），2001年5月7日出生于中国四川省甘孜藏族自治州理塘县，中国内地藏族男歌手，四川文化旅游宣传推广大使 <br> 在2020年11月，因一脸纯真朴素的笑容意外走红网络，成为“新晋顶流”。同年，丁真被任命为理塘县的旅游大使，他积极为家乡代言，11月25日，为家乡拍摄的宣传片《丁真的世界》上线<br>2021年，丁真受到了四川文旅部门的青睐，被正式聘请为四川文旅的宣传推广大使。同年，他也成为了首批四川生态环境保护大使。同年，丁真不仅在环保和文化旅游领域做出贡献，还展现了他的音乐才华。他发行了音乐EP《丁真的歌 来自理塘》 。<br>此外，他还推出了自己的首张个人数字专辑《风的使者》，以音乐的方式传递了环保和文化的力量。<br>2022年5月，丁真加入了湖南卫视综艺节目《天天向上》的天天New-tro兄弟团。<br>2023年2月，丁真参与的乡村体验类纪录片《跟着丁真探乡村》在央视播出。<br>2024年5月31日，参加综艺节目《岛屿少年》 。",
    //   bio: '你好 我是丁真',
    //   honor: "四川文化旅游宣传推广大使\n四川生态环境保护大使 \n中国文旅年度新锐影响力人物 （2020年）\n中华民族大赛马形象大使 \n中国国家旅游区域旅游特别贡献奖 （2020年）\n慈善盛典年度公益青年榜样 （2022年）\n",
    //   paperNumber: 10,
    //   paperStarNumber: 4,
    //   citeNumber: 2,
    //   downloadNumber: 43,
    //   HNumber: 1,
    //   GNumber: 1,

    //   literatureData: [
    //     {
    //       id: 1,
    //       name: '薛爷爷用清华拳打掉北航辅导员',
    //       author: '薛爷爷',
    //       source: '2024/11',
    //       date: '2024-11-12',
    //     },
    //   ]
    // })
    let user = reactive({
      nickname: '',
      userName: '',
      gender: '',
      telephone: '',
      place: '',
      remarks: '',
      college: '',
      address: '',
      touXiangUrl: '',
      bgUrl: '',
      introduction: '',
      bio: '',
      honor: '',
      paperNumber: 0,
      paperStarNumber: 0,
      citeNumber: 0,
      downloadNumber: 0,
      HNumber: 0,
      GNumber: 0,
      literatureData: []
    })
    return {
      user,
    }
  },
  data() {
    return {
      editing: false, // 控制是否处于编辑模式
      nowUserRealName: '',
      tmpUser: {}
    }
  },
  components: {
    AcademicNetwork // 注册 Network 组件
  },
  computed: {
    formattedIntro() {
      return this.user.introduction.replace(/\n/g, '<br>');
    },
    formattedHonor() {
      return this.user.honor.replace(/\n/g, '<br>');
    }
  },
  async mounted() {
    await this.getUserInfo(); // 页面加载时调用, 更新当前的用户真名
    this.getUserPaper();
  },
  watch: {
    // 监听路由变化
    '$route.params.id': {
      immediate: true, // 初始加载时也执行
      async handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          await this.getUserInfo(); // 更新用户信息
          console.log("name(home) is: ", this.$store.state.name);
          this.getUserPaper(); // 更新用户论文
        }
      },
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getUserPaper() {
      this.loading1 = true;
      console.log(this.nowUserRealName);
      this.user.literatureData = [];
      // this.$api.get('/document/ado/name', {
      this.$api.get('/user/auth/getListToClaim', {
        // this.$api.get('/document/belong/name', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.token}`  // 将 token 添加到请求头
        },
        params: {
          name: this.$store.state.name,
          uid: this.$store.state.uid
        }
      })
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.user.literatureData = [];
            console.log('获取用户相关文献成功！', res.data);
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              if (this.checkPaperAuthorship(element) == 2) {
                this.user.literatureData.push(element);
              }

              
            }
            // this.user.literatureData = res.data.result;
            this.user.paperNumber = this.user.literatureData.length;
            this.user.citeNumber = this.user.downloadNumber = this.user.paperStarNumber = 0;
            // 遍历每个 pid，调用 API 获取详细信息
            for (const item of this.user.literatureData) {
              this.$api.get('/document/get/id', {
                params: { pid: item.pid },
              })
                .then((detailResponse) => {
                  const res2 = detailResponse.data;
                  if (res2.code === 200) {
                    console.log(`文献 ${item.pid} 的详细信息：`, res2.data);
                    if (res2.data.ref_times != 0) {
                      this.user.citeNumber += res2.data.ref_times;
                      this.user.paperStarNumber++;
                    }
                    this.user.downloadNumber += res2.data.fav_times;
                  } else {
                    console.error(`获取文献 ${item.pid} 的详细信息失败！`, res2.message);
                  }
                })
                .catch((error) => {
                  console.error(`获取文献 ${item.pid} 的详细信息时出错！`, error);
                });
            }
          } else {
            // 处理失败的响应
            console.error('获取用户相关文献失败！', res.message);
            alert(res.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          // alert('请求出错，请稍后再试');
        });
      this.loading1 = false;

      this.$api.get('/document/user/exponent', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.token}`  // 将 token 添加到请求头
        },
        params: {
          name: this.nowUserRealName
        }
      })
        .then(response => {
          console.log("number");
          const res3 = response.data;


          console.log(res3);

          if (res3.code === 200) {
            this.user.GNumber = res3.data.g_index;
            this.user.HNumber = res3.data.h_index;
          } else {
            // 处理失败的响应
            console.error('获取指数失败！', res3.message);
            alert(res3.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          // alert('请求出错，请稍后再试');
        });
    },
    async getUserInfo() {
      let uid = this.$route.params.id
      console.log('Home uid: ', uid)
      await this.$api.get('/user/personal/allInfo', {
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
        },
        params: {
          uid: uid
        }
      })
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            console.log('获取信息成功！', res);
            let resData = response.data.data;
            // 更新数据
            this.$store.state.canSee = (resData.uid === this.$store.state.uid) ? true : false;
            console.log("cansee: ");
            console.log(this.$store.state.canSee);
            this.nowUserRealName = resData.name;
            this.user.nickname = resData.nickName;
            this.user.userName = resData.name;
            if (resData.uid === this.$store.state.uid) {
              this.$store.state.name = this.user.userName;
            }
            if (resData.gender == 0) {
              this.user.gender = '男';
            }
            else if (resData.gender == 1) {
              this.user.gender = '女';
            }
            else {
              this.user.gender = '未填写性别';
            }
            this.user.touXiangUrl = resData.avatar;
            this.user.bgUrl = resData.background;
            this.user.telephone = resData.email;
            this.user.college = resData.institution;
            this.user.remarks = resData.field;
            this.user.introduction = resData.description;
          } else {
            // 处理失败的响应
            console.error('获取失败！', res.message);
            ElMessage.error(res.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          // ElMessage.error('请求错误！请稍后再试：' + error);
        });
    },
    toggleEdit() {
      if (this.editing === false) {
        // 进来之前是非编辑状态，暂存一份原始数据
        this.tmpUser = JSON.parse(JSON.stringify(this.user)); // 深拷贝
      }
      else {
        // 取消修改时恢复数据
        this.user = JSON.parse(JSON.stringify(this.tmpUser)); // 深拷贝
      }
      this.editing = !this.editing; // 切换编辑状态
    },
    async updateInfo() {
      let gender = 2;
      if (this.user.gender === '男') {
        gender = 0;
      }
      else if (this.user.gender === '女') {
        gender = 1;
      }
      const payload = {
        username: this.user.nickname,
        email: this.user.telephone,
        gender: gender,
        institution: this.user.college,
        description: this.user.introduction,
        catagory: this.user.field
      };
      console.log("token: " + this.$store.state.token);

      this.$api.put('/user/personal/updateInfo', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
        }
        // data: {  // 使用 data 来传递请求体中的数据
        //   nickName: this.user.nickname,
        //   email: this.user.telephone,
        //   gender: gender,
        //   institution: this.user.college,
        //   description: this.user.introduction,
        //   catagory: this.user.field
        // }
      })
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            console.log('更新信息成功！', res);
            this.editing = false;
          } else {
            // 处理失败的响应
            console.error('更新失败！', res.message);
            ElMessage.error(res.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          ElMessage.error('请求错误！请稍后再试：' + error);
        });
    },
    formatAuthors(auths) {
      if (auths && typeof auths === 'object') {
        // 如果是对象，返回所有作者名称
        return Object.keys(auths).join(', ');
      }
      return ''; // 如果没有作者信息，返回空字符串
    },
    checkPaperAuthorship(paper) {
      if (!paper.auths || typeof paper.auths !== 'object') {
        return 0; // 文献中没有作者信息，返回 0
      }

      for (const [authorName, authorId] of Object.entries(paper.auths)) {
        if (authorName === this.$store.state.name) {
          if (authorId === this.$store.state.uid) {
            return 2; // 作者名和 ID 都匹配
          } 
          else if (authorId != this.$store.state.uid && authorId != 0) {
            return 1; // 作者名匹配，但 ID 不匹配
          }
          else return 0;
        }
      }

      return 0; // 没有找到匹配的作者
    }
  }
})


</script>

<style scoped>
.gray-rounded-rect {
  position: relative;
  top: 0%;
  left: 0%;
  width: 87vw;
  background-color: rgb(232, 230, 230);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  /* 允许垂直滚动 */
}

.inner-rect1,
.inner-rect2,
.inner-rect3,
.inner-rect4 {
  width: 98%;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  opacity: 0.8;
  /* 整体不透明度，0.0 为完全透明，1.0 为完全不透明 */
}

/* 如果页面内容特别多，可以考虑限制最小高度 */
.gray-rounded-rect {
  min-height: 90vh;
  /* 可以调整页面的最小高度 */
}


.noChooseTable {
  position: relative;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 添加这个样式来垂直居中 */
}
</style>