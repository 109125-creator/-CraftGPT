/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, markdownContent }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BlockForge_Studio_Bedrock_Addon_Specification.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-800" />
            <h3 className="text-base font-bold text-neutral-900">
              匯出 BlockForge Studio 規格需求與架構文件 (Markdown)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-neutral-800 bg-neutral-50 leading-relaxed whitespace-pre-wrap">
          {markdownContent}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-end gap-3 bg-white">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '已複製到剪貼簿' : '複製 Markdown'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>下載 .md 規格書檔案</span>
          </button>
        </div>
      </div>
    </div>
  );
};
