<template>
  <el-table
      :data="tableData"
      style="width: 100%">
    <el-table-column
        label="题目"
        width="300"
        prop="question"
        id="q">
    </el-table-column>
    <el-table-column
        label="选项A"
        width="180"
        prop="answerA">
    </el-table-column>
    <el-table-column
        label="选项B"
        width="180"
    prop="answerB">
    </el-table-column>
    <el-table-column
        label="选项C"
        width="180"
        prop="answerC">

    </el-table-column>
    <el-table-column
        label="选项D"
        width="180"
        prop="answerD">

    </el-table-column>
    <el-table-column
        label="正确答案"
        width="180"
        prop="correctAnswer">
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data(){
    return {
      timeString:'',
      username:'',
      tableData:[{
        question:'',
        answerA:'',
        answerB:'',
        answerC:'',
        answerD:'',
        correctAnswer:''
      }]
    }
  },
  mounted() {
    this.tableData.pop()
    this.timeString = sessionStorage.getItem("timeString")
    this.username = sessionStorage.getItem("username")
    console.log("时间"+this.timeString)
    this.getCurrentTimePaper();
    this.render();
  },
  methods:{
    render(){
      this.$formula(document.getElementById('q'));
    },
    getCurrentTimePaper(){
      this.axios({
        url: "/question/check/paper",
        method:"post",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:"Account="+this.username + "&TimeStr=" + this.timeString
      }
      ).then( (response)=>{
        console.log("开始获取数据")
        if(response.data.length){
          let recData = response.data;
          console.log(recData)
          let size = response.data.length;
          for( let i = 0 ; i < size ; i ++){
            this.tableData.push({
              question:recData[i]['Question'],
              answerA:recData[i]['A'],
              answerB:recData[i]['B'],
              answerC:recData[i]['C'],
              answerD:recData[i]['D'],
              correctAnswer: recData[i]['Answer']
            })
            console.log(recData[i]['Question'])
          }
        }else {
          this.$message({
            message: response.data.message,
            type: 'error'
          });
        }
      })
    }
  }
}
</script>

