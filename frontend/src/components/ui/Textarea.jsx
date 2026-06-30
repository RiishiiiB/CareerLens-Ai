const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          resize-none
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
      />
    </div>
  );
};

export default Textarea;