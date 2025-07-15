import React from 'react';
import { Save, X } from 'lucide-react';

interface NoticeEditorProps {
  notice: string;
  onChange: (notice: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NoticeEditor: React.FC<NoticeEditorProps> = ({
  notice,
  onChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Edit Notice</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <textarea
        value={notice}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        placeholder="Edit your legal notice here..."
      />
    </div>
  );
};