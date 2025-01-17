import React from 'react'
import Navbar from '../components/Navbar'
import Editor from '@monaco-editor/react';

const EditorPage = () => {
  return (
    <>
    <Navbar />
    <div className='flex items-center justify-between' style={{height:"calc(100vh - 90px)"}}>
    <div className='left w-[50%] h-full '>
    <Editor theme='vs-dark' height="100%" width="100%" language="javascript" value="print('hello')" />;
    </div>

    </div>

      
    </>

  )
}

export default EditorPage
