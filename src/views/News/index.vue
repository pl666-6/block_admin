<template>
<!-- 新闻通知 -->
  <div class="News">
    <div class="News-button">
      <el-button type="primary" @click="toAdd">新增</el-button>
      <div class="search">
        <el-input placeholder="请输入消息内容" v-model="input" clearable>
        </el-input>
        <el-button type="success" @click="search">搜索</el-button>
      </div>
      <div class="News-main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="news" label="内容" align="center">
          </el-table-column>
          <el-table-column prop="author" label="发布人" width="180">
          </el-table-column>
          <el-table-column prop="created" label="发布时间" width="180">
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="{ row }">
              <span class="botton" @click="edit(row)">编辑</span>
              <span class="botton" @click="del(row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 弹窗 -->
      <el-dialog :title="title" :visible.sync="dialogTableVisible">
        <el-form>
          <el-form-item label="发布人">
            <el-input v-model="form.author" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="通知内容">
            <el-input
              v-model="form.news"
              autocomplete="off"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import url from '@/http.js'
export default {
  data() {
    return {
      input: "",
      tableData: [],
      form: {
        author: "",
        news: "",
        id: "",
        created: "",
      },
      title: "",
      dialogTableVisible: false,
      temp:''
    };
  },
  created() {
    this.load();
  },

  methods: {
    save() {
      var data = this.form;
      this.$axios({
        url: url + ":1234/saveOreditNew",
        data: qs.stringify(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.load();
        this.dialogTableVisible = false;
      });
    },
    edit(data) {
      this.title = "修改";
      this.form.author = data.author;
      this.form.news = data.news;
      this.form.id = data.id;
      this.form.created = data.created;
      this.dialogTableVisible = true;
    },
    del(data) {
      this.$confirm("此操作将永久删除该通知, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: url + ":1234/delNews",
            method: "GET",
            params: {
              id: data.id,
            },
          }).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.dialogTableVisible = false;
            this.load();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    toAdd() {
      this.title = "新增";
      this.form = {};
      this.dialogTableVisible = true;
    },
    search() {
      var datas = this.input
      this.$axios({
        method: "GET",
        url: url + ":1234/NewsBycontent",
        params:{
            content:datas
        }
      }).then(res=>{
          console.log(res)
          this.tableData = res.data
      });
    },
    load() {
      this.$axios({
        url: url + ":1234/News",
        method: "GET",
      }).then((res) => {
        this.tableData = res.data;
        this.tableData.forEach((item, index) => {
          var time = new Date(item.created);
          var year = time.getFullYear();
          var month =
            time.getMonth() + 1 < 10
              ? "0" + (time.getMonth() + 1)
              : time.getMonth() + 1;
          var data =
            time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
          var hours =
            time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
          var minutes =
            time.getMinutes() < 10
              ? "0" + time.getMinutes()
              : time.getMinutes();
          item.created =
            year + "/" + month + "/" + data + " " + hours + ":" + minutes;
        });
        console.log(this.tableData);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.News {
  border-top: 1px rgb(78, 77, 77) solid;
  border-top: 1px rgb(78, 77, 77) solid;
  padding: 10px;
  .botton {
    color: rgb(79, 79, 230);
    cursor: pointer;
  }
  .search {
    display: inline-block;
    float: right;
    .el-input {
      width: 60%;
      /deep/ .el-input__inner {
        color: #000;
      }
    }
    .News-top {
      *zoom: 1;
    }
    /*ie6 7 不支持伪元素*/
    .News-top:after {
      content: "";
      display: block;
      clear: both;
      height: 0;
      line-height: 0;
      visibility: hidden; //允许浏览器渲染它，但是不显示出来
    }
  }
}
</style>