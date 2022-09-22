<template>
  <div class="box-card">
    <h2>注&nbsp;&nbsp;册</h2>
    <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="uname">
        <el-input v-model="ruleForm.uname" placeholder="请输入邮箱号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass" >
        <el-input
            placeholder="请输入密码"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password" >
        <el-input
            placeholder="请再次输入密码"
            type="password"
            v-model="ruleForm.passwordCheck"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="mailIdentification" >
        <el-input
            placeholder="请输入验证码"
            type="mailIdentification"
            v-model="ruleForm.mailIdentification"
            autocomplete="off"
        ></el-input>
        <el-button type="success" @click="getCode">发送验证码</el-button>
      </el-form-item>
    </el-form>
    <div class="btnGroup">
      <el-button type="primary" @click="submitForm"  v-loading="loading"
      >提交</el-button
      >
      <el-button type="danger" @click="resetForm">重置</el-button>
      <el-button type="info" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import ElementUI from "element-ui";
import CryptoJS from "crypto-js/crypto-js";

export default {
  data() {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }else {
        this.$message({
          message: "请输入合法的邮箱",
          type: 'warning'
        })
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
        uname: "",
        password: "",
        passwordCheck: "",
        mailIdentification:"",
      },
      rules: {
        uname: [
          { required: true, validator: checkEmail,trigger: "blur" },
        ],
        password: [{ required: true, validator: validatePasswordLegal, trigger: "blur" }],
        passwordCheck: [
          { required: true, validator: validatePasswordSame, trigger: "blur" },
        ],
      },
      loading: false
    };
  },
  methods: {
    myEncrypt(word){
      //密钥和偏移量
      let key = CryptoJS.enc.Utf8.parse("1234567890123456");
      let iv =  CryptoJS.enc.Utf8.parse('1234567890123456');
      let srcs = CryptoJS.enc.Utf8.parse(word);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      console.log("加密后", encrypted.ciphertext)
      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },
    getCode(){
      this.$refs.ruleForm.validate((valid)=> {
        if(valid) {
          this.axios({
            url: "/user/getcode",
            method: "post",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: "Account=" + this.ruleForm.uname
          }).then((res) => {
            if (res.data.flag === true) {
              console.log("邮箱发送验证码成功")
            } else if (res.data.flag === false) {
              this.$message({
                message: "邮箱已经被注册，请换一个邮箱",
                type: "warning",
              });
            } else {
              this.$message({
                message: "网络错误",
                type: "warning",
              })
            }
          })
        }
      }
    )
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        this.loading = true;  // 提交按钮显示加载动画
        if (valid) {
          let _this = this;
          this.axios({     // axios 向后端发起请求
            url: "/user/reg",  // 请求地址
            method: "post",             // 请求方法
            headers:{
              'Content-Type':'application/x-www-form-urlencoded'
              // 'Content-Type':'application/json'
            },
            data:"Account=" + this.ruleForm.uname + "&Passcode=" + this.ruleForm.mailIdentification
          }).then((res) => { // 当收到后端的响应时执行该括号内的代码，res 为响应信息，也就是后端返回的信息
            if (res.data.flag === true) {  //返回true为成功
              // 显示后端响应的成功信息
              this.axios({
                url:"/user/set",
                method:"post",
                headers:{
                  'Content-Type':'application/x-www-form-urlencoded'
                },
                data:"Account=" + this.ruleForm.uname + "&Password=" + this.myEncrypt(this.ruleForm.password)
              }).then( (response)=> {
                response.data;
                ElementUI.Message.success("注册成功");
                this.$router.push('/login');
              })
            }else{  // 当响应的编码不为 0 时，说明注册失败
              // 显示后端响应的失败信息
              ElementUI.Message.error("注册失败！！");
            }
            // 不管响应成功还是失败，收到后端响应的消息后就不再让登录按钮显示加载动画了
            _this.loading = false;
            console.log(res);
          });
        } else { // 如果账号或密码有一个没填，就直接提示必填，不向后端请求
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>

.box-card h2 {
  font-size: 60px;
  position: center;
  margin-bottom: 50px;
}

.box-card .el-form-item {
  width: 25%;
  font-size: 30px;
  height: 100px;
  margin-bottom: 0;
  position: relative;
  left: 650px;
}

.box-card .el-form-item__label {
  font-size: 30px;
  height: 50px;
  color: #1095ce;
  background-color: rgba(7, 234, 97, 0.63);
  width: 150px;
  border-radius: 15px;
  padding-top: 5px;
  text-align: center;
  margin-bottom: -45px;
  position: center;
}

.box-card .el-input__inner {
  width: 60%;
  height: 50px;
  margin-left: 200px;
  margin-top: -10px;
  font-size: 20px;
  position: center;
}

.box-card .el-button {
  margin-left: 50px;
  width: 200px;
  height: 50px;
  position: relative;
  left: 250px;
  display: inline-block;
  border-radius: 20px;
  font-size: 25px;
  padding-top: 10px;
  margin-top: 40px;
}

.box-card .btnGroup .el-button {
  margin-left: 50px;
  width: 200px;
  height: 50px;
  position: relative;
  left: -18px;
  display: inline-block;
  border-radius: 20px;
  font-size: 25px;
  padding-top: 10px;
  margin-top: 70px;
}
</style>