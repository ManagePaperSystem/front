<template>
  <div class="log">
    <h1>登&nbsp;&nbsp;录</h1>
    <center>
      <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="login-from"
          prop="prop"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="ruleForm.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button
            type="primary"
            @click="submitForm"
            v-loading="loading"
            style=" margin-top: 40px"
        >登录</el-button
        >
        <el-button @click="resetForm" style="margin-left: 30px" type="danger">重置</el-button>
        <router-link to="/register">
          <el-button style="margin-left: 30px" type="success">注册</el-button>
        </router-link>
      </div>
    </center>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js/crypto-js'
export default {
  data() {

    return {
      ruleForm: {
        uname: "",
        password: "",
      },
      rules: {
        uname: [
          { required: true, message: "用户名不能为空！", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" },
        ],
      },
      loading: false, // 是否显示加载动画
    };
  },
  methods: {
    myEncrypt(word){
      //密钥和偏移量
      let key = CryptoJS.enc.Utf8.parse("1234567890123456");
      let iv =  CryptoJS.enc.Utf8.parse('1234567890123456');
      console.log("key  " +  key)
      console.log("iv  " + iv)
      let srcs = CryptoJS.enc.Utf8.parse(word);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      console.log("加密后", CryptoJS.enc.Base64.stringify(encrypted.ciphertext))
      console.log("解密后", this.myDecrypt(CryptoJS.enc.Base64.stringify(encrypted.ciphertext)))
      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },
    myDecrypt(word) {
      let key = CryptoJS.enc.Utf8.parse("1234567890123456");
      let iv =  CryptoJS.enc.Utf8.parse('1234567890123456');
      let base64 = CryptoJS.enc.Base64.parse(word);
      let src = CryptoJS.enc.Base64.stringify(base64);

      var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });

      var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    submitForm() {
      // 验证表单中的账号密码是否有效，因为在上面rules中定义为了必填 required: true
      this.$refs.ruleForm.validate((valid) => {
        // 点击登录后，让登录按钮开始转圈圈（展示加载动画）
        this.loading = true;
        // 如果经过校验，账号密码都不为空，则发送请求到后端登录接口
        if (valid) {
          let _this = this;
          // 使用 axios 将登录信息发送到后端
          this.axios({
            url: "/user/login",               // 请求地址
            method: "post",                       // 请求方法
            headers:{
              'Content-Type':'application/x-www-form-urlencoded'
              // 'Content-Type':'application/json'
            },
            data: "Account="+this.ruleForm.uname + "&Password=" + this.myEncrypt(this.ruleForm.password)
          }).then((res) => { // 当收到后端的响应时执行该括号内的代码，res 为响应信息，也就是后端返回的信息
            if (res.data.flag === true) {  // 当响应的编码为 0 时，说明登录成功
              // 将用户信息存储到sessionStorage中
              sessionStorage.setItem("username", this.ruleForm.uname);
              sessionStorage.setItem("password", this.ruleForm.password);
              // 跳转页面到首页
              this.$router.push('/home');
              // 显示后端响应的成功信息
              this.$message({
                message: "登录成功",
                type: "success",
              });
            } else {
              console.log("响应失败");
              // 当响应的编码不为 0 时，说明登录失败
              // 显示后端响应的失败信息
              this.$message({
                message: "登录失败",
                type: "warning",
              });
            }
            // 不管响应成功还是失败，收到后端响应的消息后就不再让登录按钮显示加载动画了
            _this.loading = false;
          });
        } else {  // 如果账号或密码有一个没填，就直接提示必填，不向后端请求
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    }
  },
};
</script>

<style>

.log h1 {
  font-size: 60px;
  position: center;
  margin-bottom: 50px;
}

.log .el-form-item {
  width: 25%;
  font-size: 30px;
  height: 100px;
  margin-bottom: 10px;
}

.log .el-form-item__label {
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

.log .el-input__inner {
  width: 60%;
  height: 50px;
  margin-left: 200px;
  margin-top: -10px;
  font-size: 20px;
}

.log .el-button {
  margin-left: 50px;
  width: 10%;
  height: 50px;
  position: relative;
  display: inline-block;
  border-radius: 20px;
  font-size: 25px;
  padding-top: 10px;
}
</style>