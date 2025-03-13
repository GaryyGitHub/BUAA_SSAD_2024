import { createStore } from 'vuex';

// 从 localStorage 恢复用户信息
const storedUser = JSON.parse(localStorage.getItem('user')) || null;

const store = createStore({
  state: {
    uid: storedUser ? storedUser.uid : null,        // 从 localStorage 恢复 uid
    avater: storedUser ? storedUser.avater: '',
    email: storedUser ? storedUser.email: '',
    status: storedUser ? storedUser.status: null,
    isVerify: storedUser ? storedUser.isVerify: false,
    institution: storedUser ? storedUser.institution: '',
    stats:storedUser ? storedUser.stats: null,
    name:storedUser ? storedUser.name: '',
    username: storedUser ? storedUser.username: '',
    token: storedUser ? storedUser.token: '',
    canSee: false
  },
  mutations: {
    setUser(state, user) {
      state.uid = user.uid;
      state.avater = user.avater;
      state.email = user.email;
      state.status = user.status;
      state.isVerify = user.isVerify;
      state.institution = user.institution;
      state.stats = user.stats;
      state.name = user.name;
      state.username = user.username;
      state.token = user.token;      

      // 将用户信息存储到 localStorage
      localStorage.setItem('user', JSON.stringify(user)); // 存储完整的用户信息
    },
    clearUser(state) {
      state.uid = null;
      state.avater = '';
      state.email = '';
      state.status = null;   
      state.isVerify = false;
      state.institution = '';
      state.stats = null;
      state.name = '';
      state.username = '';
      state.token = '';
      
      // 清除 localStorage 中的用户数据
      localStorage.removeItem('user'); // 清除存储的完整用户信息
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);  // 保存用户信息到 Vuex 和 localStorage
    },
    logout({ commit }) {
      commit('clearUser');  // 清除用户信息
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.uid !== null;  // 判断是否登录
    },
    getUserId(state) {
      return state.uid;
    },
    getUsername(state) {
      return state.username;
    },
    getIsVertify(state) {
      return state.isVerify;  // 获取 isVertify
    },
    getToken(state) {
      return state.token;  // 获取 token
    },
  },
});

export default store;
