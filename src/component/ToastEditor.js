import { useRef, useContext } from "react";
//토스트 에디터 : npm i --save @toast-ui/editor @toast-ui/react-editor --force
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
//토스트 에디터 code Syntax Highlight : npm install @toast-ui/editor-plugin-code-syntax-highlight --force
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';

import { Coggle } from './coggle/CoggleWrite.js'
import { Mammoth } from './recruit/MammothWrite.js'

export default function ToastEditor({props}) {
  const coggleContext = useContext(Coggle);
  const mammothContext = useContext(Mammoth);
  
  const editorRef = useRef();
  
  const onChange = () => {
    switch (props) {
      case 'coggle' : 
        coggleContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        coggleContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
        break;
      case 'mammoth' : 
        mammothContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        mammothContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
        break;
    }

  };

  return(
    // <div id="editor_margin"  >
    <Editor
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}

      ref={editorRef} // DOM 선택용 useRef
      previewStyle="vertical" // 미리보기 스타일 지정
      height="600px" // 에디터 창 높이
      initialEditType="markdown" //
      toolbarItems={[
        // 툴바 옵션 설정
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock']
      ]}
      
      // style={{textAlign:"left"}}
      onChange={onChange}
      useCommandShortcut={false} // 키보드 입력 컨트롤 방지
    ></Editor>
  // </div>
  );
}