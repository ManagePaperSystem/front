<template>
  <div>
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="80px"
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
          <el-button @click="getCode">发送验证码</el-button>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm"  v-loading="loading"
          >提交</el-button
        >
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import ElementUI from "element-ui";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.passwordCheck !== "") {
          this.$refs.ruleForm.validateField("passwordCheck");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
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
          { required: true, message: "用户名不能为空！", trigger: "blur" },
        ],
        password: [{ required: true, validator: validatePass, trigger: "blur" }],
        passwordCheck: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
      loading: false
    };
  },
  methods: {
    getCode(){
      this.axios({
        url:"/user/getcode",
        method:"post",
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        data:"Account=" + this.ruleForm.uname
      }).then((res)=>{
        if(res.data.flag === true){
          console.log("邮箱发送验证码成功")
        }else if(res.data.flag === false){
          this.$message({
            message: "邮箱已经被注册，请换一个邮箱",
            type: "warning",
          });
        }else{
          this.$message({
            message: "网络错误",
            type: "warning",
          })
        }
      })
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
                  // 'Content-Type':'application/json'
                },
                data:"Account=" + this.ruleForm.uname + "&Password=" + this.ruleForm.password
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

<style scoped>
/* 设置登录面板居中，宽度为400px */
.box-card {
  margin: auto auto;
  width: 400px;
}
/* 设置登录面板中的表单居中 */
.login-from {
  margin: auto auto;
}
</style>