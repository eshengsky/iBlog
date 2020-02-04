import Vue from 'vue';
import { Editor, Viewer } from '@toast-ui/vue-editor';
import 'tui-editor/dist/tui-editor-extScrollSync';
import './tui-editor-exts';
import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';

Vue.component(Editor.name, Editor);
Vue.component(Viewer.name, Viewer);
