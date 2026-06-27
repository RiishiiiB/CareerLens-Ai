const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition duration-200";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    outline:
      "border border-slate-600 hover:bg-slate-800 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;