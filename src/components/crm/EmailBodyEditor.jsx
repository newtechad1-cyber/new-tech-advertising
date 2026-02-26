import React, { useCallback } from 'react';
import ReactQuill from 'react-quill';

export default function EmailBodyEditor({ value, onChange }) {
  const handleChange = useCallback((val) => {
    onChange(val);
  }, [onChange]);

  return (
    <div className="bg-white rounded-lg">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}