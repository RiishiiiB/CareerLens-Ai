const Select = ({
  label,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-lg
          border
          border-slate-700
          bg-slate-900
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-500
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;