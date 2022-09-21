<template>
  <div class="show">
    <el-form ref="questionForm" :model="questionForm" :rules="rules" size="large">
      <el-container id="quesContainer">
        <el-main>
          <span>NO.{{currentNumber}}</span>
          <div style="text-align: center;" id="ques"> <span>{{questions[currentNumber-1]}} </span></div>
          <el-form-item>
            <el-radio-group v-model="questionForm.selection" size="large" @change="saveResult">
              <el-radio label="A">{{answerA[currentNumber-1]}}</el-radio>
              <el-radio label="B">{{answerB[currentNumber-1]}}</el-radio>
              <el-radio label="C">{{answerC[currentNumber-1]}}</el-radio>
              <el-radio label="D">{{answerD[currentNumber-1]}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="but1">
            <el-button id="prev" type="primary" @click="prev" :disabled="currentNumber===1">上一题</el-button>
            <el-button id="next" type="primary" @click="next" :disabled="currentNumber > questionForm.number - 1">下一题</el-button>
          </div>
        </el-main>
      </el-container>
      <br>
      <el-form-item size="large" class="but2">
        <el-button type="primary" @click="reTest">重新测试</el-button>
        <el-button type="primary" @click="submitPaper">提交试卷</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'question',
  props: ['type'],
  data() {
    const validateNumber = (rule, value, callback) => {
      let reg= /^\d{2}$/
      if(!reg.test(value)) {
        callback(new Error('输入格式错误'))
      } else if (value < 10 || value > 30) {
        callback(new Error('范围不匹配'));
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
        //选择的答案
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
      score: 0,
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
    this.render();
  },
  methods: {
    render(){
      this.$formula(document.getElementById('ques'))
    },
    async computeScores() {
      let allQuestions='';
      let allChoices='';
      let size = this.questionForm.number;
      for (let i = 0; i < size - 1 ; i++) {
        allQuestions+= this.questions[i] + '_';
        allChoices += this.questionForm.resultChoices[i] + '_';
      }
      allQuestions += this.questions[size - 1];
      allChoices += this.questionForm.resultChoices[size - 1];
      await this.axios({
            url: '/question/check',
            method: "post",                       // 请求方法
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: "Account=" + this.questionForm.username + "&Question=" + allQuestions + "&Choice=" + allChoices
          }
      ).then(function (response) {
        if (response.data.length) {
          let boolList = response.data.check;
          let size = response.data.length;
          for(let i = 0 ; i < size ; i ++){
            if(boolList[i] === true){
              this.score++;
            }
          }
          console.log("分数为" + this.score);
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          });
        }
      })
      this.$message({
        message: '提交成功 你本次考试的分数为: ' + this.score,
        type: 'success'
      });
      sessionStorage.setItem("score", this.score);
    },
    getPaper() {
      console.log("获得试卷");
      var _this = this;
      this.score = 0;
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
                // this.trueAnswer.push(recData[i]['Answer']);
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
      this.render();
    },
    next() {
      this.currentNumber++;
      if (this.questionForm.resultChoices[this.currentNumber - 1] != null) {
        this.questionForm.selection = this.questionForm.resultChoices[this.currentNumber - 1];
      } else {
        this.questionForm.selection = '';
      }
      this.render();
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
      this.score = '';
      this.currentNumber = 1;
      this.questionForm.selection = '';
      this.questionForm.resultChoices = [];
      this.getPaper();
    },
    saveResult(value) {
      this.questionForm.resultChoices[this.currentNumber-1] = value;
    },
  }
}
</script>

<style>
#quesContainer {
  width: 100%;
  height: 400px;
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
  margin-top: 80px;
}

.show .el-radio__inner {
  width: 20px;
  height: 20px;
}

.show .el-radio__label{
  font-size: 30px;
}

.but1 .el-button {
  margin-left: 300px;
  position: relative;
  left: 140px;

}

.but2 .el-button {
  margin-top: 40px;
  margin-left: 300px;
  position: relative;
  left: -150px;
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
