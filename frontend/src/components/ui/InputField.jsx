import { motion } from "framer-motion";

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightIcon,
  onRightIconClick,
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold tracking-wide text-slate-300">
        {label}
      </label>

      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="
          group
          flex
          items-center
          rounded-2xl
          border
          border-[#2C2C2C]
          bg-[#111111]/80
          px-5
          transition-all
          duration-300
          focus-within:border-[#FF6B35]
          focus-within:shadow-[0_0_30px_rgba(255,107,53,0.15)]
        "
      >
        {Icon && (
          <Icon
            size={20}
            className="
              mr-4
              text-slate-500
              transition-all
              duration-300
              group-focus-within:text-[#FF6B35]
            "
          />
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full
            bg-transparent
            py-5
            text-white
            placeholder:text-slate-600
            outline-none
            appearance-none
            autofill:bg-transparent
          "
        />

        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="
              ml-3
              text-slate-500
              transition-all
              duration-300
              hover:text-[#D9FF00]
            "
          >
            {rightIcon}
          </button>
        )}
      </motion.div>
    </div>
  );
}