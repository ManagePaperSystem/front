<template>
  <div>
  <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
    <el-table-column
        label="试卷生成时间"
        width="300"
        prop="timeContent"
    >
    </el-table-column>
    <el-table-column
        label="姓名"
        width="300"
        prop="uname"
    >
    </el-table-column>
    <el-table-column label="操作" width="300">
      <template slot-scope="scope">
        <el-button
            @click="viewSpecifyPaper(scope.row)">查看</el-button>
        <el-button
            type="danger"
            @click="deletePaper(scope.$index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="returnHome">返回首页</el-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading :true,
      tableData:[
        {
          timeContent:'',
          uname:''
        }
      ],
      username:'',
      timeList:[],
    }
  },
  mounted() {
    this.tableData.pop()
    this.username = sessionStorage.getItem("username");
    this.password = sessionStorage.getItem("password");
    this.loading=true;
    this.getCurrentUserPapers();
    this.loading=false;
  },
  methods: {
    returnHome() {
      this.$router.push('/home');
    },
    deletePaper(index){
      let deleteData = this.tableData[index];
      this.axios({
        url:"question/delete",
        method:"post",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: "Account=" + this.username + "&TimeStr=" +deleteData['timeContent'] }
        ).then( (response)=> {
        if(response.data.flag ){
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.tableData.splice(index,1)
        }else {
          this.$message({
            message: "查看当前用户试卷信息失败",
            type: "warning"
          });
        }
      })
      },
    viewSpecifyPaper(row) {
      let viewTime = row.timeContent
      sessionStorage.setItem("timeString",viewTime)
      this.$router.push('/specifyPaper');
    },

    getCurrentUserPapers() {
      this.axios({
        url: "/question/check/list",
        method: "post",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: "Account=" + this.username
      }).then((response) => {
        if ( response.data.length ) {
          let size = response.data.length
          for (let i = 0; i < size; i++) {
            this.timeList.push(response.data[i])
            this.tableData.push({
              timeContent: this.timeList[i],
              uname:this.username
            })
          }
        } else {
          this.$message({
            message: "查看当前用户试卷信息失败",
            type: "warning"
          });
        }
      })
    },
  }
}
</script>