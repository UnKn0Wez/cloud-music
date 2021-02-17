<template>
  <div>
    <div class="filter-container">
      <el-upload
        class="upload-demo"
        action="http://localhost:3000/swiper/upload"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <el-button size="small" type="primary" style="margin-left: 60px"
          >点击上传</el-button
        >
      </el-upload>
    </div>
    <el-table v-loading="loading" :data="swiperList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="65" width="200" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该歌单吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del } from "@/api/swiper";
export default {
  data() {
    return {
      swiperList: [],
      loading: false,
      delDialogVisible: false,
      swiper: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //加载轮播图
    getList() {
      this.loading = true;
      fetchList().then((res) => {
        console.log(res);
        this.swiperList = res.data;
        this.loading = false;
      });
    },
    //上传成功的回调函数
    uploadSuccess(res) {
      if (res.id_list.length > 0) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        //重新请求数据
        this.getList();
      }
    },
    onDel(row) {
      this.swiper = row;
      console.log(this.swiper);
      this.delDialogVisible = true;
    },
    //删除文件
    doDel() {
      this.delDialogVisible = false;
      this.loading = true;
      console.log(this.swiper)
      del(this.swiper).then((res) => {
        this.loading = false;
        //删除成功，重新加载轮播图数据
        if (res.data.delDBRes.deleted === 1) {
          this.getList();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        }else {
          this.$message.error("删除失败");
        }
      });
    },
  },
};
</script>

<style>
</style>