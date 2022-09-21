<template>
  <div class="reg">
    <h1>修&nbsp;&nbsp;改&nbsp;&nbsp;密&nbsp;&nbsp;码</h1>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="large">
      <center>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>
      </center>
      <center>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button type="danger" @click="resetForm">重置</el-button>
        </el-form-item>
      </center>
    </el-form>
  </div>
</template>

<script>
import ElementUI from "element-ui";

export default {
  name: 'modifyPassword',
  data() {
    let checkOldPassword = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: "请输入原密码！",
          type: 'warning'
        })
      } else if (value !== window.sessionStorage.getItem('password')){
        this.$message({
          message: "原密码不正确！",
          type: 'error'
        })
      } else {
        callback();
      }
    };
    let validatePasswordLegal = (rule, value, callback) => {
      let reg= /^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])\w{6,10}$/
      if (value === '') {
        this.$message({
          message: "请输入密码！",
          type: 'error'
        })
      } else if(!reg.test(value)) {
        this.$message({
          message: "密码必须是由6-10位大小写字母+数字组合！",
          type: 'error'
        })
      } else {
        if (this.ruleForm.newPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword');
        }
        callback();
      }
    };
    let validatePasswordSame = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: "请再次输入新密码！",
          type: 'warning'
        })
      } else if (value !== this.ruleForm.checkPassword) {
        this.$message({
          message: "两次输入密码不一致！",
          type: 'error'
        })
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username:'',
        oldPassword: '',
        checkPassword: '',
        newPassword: ''
      },
      rules: {
        newPassword: [
          { validator: validatePasswordLegal, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePasswordSame, trigger: 'blur' }
        ],
        oldPassword: [
          { validator: checkOldPassword, trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  mounted(){
    this.ruleForm.username = sessionStorage.getItem("username");
  },
  methods: {
    submitForm() {
      this.ruleForm.username = sessionStorage.getItem("username");
      let _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.axios({
            url:"/user/modify",
            method:"post",
            headers:{
              'Content-Type':'application/x-www-form-urlencoded'
                  // 'Content-Type':'application/json'
            },
            data: "Account="+this.ruleForm.username + "&Password=" + this.ruleForm.newPassword
          }
          ).then(function(response) {
            if(response.data.flag === true){
              //设置新密码
              sessionStorage.setItem("password", _this.ruleForm.newPassword);
              ElementUI.Message.success("修改成功，下一次登录时生效！！");
              _this.resetForm();
            }else{
              ElementUI.Message.error("修改失败！！请重试");
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
        this.$router.push('/home');
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>

<style>
.reg h1 {
  font-size: 60px;
  position: center;
  margin-bottom: 50px;
}

.reg .el-form-item {
  width: 25%;
  font-size: 30px;
  height: 100px;
  margin-bottom: 10px;
}

.reg .el-form-item__label {
  font-size: 30px;
  height: 50px;
  color: #1095ce;
  background-color: rgba(7, 234, 97, 0.63);
  width: 150px;
  border-radius: 15px;
  padding-top: 5px;
  text-align: center;
  margin-bottom: -45px;
}

.reg .el-input__inner {
  width: 60%;
  height: 50px;
  margin-left: 200px;
  margin-top: -10px;
  font-size: 20px;
}

.reg .el-button {
  margin-left: 50px;
  width: 35%;
  height: 50px;
  position: relative;
  left: -5%;
  display: inline-block;
  border-radius: 20px;
}

</style>