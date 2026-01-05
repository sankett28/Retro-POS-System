import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({
  label,
  className = '',
  id,
  ...props
}, ref) {
  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md text-base bg-white font-medium focus:outline-none focus:border-black focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)]";
  
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="block mb-2 font-semibold text-gray-900">{label}</label>}
      <input id={id} className={`${inputClasses} ${className}`} ref={ref} {...props} />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

