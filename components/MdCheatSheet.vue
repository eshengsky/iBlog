<template>
  <div>
    <!-- eslint-disable vue/no-v-html -->
    <table class="mcs-table">
      <thead>
        <tr>
          <th>元素</th>
          <th>Markdown 语法</th>
          <th>效果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>标题</td>
          <td>
            <code v-html="title" />
          </td>
          <td>
            <viewer :initial-value="title | clean" />
          </td>
        </tr>
        <tr>
          <td>加粗</td>
          <td>
            <code v-html="bold" />
          </td>
          <td>
            <viewer :initial-value="bold | clean" />
          </td>
        </tr>
        <tr>
          <td>斜体</td>
          <td>
            <code v-html="italic" />
          </td>
          <td>
            <viewer :initial-value="italic | clean" />
          </td>
        </tr>
        <tr>
          <td>删除</td>
          <td>
            <code v-html="strike" />
          </td>
          <td>
            <viewer :initial-value="strike | clean" />
          </td>
        </tr>
        <tr>
          <td>引用</td>
          <td>
            <code v-html="blockquote" />
          </td>
          <td>
            <viewer :initial-value="blockquote | clean" />
          </td>
        </tr>
        <tr>
          <td>有序列表</td>
          <td>
            <code v-html="ol" />
          </td>
          <td>
            <viewer :initial-value="ol | clean" />
          </td>
        </tr>
        <tr>
          <td>无序列表</td>
          <td>
            <code v-html="ul" />
          </td>
          <td>
            <viewer :initial-value="ul | clean" />
          </td>
        </tr>
        <tr>
          <td>任务列表</td>
          <td>
            <code v-html="taskList" />
          </td>
          <td>
            <viewer :initial-value="taskList | clean" />
          </td>
        </tr>
        <tr>
          <td>行内代码</td>
          <td>
            <code v-html="code" />
          </td>
          <td>
            <viewer :initial-value="code | clean" />
          </td>
        </tr>
        <tr>
          <td>块级代码</td>
          <td>
            <code v-html="blockCode" />
          </td>
          <td>
            <viewer :initial-value="blockCode | clean" :options="viewerOptions" />
          </td>
        </tr>
        <tr>
          <td>分隔线</td>
          <td>
            <code v-html="hr" />
          </td>
          <td>
            <viewer :initial-value="hr | clean" />
          </td>
        </tr>
        <tr>
          <td>链接</td>
          <td>
            <code v-html="link" />
          </td>
          <td>
            <viewer :initial-value="link | clean" />
          </td>
        </tr>
        <tr>
          <td>图片</td>
          <td style="max-width: 270px;">
            <code v-html="image" />
          </td>
          <td>
            <viewer :initial-value="image | clean" />
          </td>
        </tr>
        <tr>
          <td>表格</td>
          <td>
            <code v-html="table" />
          </td>
          <td>
            <viewer :initial-value="table | clean" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';
import editorEmojiPlugin from '../static/editor-emoji-plugin';
export default Vue.extend({
  filters: {
    clean (val) {
      return val.replace(/<br>/g, '').replace(/&nbsp;/g, ' ');
    }
  },
  data () {
    return {
      viewerOptions: {
        plugins: [[codeSyntaxHighlight, { hljs }], editorEmojiPlugin]
      },
      title: `# 1级标题
<br>## 2级标题
<br>### 3级标题
<br>#### 4级标题
<br>##### 5级标题`,
      bold: '**加粗文本**',
      italic: '*斜体文本*',
      strike: '~~已删除文本~~',
      blockquote: '> 引用内容',
      ol: `1. 第一项
<br>2. 第二项
<br>3. 第三项
<br>`,
      ul: `* 第一项
<br>* 第二项
<br>* 第三项
<br>`,
      taskList: `* [x] 已完成
<br>* [ ] 未完成1
<br>* [ ] 未完成2`,
      code: '`code`',
      blockCode: `\`\`\`js
<br>function foo() {
<br>&nbsp;&nbsp;const name = "iBlog";
<br>&nbsp;&nbsp;console.log(name);
<br>}
<br>\`\`\``,
      hr: '---',
      link: '[链接地址](https://skysun.name)',
      image: '![logo](/images/iBlog-logo.png)',
      table: `| 框架 | 类型 |
<br>| ----------- | ----------- |
<br>| Vue.js | 前端 |
<br>| Express.js | 后端 |`
    };
  }
});
</script>
<style scoped>
.mcs-table {
  width: 100%;
  border: 1px solid #eee;
  border-collapse: collapse;
}

.mcs-table th {
  background-color: #7b8184;
  font-weight: 300;
  color: #fff;
}

.mcs-table th,
.mcs-table td {
  border: 1px solid #eee;
  padding: 10px;
  word-break: break-all;
}
</style>
<style>
.mcs-table img {
  width: 100px;
}

.mcs-table .pre-header-right {
  display: none;
}
</style>
