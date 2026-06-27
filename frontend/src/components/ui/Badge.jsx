const Badge = ({ children }) => {
  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        bg-blue-600/20
        px-3
        py-1
        text-sm
        font-medium
        text-blue-400
      "
    >
      {children}
    </span>
  );
};

export default Badge;