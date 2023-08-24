import { useRef, useContext, useEffect } from "react";
//토스트 에디터 : npm i --save @toast-ui/editor @toast-ui/react-editor --force
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
//토스트 에디터 code Syntax Highlight : npm install @toast-ui/editor-plugin-code-syntax-highlight --force
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import { useLocation } from 'react-router-dom';

import { CoggleWriteContext } from './coggle/CoggleWrite.js'
import { CokkiriWriteContext } from './recruit/cokkiri/CokkiriWrite.js'
import { CokkiriEditContext } from './recruit/cokkiri/CokkiriEdit.js'
import { MammothWriteContext } from './recruit/mammoth/MammothWrite.js'
import { MammothEditContext } from './recruit/mammoth/MammothEdit.js'

/**
 * @param {*} props : {mode : 'write'/'edit', page : 'xxxx_write'}
 * @returns 
 */
export default function ToastEditor({props}) {
  const coggleWriteContext = useContext(CoggleWriteContext);
  const cokkiriWriteContext = useContext(CokkiriWriteContext);
  const cokkiriEditContext = useContext(CokkiriEditContext);
  const mammothWriteContext = useContext(MammothWriteContext);
  const mammothEditContext = useContext(MammothEditContext);
  
  const editorRef = useRef();
  const location = useLocation();

  useEffect(()=> {
    /**
     * Edit - 수정 페이지 입력란 DB데이터 초기화
     * props mode속성이 edit이고 content속성이 존재할때 작동한다.
     */
    if (props.mode === 'edit') {
      editorRef.current?.getInstance().setHTML(props.content);
    }
  },[props.content]) //

  /**
   * onChange Event
   * 입력시 전역변수 value 초기화 (수정/삭제 공통)
   */
  const onChange = () => {
    switch (location.pathname) { // url을 기준으로 context선택 및 전역변수 초기화
      case '/coggle-write' : 
        coggleWriteContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        coggleWriteContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
        break;
      case '/cokkiri-write' : 
        cokkiriWriteContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        cokkiriWriteContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
        break;
      case '/mammoth-write' : 
        mammothWriteContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        mammothWriteContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
        break;
      case '/cokkiri-edit' : 
        cokkiriEditContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        cokkiriEditContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
        break;
      case '/mammoth-edit' : 
        mammothEditContext.setToastHtml(editorRef.current?.getInstance().getHTML());
        mammothEditContext.setMarkdown(editorRef.current?.getInstance().getMarkdown());
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