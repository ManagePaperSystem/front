<template>
  <el-table
      :data="tableData"
      style="width: 100%">
    <el-table-column
        label="试卷生成时间"
        width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.timeContent }}</span>
      </template>
    </el-table-column>
    <el-table-column
        label="姓名"
        width="180">
      <template slot-scope="scope">
          <p>{{ scope.row.uname }}</p>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
            size="mini"
            @click="viewSpecifyPaper(scope.row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
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
    this.getCurrentUserPapers();
    console.log(this.username)
  },
  methods: {
    viewSpecifyPaper(row) {
      let viewTime = row.timeContent
      sessionStorage.setItem("timeString",viewTime)
      this.$router.push('/specifyPaper');
    },

    getCurrentUserPapers() {
      console.log("name" + this.username)
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