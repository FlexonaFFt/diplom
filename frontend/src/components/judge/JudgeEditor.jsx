import Editor from '@monaco-editor/react';

const JudgeEditor = ({ value, onChange, language = 'python', height = 360 }) => {
  const handleChange = (nextValue) => {
    onChange(nextValue || '');
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 }
        }}
      />
    </div>
  );
};

export default JudgeEditor;
