<template>
<!-- 投递详情 -->
  <div class="delivery">
    <div class="delivery-button">
      <div class="search">
        <el-input placeholder="请输入姓名" v-model="input" clearable>
        </el-input>
        <el-button type="success" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="delivery-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="realname" label="姓名"> </el-table-column>

        <el-table-column prop="company_name" label="投递公司" align="center">
        </el-table-column>
        <el-table-column prop="gangwei_name" label="岗位" align="center">
        </el-table-column>
        <el-table-column prop="money" label="工资" align="center">
        </el-table-column>
        <el-table-column prop="zhuangye" label="基本要求" align="center">
        </el-table-column>
        <el-table-column label="投递时间" align="center">
          <template v-slot="{ row }">
            {{ row.time | toTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <!-- <span class="botton" @click="edit(row)">编辑</span> -->
            <span class="botton" @click="del(row)">删除</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="{ row }">
            <el-select
              v-model="row.ispass"
              @change="change(row)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in selected"
                :key="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="zhuangye" label="是否录用" align="center">
        </el-table-column> -->
      </el-table>
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
      selected: [
        {
          value: "未开始",
          id: 1,
        },
        {
          value: "未通过",
          id: 2,
        },
        {
          value: "通过",
          id: 3,
        },
      ],
    };
  },
  filters: {
    toTime(data) {
      if (data) {
        var time = new Date(data);
        var year = time.getFullYear();
        var month =
          time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1;
        var data = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
        var hours =
          time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        var minutes =
          time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        var Timeed =
          year + "-" + month + "-" + data + " " + hours + ":" + minutes;
        return Timeed;
      }
      return null;
    },
  },
  methods: {
    change(data) {
      let that = this
      let datas = {
        c_id: data.c_id,
        p_id:data.p_id,
        ispass: data.ispass,
      };
      console.log(data)
      this.$axios({
        method: "POST",
        url: url + ":1234/updateState",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify(datas),
      }).then(()=>{
        that.load()
      });
    },
    del(data) {
      console.log(data);
      this.$confirm("请确认学生是否取消该投递?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "GET",
            url: url + ":1234/delDeliveryByid",
            params: {
              p_id: data.p_id,
              c_id: data.c_id,
            },
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
    search() {
      let that = this;
      if (this.input) {
        this.$axios({
          url: url + ":1234/findByNames?name=" + this.input,
          method: "GET",
        }).then((res) => {
          console.log(res);
          console.log(res.data[0].id);
          var id = res.data[0].id;
          this.$axios({
            method: "GET",
            url: url + ":1234/findAllDeliveryByid?id=" + id,
          }).then((res) => {
            this.tableData = res.data;
            //console.log(res)
          });
        // 暂时不要
         /* this.$axios({
            method: "GET",
            url: url + ":1234/addDeliveryTimeById?id=" + id,
          }).then((res) => {
            console.log(res);
            that.tableData.forEach((item, index) => {
              item.time = res.data[index].time;
            });
          });*/
        });
      } else {
        this.load();
      }
    },
    load() {
      let that = this;
      this.$axios({
        method: "GET",
        url: url + ":1234/findAllDelivery",
      }).then((res) => {
        this.tableData = res.data;
        // 暂时不要
        /*this.$axios({
          url: url + ":1234/addDeliveryTime",
          method: "GET",
        }).then((res) => {
          that.tableData.forEach((item, index) => {
            item.time = res.data[index].time;
            item.ispass = res.data[index].ispass;
          });
          console.log(that.tableData);
        });*/
      });
    },
  },
  created() {
    this.load();
  },
};
</script>

 <style lang="scss" scoped>
.delivery {
  border-top: 1px rgb(78, 77, 77) solid;
  padding: 10px;
  .el-input {
    width: 10%;
    /deep/ .el-input__inner {
      color: #000;
    }
  }
  .botton {
    color: r7gb(79, 79, 230);
    cursor: pointer;
  }
}
</style>