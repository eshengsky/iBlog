import Vue from 'vue';
import { Editor, Viewer } from '@toast-ui/vue-editor';
import '@toast-ui/editor/dist/i18n/zh-cn.js';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

Vue.component('editor', Editor);
Vue.component('viewer', Viewer);
