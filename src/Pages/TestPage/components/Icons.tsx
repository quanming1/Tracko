import React from "react";

// 图表图标
export const ChartIcon: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="8"
      y="8"
      width="48"
      height="48"
      rx="4"
      fill="#E6F7FF"
      stroke="#1890FF"
      strokeWidth="2"
    />
    <rect x="16" y="36" width="8" height="12" rx="1" fill="#1890FF" />
    <rect x="28" y="28" width="8" height="20" rx="1" fill="#1890FF" />
    <rect x="40" y="20" width="8" height="28" rx="1" fill="#1890FF" />
    <path d="M16 24L40 16" stroke="#1890FF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="40" cy="16" r="3" fill="#1890FF" />
    <circle cx="16" cy="24" r="3" fill="#1890FF" />
  </svg>
);

// 表格图标
export const TableIcon: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="8"
      y="8"
      width="48"
      height="48"
      rx="4"
      fill="#F6FFED"
      stroke="#52C41A"
      strokeWidth="2"
    />
    <line x1="8" y1="20" x2="56" y2="20" stroke="#52C41A" strokeWidth="2" />
    <line x1="8" y1="32" x2="56" y2="32" stroke="#52C41A" strokeWidth="2" />
    <line x1="8" y1="44" x2="56" y2="44" stroke="#52C41A" strokeWidth="2" />
    <line x1="32" y1="8" x2="32" y2="56" stroke="#52C41A" strokeWidth="2" />
  </svg>
);

// 表单图标
export const FormIcon: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="8"
      y="8"
      width="48"
      height="48"
      rx="4"
      fill="#FFF7E6"
      stroke="#FA8C16"
      strokeWidth="2"
    />
    <rect x="16" y="20" width="32" height="6" rx="1" fill="#FA8C16" />
    <rect x="16" y="30" width="32" height="6" rx="1" fill="#FA8C16" />
    <rect x="16" y="40" width="20" height="6" rx="1" fill="#FA8C16" />
  </svg>
);
