<template>
  <div class="show">

    <div style="opacity:0.5;position:absolute;top:125px;left:20px;width:500px;height:70px;background-color:#ffffff; color: #ffffff"></div>
    <el-form ref="questionForm" :model="questionForm" :rules="rules" size="large">
      <el-container id="quesContainer">
        <el-main>
          <span>NO.{{currentNumber}}</span>
          <div class="hello" v-html="questions[currentNumber-1]">{{ questions[currentNumber-1] }}</div>
          <el-form-item>
            <center>
              <el-radio-group v-model="questionForm.selection" size="large" @change="saveResult">
                <el-radio label="A">{{answerA[currentNumber-1]}}</el-radio>
                <el-radio label="B">{{answerB[currentNumber-1]}}</el-radio>
                <el-radio label="C">{{answerC[currentNumber-1]}}</el-radio>
                <el-radio label="D">{{answerD[currentNumber-1]}}</el-radio>
              </el-radio-group>
            </center>
          </el-form-item>
          <center>
            <div class="but1">
              <el-button id="prev" type="primary" @click="prev" :disabled="currentNumber===1">上一题</el-button>
              <el-button id="next" type="primary" @click="next" :disabled="currentNumber > questionForm.number - 1">下一题</el-button>
            </div>
          </center>
        </el-main>
      </el-container>
      <br>
      <center>
        <el-form-item size="large" class="but2">
          <el-button type="primary" @click="reTest">重新测试</el-button>
          <el-button type="primary" @click="submitPaper">提交试卷</el-button>
        </el-form-item>
      </center>
    </el-form>
  </div>
</template>

