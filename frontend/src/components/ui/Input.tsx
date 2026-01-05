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
  const inputClasses = "w-full px-4 py-2 border-border border-border-width rounded-md text-base bg-white font-medium focus:outline-none focus:border-primary focus:shadow-primary-glow";
  
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="block mb-2 font-semibold">{label}</label>}
      <input id={id} className={`${inputClasses} ${className}`} ref={ref} {...props} />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

