<template>
  <div>
    <h2>欢迎登录！您的用户名为 {{ user.uname }}</h2>

    <el-button @click="generate"  type="success" class = add_btn>生成试卷</el-button><br>
    <el-button @click="viewPreviousPaper" type="success"  class = add_btn>查看往年试卷</el-button><br>
    <el-button @click="modifyPersonalInfo" type="success"  class = add_btn>修改个人信息</el-button><br>
    <el-button @click="logout" type="success" class = add_btn> 登出 </el-button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      user: {
        uname: "",
      },
    };
  },
  methods: {
    logout(){
      // 移除本地用户登录信息
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('password');
      // 跳转页面到登录页
      this.$router.push('/login');
    },
    generate(){
      this.$router.push('/prepareGenerate')
    },
    viewPreviousPaper(){
      this.$router.push('/pastPapers')
    },
    modifyPersonalInfo(){
      this.$router.push('/modify')
    }
  },
  mounted() {
    this.user.uname = sessionStorage.getItem("username");
  },
};
</script>


<style scoped>
.add_btn {
  min-width: 20%;
  min-height: 60px;
  margin-top: 30px;
  font-size: 25px;
  border-radius: 40px;
}

h2 {
  margin-top: 220px;
  font-size: 60px;
  color: #1baeae;
}
</style>