import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
}: InputProps) => {
  return (
    <div>
      <label>{label}</label>
      <input
        {...register}
        id={id}
        type={type}
        placeholder={placeholder}
        className={`outline-none border-[1px] py-2 px-3 w-full rounded-md mt-2
               ${error ? "border-rose-500" : "border-neutral-400"}
                `}
      />
      {error && <p className="text-rose-400">{error.message}</p>}
    </div>
  );
};

export default Input;
