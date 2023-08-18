/**
 * npm i --save @toast-ui/editor @toast-ui/react-editor
 */
import { useRef, useContext } from "react";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Coggle } from './coggle/CoggleWrite.js'

export default function ToastEditor() {
  const context = useContext(Coggle);
  
  const editorRef = useRef();
  
  const onChange = () => {
    context.setToastHtml(editorRef.current?.getInstance().getHTML());
    context.setMarkdown(editorRef.current?.getInstance().getMarkdown());
  };

  return(
    // <div id="editor_margin"  >
    <Editor
    
      ref={editorRef} // DOM 선택용 useRef
      previewStyle="vertical" // 미리보기 스타일 지정
      height="600px" // 에디터 창 높이
      initialEditType="wysiwyg" //
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