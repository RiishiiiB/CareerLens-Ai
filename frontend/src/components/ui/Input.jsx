const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  error = "",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-semibold text-slate-200"
        >
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full
          rounded-2xl
          border
          border-slate-700/70
          bg-slate-900/80
          px-4
          py-3
          text-white
          placeholder:text-slate-500
          outline-none
          transition-all
          duration-300
          hover:border-slate-600
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-500/20
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : ""
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;