<template>
  <div >
    <el-progress :show-text="true"  :width="300" :stroke-width="20" type="circle"
                 :percentage="this.score" status="success"  >
    </el-progress>
    <br><br>
    <div class="circleCenter" >
      <div>你的分数为{{ this.score }}</div>
    </div>

    <el-button-group class="add_btn" >
      <el-button @click="returnHome">回到首页</el-button>
      <el-button @click="returnPaper">重新考试</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  inject:["reload"],
  data(){
    return{
      score: 0,
      fullNumber: ''
    }
  },
  mounted() {
    this.score = Number(sessionStorage.getItem("score"));
    this.fullNumber = sessionStorage.getItem("number");
    console.log("分数素数" + this.score + "      " + this.fullNumber);
    this.score = Number(parseFloat(this.score / this.fullNumber * 100).toFixed(2));
    console.log(this.score)
    if (location.href.indexOf("#reloaded")<=0) {
      location.href = location.href + "#reloaded"+"#reloaded";
      location.reload();
    }
  },
  methods:{
    returnHome(){
      this.$router.push('/home');
    },
    returnPaper(){
      this.$router.push('/prepareGenerate')
    },
  }
}
</script>
<style>

.add_btn {
min-width: 20%;
min-height: 60px;
margin-top: 30px;
font-size: 25px;
border-radius: 40px;
margin-left: 100px;
}
</style>
