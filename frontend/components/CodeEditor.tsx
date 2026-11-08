'use client';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({ code, onChange, language, readOnly = false, height = "500px" }: CodeEditorProps) {
  return (
    <Editor
      height={height}
      theme="vs-dark"
      language={language}
      value={code}
      onChange={(val) => onChange(val || '')}
      options={{ 
        minimap: { enabled: false }, 
        fontSize: 14,
        readOnly: readOnly,
        scrollBeyondLastLine: false,
        padding: { top: 16 }
      }}
    />
  );
}