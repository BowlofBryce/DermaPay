import React from 'react';

interface RadioProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export function Radio({ name, value, label, checked, onChange }: RadioProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 text-[#f4c064] bg-gray-800 border-gray-700 focus:ring-[#f4c064] focus:ring-2"
      />
      <span className="text-[#f9fafb] text-base">{label}</span>
    </label>
  );
}
