<template>
  <div>
    <el-table v-loading="loading" :data="blogList" stripe ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="content" label="内容" width="600"></el-table-column>
      <el-table-column prop="nickName" label="发布人"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="showDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:20px;">
      <el-button type="danger" @click="onDel" :disabled="multipleSelection.length===0">删除</el-button>
      <el-button @click="toggleSelection()">取消</el-button>
    </div>

    <!-- 博客详情对话框 -->
    <el-dialog :title="blogDetail.content" :visible.sync="detailDialogVisible" width="70%">
      <h4>图片</h4>
      <div v-for="item in blogDetail.imgs" :key="item">
        <img :src="item" width="100" height="100">
      </div>
      <h4>评论</h4>
      <ul>
        <li v-for="item in blogDetail.commentList" :key="item">
          {{item.content}}
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除所选择的博客吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,fetchDetail,del } from "@/api/blog"
import scroll from "@/utils/scroll";
export default {
  data(){
    return{
      blogList:[],
      count:50,
      delDialogVisible:false,
      loading:false,
      multipleSelection:[],
      detailDialogVisible:false,
      blogDetail:{}
    };
  },
  created(){
    this.getList();
  },
  mounted(){
    scroll.start(this.getList);
  },
  methods:{
    getList(){
      this.loading=true;
      fetchList({
        start:this.blogList.length,
        count:this.count
      }).then(res =>{
        const data=res.data;
        let _blogList=[]
        for(let i=0,len=data.length;i<len;i++){
          _blogList.push(JSON.parse(data[i]))
        }
        this.blogList=this.blogList.concat(_blogList);
        if(_blogList.length<this.count){
          scroll.end();
        }
        this.loading=false;
      });
    },
    //选择
    handleSelectionChange(val){
      this.multipleSelection=val;
      console.log(this.multipleSelection);
    },
    //取消
    toggleSelection(rows){
      if(rows){
        rows.forEach(rew=>{
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }else{
        this.$refs.multipleTable.clearSelection();
      }
    },
    //显示详情
    showDetail(blog){
      this.detailDialogVisible=true;
      const blogId=blog._id;
      fetchDetail({
        blogId
      }).then(res=>{
        console.log(res.data);
        this.blogDetail=res.data;
      })
    },
    //弹删除对话框
    onDel(){
      this.delDialogVisible=true;
    },
    //删除
    doDel(){
      this.delDialogVisible=false;
      this.loading=true;
      let ids=[];
      let imgs=[];
      this.multipleSelection.forEach(item =>{
        console.log("每篇博客");
        console.log(item);
        ids.push(item._id);
        imgs.push(item.imgs);
      });
      console.log("删除ids和imgs");
      console.log(ids);
      console.log(imgs);
      del({
        ids:JSON.stringify(ids),
        imgs:JSON.stringify(imgs)
      }).then(res=>{
        this.loading=false;
        this.blogList=[];
        this.getList();
        this.$message({
          message:"删除成功",
          type:"success"
        })
      })
    }
  }
};
</script>

<style>
</style>