<template>
  <div class="gen">
    <el-form ref="questionForm" :model="questionForm" :rules="rules" size="large">
      <h3>请选择生成试卷的类型</h3>
      <el-radio-group v-model="questionForm.phase" size="large">
        <el-radio-button label="A">{{allTypes[0]}}</el-radio-button>
        <el-radio-button label="B">{{allTypes[1]}}</el-radio-button>
        <el-radio-button label="C">{{allTypes[2]}}</el-radio-button>
      </el-radio-group>
      <div class="but">
        <el-form-item prop="number">
<!--          <h4>请输入题目数量</h4>-->
          <el-input v-model="questionForm.number"  placeholder="请输入题目数量10-30" autocomplete="off"></el-input>
          <el-button type="primary" :span="12" @click="getPaper('questionForm')">生成试卷</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'question',
  props: ['type'],
  data() {
    const validatePhase = (rule, value, callback)=>{
      if(!value){
        this.$message({
          message: "请选择输入题目的类型",
          type: 'warning'
        })
      }else{
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      let reg = /^\d{2}$/
      if (!reg.test(value)) {
        this.$message({
          message: "输入格式错误",
          type: 'error'
        })
      } else if (value < 10 || value > 30) {
        this.$message({
          message: "输入题目范围不匹配！",
          type: 'error'
        })
      } else {
        callback();
      }
    };
    return {
      dic: {
        'A': '小学',
        'B': '初中',
        'C': '高中'
      },
      allTypes: ['小学', '初中', '高中'],
      questionForm: {
        phase: 'A',
        username: '',
        number: '',
      },
      rules: {
        number: [
          {validator: validateNumber, trigger: 'blur'}
        ],
        phase:[
          {
            validator:validatePhase, trigger:'blur'
          }
        ]
      }
    };
  },
  methods:{
    getPaper(){
      this.$refs.questionForm.validate( (valid)=>{
        if(valid){
          sessionStorage.setItem("number",this.questionForm.number);
          sessionStorage.setItem("phase",this.questionForm.phase);
          this.$router.push('/generate');
        }else{
          this.$message({
            message: "请输入符合要求的题目数量",
            type: "warning",
          })
        }
      })

    }
  }
}
</script>

<style>
.gen h3{
  font-size: 60px;
  margin-bottom: 50px;
  margin-top: 150px;
}


.but .el-form-item {
  position: center;
  margin-top: 30px;
}

.but .el-form-item__label {
  position: relative;
  left: 600px;
  font-size: 30px;
  margin-bottom: -40px;
  margin-top: 50px;
}

.but .el-input__inner {
  width: 300px;
}

.but .el-button {
  margin-top: 50px;
}

</style>
