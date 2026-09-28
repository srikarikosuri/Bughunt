import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../types';

interface MonacoEditorWrapperProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  language,
  code,
  onChange,
  readOnly = false,
  height = '480px',
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom theme matching dark navy / neon purple aesthetic
    monaco.editor.defineTheme('bughunt-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string', foreground: '38bdf8' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'identifier', foreground: 'e2e8f0' },
        { token: 'type', foreground: '34d399' },
      ],
      colors: {
        'editor.background': '#070b14',
        'editor.foreground': '#f1f5f9',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#a855f7',
        'editor.selectionBackground': '#3b82f640',
        'editor.inactiveSelectionBackground': '#3b82f620',
        'editorCursor.foreground': '#38bdf8',
        'editorWhitespace.foreground': '#1e293b',
        'editorIndentGuide.background': '#1e293b',
        'editorIndentGuide.activeBackground': '#475569',
      },
    });

    monaco.editor.setTheme(theme === 'dark' ? 'bughunt-dark' : 'vs');
  };

  // Map our language enum to monaco language ID
  const getMonacoLanguage = (lang: Language): string => {
    switch (lang) {
      case 'python':
        return 'python';
      case 'javascript':
        return 'javascript';
      case 'java':
        return 'java';
      case 'c':
        return 'c';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#070b14] shadow-xl">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={code}
        theme={theme === 'dark' ? 'bughunt-dark' : 'vs'}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 14, bottom: 14 },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          renderWhitespace: 'none',
          tabSize: language === 'python' ? 4 : 2,
        }}
        loading={
          <div className="flex items-center justify-center h-full text-sm text-slate-400 font-mono bg-[#070b14]">
            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full mr-2"></div>
            Loading Monaco Editor...
          </div>
        }
      />
    </div>
  );
};
