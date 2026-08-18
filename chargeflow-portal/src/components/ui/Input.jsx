import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-xs font-semibold uppercase tracking-wider text-[#cbc4d2] font-body">
          {label} {required && <span className="text-[#ffb4ab]">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#948e9c]">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id || name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full rounded-xl bg-[#1d1b20] border ${
            error ? 'border-[#ffb4ab] focus:ring-[#ffb4ab]' : 'border-[#494551] focus:border-[#cfbcff] focus:ring-[#cfbcff]'
          } text-[#e6e0e9] placeholder-[#948e9c] text-sm px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
            Icon ? 'pl-11' : ''
          } ${isPassword ? 'pr-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#948e9c] hover:text-[#e6e0e9] transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-[#ffb4ab] mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#948e9c] mt-1">{helperText}</p>}
    </div>
  );
}
