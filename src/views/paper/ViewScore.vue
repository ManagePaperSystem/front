<template>
  <div>
    <el-progress :show-text="false" :width="120" :stroke-width="12" type="circle"
                 :percentage="this.score">
    </el-progress>
    <div class="circleCenter">
      <div>你的分数为{{ this.score }}</div>
    </div>
    <el-button-group>
      <el-button @click="returnHome">回到首页</el-button>
      <el-button @click="returnPaper">重新考试</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  data(){
    return{
      score: 0.0,
      fullNumber: ''
    }
  },
  mounted() {
    this.score = sessionStorage.getItem("score");
    this.fullNumber = sessionStorage.getItem("number")
    console.log("分数素数" + this.score + "      " + this.fullNumber)
    this.score = Number(parseFloat(this.score / this.fullNumber * 100).toFixed(2))
    console.log(this.score)
  },
  methods:{
    returnHome(){
      this.$router.push('/home');
    },
    returnPaper(){
      this.$router.push('/generate')
    },
  }
}
</script>
