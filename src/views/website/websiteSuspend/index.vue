<template>
  <div>
    <!-- <div class="form_container">
      <h2>对指定网站封停/解除网站</h2>
      <form class="form_content" action="">
        <p class="item_first"><span>*</span>网站URL：<input type="text" name="" placeholder="输入网站URL"></p>
        <p class="item_second">网站名：<input type="text" name="" placeholder="输入网站名"></p>
        <p>封站原因：<input type="text" name="" placeholder="输入封网站原因"></p>
        <div class="form_content_button">
          <el-button type="info">封站</el-button>
          <el-button type="info">解封网站</el-button>
        </div>
      </form>
      <p class="form_footer">
        <span>累计被封网站总数</span>
        <span>：</span>
        <span>0</span>
      </p>
    </div> -->
    <base-crud resource="WebsiteSuspend"></base-crud>
  </div>
</template>

<script>
import BaseCRUD from '@/components/BaseCRUD'

export default {
  components: {
    'base-crud': BaseCRUD
  }
}
</script>

<style lang="scss" scoped>
// .form_container{
//   padding: 20px;
//   .form_content {
//     padding: 10px 20px;
//     border: 1px solid #ababab;
//     p {
//       display: inline-block;
//       width: 600px;
//       input {
//         width: 350px;
//       }
//     }
//     .item_first {
//       // display: flex;
//       // align-items: center;
//       span {
//         margin-top: 8px;
//         // font-size: 150%;
//         color: #ff0000;
//       }
//     }
//     // .item_first::before {
//     //   content: ' *';
//     //   color: #ff0000;
//     //   font-size: 150%;
//     //   margin-top: 30%;
//     // }
//     &_button {
//       display: flex;
//       justify-content: flex-end;
//       padding-right: 50px;
//       button {
//         // width: 98px;
//       }
//     }
//   }
//   .form_footer {
//     display:flex; 
//     justify-content: flex-end;
//   }
// }
</style>
