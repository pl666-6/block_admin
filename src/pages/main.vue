<template>
<!-- 企业 -->
  <div class="company">
    <div class="company-button">
      <el-button type="primary" @click="toAdd">新增</el-button>
      <div class="search">
        <el-input placeholder="请输入公司名称" v-model="input" clearable>
        </el-input>
        <el-button type="success" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="company-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="company_name" label="名称"> </el-table-column>
        <el-table-column prop="gangwei_name" label="岗位" align="center">
        </el-table-column>
        <el-table-column prop="gangwei_id" label="需求人数" align="center">
        </el-table-column>
        <el-table-column prop="money" label="工资" align="center">
        </el-table-column>
        <el-table-column prop="zhuangye" label="基本要求" align="center">
        </el-table-column>
        <el-table-column prop="end_time" label="截止时间" align="center">
        </el-table-column>
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
        <el-form-item label="名称">
          <el-input v-model="form.company_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="form.gangwei_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="截至时间">
          <br>
          <!-- <el-input v-model="form.time" autocomplete="off"></el-input> -->
          <el-date-picker
            v-model="form.end_time"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="需求人数">
          <el-input v-model="form.gangwei_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工资">
          <el-input v-model="form.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="基本要求">
          <el-input v-model="form.zhuangye" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规模">
          <el-input v-model="form.scale" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="行业">
          <el-input v-model="form.hangye" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职责">
          <el-input v-model="form.reqiuire" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input
            type="textarea"
            v-model="form.introduction"
            autocomplete="off"
          ></el-input>
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
import url from '@/http.js'
export default {
  data() {
    return {
      input: "",
      title: "新增岗位信息",
      tableData: [],
      form: {
        time: "",
        company_name: "",
        gangwei_name: "",
        gangwei_id: "",
        money: "",
        zhuangye: "", //专业
        phone: "",
        address: "",
        scale: "",
        hangye: "",
        reqiuire: "",
        introduction: "",
        id: "",
      },
      dialogTableVisible: false,
    };
  },
  methods: {
    edit(data) {
      this.title = "修改招聘信息";
      this.dialogTableVisible = true;
      (this.form.company_name = data.company_name),
        (this.form.gangwei_name = data.gangwei_name),
        (this.form.gangwei_id = data.gangwei_id),
        (this.form.money = data.money),
        (this.form.zhuangye = data.zhuangye),
        (this.form.phone = data.phone),
        (this.form.address = data.address),
        (this.form.scale = data.scale),
        (this.form.hangye = data.hangye),
        (this.form.reqiuire = data.reqiuire),
        (this.form.introduction = data.introduction);
      this.form.time = data.time;
      this.form.id = data.id;
    },
    del(data) {
      this.$confirm("此操作将永久删除该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: url + ":1234/delCompanyInfo?id=" + data.id,
            method: "GET",
          }).then((res) => {
            console.log(res);
            this.load();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
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
      this.title = "新增招聘信息";
      this.form = {};
      this.dialogTableVisible = true;
    },
    save() {
      var data = this.form;
      this.$axios({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: url + ":1234/saveOreditCompany",
        data: qs.stringify(data),
      }).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        console.log(res);
        this.dialogTableVisible = false;
        this.load();
      });
    },
    search() {
      this.$axios({
        method: "get",
        url: url + ":1234/searchCompanyByname?name=" + this.input,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    load() {
      this.$axios({
        method: "GET",
        url: url + ":1234/findAllCompany",
      }).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
    },
  },
  created() {
    this.load();
  },
};
</script>


<style lang="scss">
.company {
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
    .company-top {
      *zoom: 1;
    }
    /*ie6 7 不支持伪元素*/
    .company-top:after {
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