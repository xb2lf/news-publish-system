/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 17:59:34
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-20 22:15:52
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const NewsEditor = (props) => {
  const { getContent, content } = props;
  const [editorState, setEditorState] = useState('');

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };
  const handleBlur = () => {
    const currentContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    getContent(currentContent);
  };

  useEffect(() => {
    if (content === undefined) return;
    const contentBlock = htmlToDraft(content);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const currEditorState = EditorState.createWithContent(contentState);
      setEditorState(currEditorState);
    }
  }, [content]);

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName='toolbar'
        wrapperClassName='wrapper'
        editorClassName='editor'
        onEditorStateChange={handleEditorStateChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default NewsEditor;
