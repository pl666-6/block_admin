<template>
  <!-- 个人 -->
  <div class="index">
    <div class="index-top">
      <el-button type="primary" @click="toAdd">新增</el-button>
      <div class="search">
        <el-input placeholder="请输入姓名" v-model="input" clearable></el-input>
        <el-button type="success" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="index-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="birthday" label="出生日期"></el-table-column>
        <el-table-column prop="school" label="学校"></el-table-column>
        <el-table-column prop="major" label="专业"></el-table-column>
        <el-table-column prop="Expected_location" label="期望岗位"></el-table-column>
        <el-table-column label="操作" align="center">
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
        <el-form-item label="姓名">
          <el-input v-model="form.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <br />
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <!-- <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.date1"
              style="width: 100%"
            ></el-date-picker>
          </el-col>-->
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex">
            <el-option v-for="item in options2" :key="item.id" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院">
          <br />
          <!-- <el-input v-model="form.school" autocomplete="off"></el-input> -->
          <el-select v-model="form.school" @change="change" placeholder="请选择学院">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <!-- <el-input v-model="form.major" autocomplete="off"></el-input> -->
          <br />
          <el-select v-model="form.major" @change="change1" placeholder="请选择专业">
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望岗位">
          <el-input v-model="form.Expected_location" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import url from "@/http.js";
export default {
  data() {
    return {
      tableData: [],
      title: "新增",
      input: "",
      dialogTableVisible: false,
      form: {
        realname: "",
        username: "",
        birthday: "",
        password: "",
        sex: "",
        age: "",
        major: "",
        school: "",
        Expected_location: ""
      },
      options: [],
      options1: [],
      options2: ["男", "女"]
    };
  },
  methods: {
    change1(data) {
      this.$forceUpdate();
      var that = this;
      console.log(data);
      this.$nextTick(() => {
        that.form.major = data;
      });
    },
    change(data) {
      var that = this;
      this.options1 = [];
      this.$axios({
        url: url + ":1234/finZhuanYe?id=" + data,
        method: "GET"
      }).then(res => {
        that.options1 = res.data;
        this.form.major = "";
      });
    },
    search() {
      this.$axios({
        method: "get",
        url: url + ":1234/findByName?name=" + this.input
      }).then(res => {
        this.tableData = res.data;
      });
    },
    del(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method: "GET",
            url: url + ":1234/del?id=" + data.id
          }).then(res => {
            console.log(res);
            this.load();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edit(data) {
      this.form.realname = data.realname;
      this.form.username = data.username;
      this.form.birthday = data.birthday;
      this.form.password = data.password;
      this.form.sex = data.sex;
      this.form.age = data.age;
      this.form.major = data.major;
      this.form.school = data.school;
      this.form.Expected_location = data.Expected_location;
      this.form.id = data.id;
      console.log(data);
      this.dialogTableVisible = true;
    },
    save() {
      var data = this.form;
      this.$axios({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: url + ":1234/saveOredit",
        data: qs.stringify(data)
      }).then(res => {
        console.log(res);
        if (res.data == "注册成功") {
          this.$message({
            message: res.data,
            type: "success"
          });
          this.load();
          this.dialogTableVisible = false;
        } else {
          this.$message({
            message: res.data,
            type: "warning"
          });
          this.load();
          this.dialogTableVisible = false;
        }
      });
      /* $.ajax({
        method: "POST",
        url: url + ":1234/saveOredit",
        data,
        success: function (res) {
          console.log(res);
          this.load();
          this.dialogTableVisible = false;
        },
      });*/
    },
    toAdd() {
      this.form = {};
      this.title = "新增个人信息";
      this.dialogTableVisible = true;
    },
    load() {
      this.$axios({
        url: url + ":1234/findXueYuan",
        method: "GET"
      }).then(res => {
        this.options = res.data;
      });
      this.$axios({
        url: url + ":1234/findUser",
        method: "get"
      }).then(res => {
        this.tableData = res.data;
        console.log(this.tableData);
      });
    }
  },
  created() {
    this.load();
  }
};
</script>

<style lang="scss" scoped>
.index {
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
    .index-top {
      *zoom: 1;
    }
    /*ie6 7 不支持伪元素*/
    .index-top:after {
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