<script>
import MathJax from "@/common/js/MathJax";
export default {
  name: 'question',
  props: ['type'],
  data() {
    const validateNumber = (rule, value, callback) => {
      let reg= /^\d{2}$/
      if(!reg.test(value)) {
        this.$message({
          message: "输入格式有误",
          type: 'error'
        })
      } else if (value < 10 || value > 30) {
        this.$message({
          message: "输入题目范围不匹配",
          type: 'error'
        })
      } else {
        callback();
      }
    };
    return {
      dic:{
        'A':'小学',
        'B':'初中',
        'C':'高中'
      },
      allTypes: ['小学', '初中', '高中'],
      questionForm: {
        phase:'',
        username:'',
        number: '',
        selection: '',
        resultChoices: [],
      },
      currentNumber : 1,
      //题目内容
      questions: [],
      //四个选项
      answerA: [],
      answerB : [],
      answerC : [],
      answerD : [],
      score: 1,
      rules: {
        number: [
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    };
  },
  mounted: function() {
    this.questionForm.phase = sessionStorage.getItem("phase");
    this.questionForm.number = sessionStorage.getItem("number");
    this.questionForm.username = sessionStorage.getItem("username");
    this.getPaper(this.questionForm);
    this.cur();
    this.cur();
  },
  methods: {
    formatMath() {
      let that = this;
      setTimeout(function () {
        that.$nextTick(function () {
          if(MathJax.isMathjaxConfig){//判断是否初始配置，若无则配置。
            MathJax.initMathjaxConfig();
          }
          MathJax.MathQueue("hello");//传入组件id，让组件被MathJax渲染
        })
      },1);
    },
    render(){
      this.$formula(document.getElementById("questions[currentNumber-1]"));
    },
  computeScores() {
      let allQuestions='';
      let allChoices='';
      let size = this.questionForm.number;
      for (let i = 0; i < size - 1 ; i++) {
        allQuestions+= this.questions[i] + '_';
        switch(this.questionForm.resultChoices[i]){
          case 'A':
            allChoices+=this.answerA[i] + '_';
            break;
          case 'B':
            allChoices+=this.answerB[i] + '_';
            break;
          case 'C':
            allChoices+=this.answerC[i] + '_';
            break;
          case 'D':
            allChoices+=this.answerD[i] + '_';
            break;
        }
      }
      //最后一位不用加下划线
      allQuestions += this.questions[size - 1];
      let endNum = this.questionForm.resultChoices[size - 1];
      switch(endNum){
        case 'A':
          allChoices+=this.answerA[size - 1];
          break;
        case 'B':
          allChoices+=this.answerB[size - 1];
          break;
        case 'C':
          allChoices+=this.answerC[size - 1];
          break;
        case 'D':
          allChoices+=this.answerD[ size - 1];
          break;
      }
      console.log( "题目" + allQuestions)
      console.log("答案" + allChoices)
      this.axios({
            url: '/question/check',
            method: "post",                       // 请求方法
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: "Account=" + this.questionForm.username + "&Question=" + allQuestions + "&Choice=" + allChoices
          }
      ).then(function (response) {
        if (response.data.length) {
          let size = response.data.length;
          console.log(response.data)
          for(let i = 0 ; i < size ; i ++){
            if(response.data[i] === true){
              console.log("报错地点",this.score)
              this.score = this.score + 1;
            }
          }
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          });
        }
      })
      this.$message({
        message: '提交成功 你本次考试的分数为: ' + (this.score - 1)/this.questionForm.number * 100,
        type: 'success'
      });
      sessionStorage.setItem("score", this.score - 1);
    },
    getPaper() {
      console.log("获得试卷");
      var _this = this;
      this.score = 1;
      this.$refs.questionForm.validate(async (valid) => {
        if (valid) {
          _this.currentNumber = 1;
          _this.questionForm.selection = '';
          _this.questionForm.resultChoices = [];
          console.log("运行到发送get处了");
          console.log("Account=" + this.questionForm.username+"&Phase="+ this.dic[this.questionForm.phase] +"&Number=" + this.questionForm.number)
          this.axios({
            url:"/question/gen",
            method: "post",                       // 请求方法
            headers:{
              'Content-Type':'application/x-www-form-urlencoded'
            },
            data: "Account="+ this.questionForm.username +"&Phase="+ this.dic[this.questionForm.phase] +"&Number=" + this.questionForm.number
          }).then( (response)=>{
            console.log("等待");
            if(response.data) {
              console.log("进入");
              console.log("接受到的数据")
              console.log(response.data);
              let recData = response.data;
              for( let i = 0 ; i < this.questionForm.number ; i ++){
                //将所有数据进行填入
                this.questions.push(recData[i]['Question']);
                this.answerA.push(recData[i]['A']);
                this.answerB.push(recData[i]['B']);
                this.answerC.push(recData[i]['C']);
                this.answerD.push(recData[i]['D']);
                console.log("问题: " + i + this.questions[i]);
              }
            } else {
              _this.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    prev() {
      this.currentNumber--;
      if (this.questionForm.resultChoices[this.currentNumber - 1] != null) {
        this.questionForm.selection = this.questionForm.resultChoices[this.currentNumber - 1];
      } else {
        this.questionForm.selection = '';
      }

      this.formatMath()
    },
    cur() {
      this.formatMath()
    },
    next() {
      this.currentNumber++;
      if (this.questionForm.resultChoices[this.currentNumber - 1] != null) {
        this.questionForm.selection = this.questionForm.resultChoices[this.currentNumber - 1];
      } else {
        this.questionForm.selection = '';
      }
      this.formatMath()
    },
    submitPaper() {
      console.log("number" + this.questionForm.number)
      console.log("resultChoices" + this.questionForm.resultChoices.length)
      console.log("currentNumber" + this.currentNumber)
      let _this = this;
      for( let i = 0 ; i < this.questionForm.resultChoices.length ;i++){
        console.log("chooseAnswer" + this.questionForm.resultChoices[i]);
      }
      if (parseInt(this.questionForm.resultChoices.length) !==parseInt(this.questionForm.number)) {
        _this.$message({
          message: '请完成所有题目之后再提交',
          type: 'info'
        });
        return;
      }
      this.computeScores();
      this.$router.push('/viewScore');
    },
    reTest() {
      this.score = 1;
      this.currentNumber = 1;
      this.questionForm.selection = '';
      this.questionForm.resultChoices = [];
      this.getPaper();
    },
    saveResult(value) {
      this.questionForm.resultChoices[this.currentNumber-1] = value;
    },
  },
  created() {
    this.formatMath();
  }
}
</script>

<style>
#quesContainer {
  width: 100%;
  height: 600px;
  border-radius: 5px;
  font-size: 25px;
  border: rgb(236, 236, 236) solid 3px;
  background-color: rgb(255, 255, 255);
}


.el-main {
  background-color: #f8f8f8;
  color: rgb(85, 85, 85);
  text-align: left;
  line-height: 50px;
  margin-left: 1px;
}
.el-aside {
  /* width: auto!important;
  width: 250px; */
  background-color: #f8f8f8;
  color: rgb(85, 85, 85);
  text-align: left;
  line-height: 50px;
}
.show .el-radio{
  display: inline-block;
  line-height: 30px;
  white-space: normal;
  margin-left: 100px;
  margin-top: 20px;
}

.show .el-radio__inner {
  width: 20px;
  height: 20px;
}

.show .el-radio__label{
  font-size: 30px;
}

.show .el-radio-group {
  position: relative;
  left: -50px;
}


.but1 #next  {
  margin-left: 200px;
  margin-bottom: 100px;
  margin-top: 100px;
}

.but2 .el-button {
  margin-top: 40px;
  margin-left: 100px;
  position: relative;
  left: -50px;
}
.butt {
  width: 20%;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #000000;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>
