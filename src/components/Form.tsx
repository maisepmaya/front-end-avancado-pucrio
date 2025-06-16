import React, { type ReactNode } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  icon,
  className,
  ...rest
}) => {
  return (
    <div className="w-full mb-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-brown-800 mb-1"
        >
          {label}:
        </label>
      )}

      <div className="relative">
        <div className="absolute text-brown-900 left-2 top-1/2 -translate-y-1/2 text-xl">
          {icon}
        </div>
        <input
          autoComplete={"off"}
          id={id}
          className={`size-full px-3 ${
            icon ? "pl-8" : ""
          } pt-2 pb-1 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-brown-700 ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
};

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  id,
  className,
  ...rest
}) => {
  return (
    <div className="w-full mb-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-brown-800 mb-1"
      >
        {label}:
      </label>
      <textarea
        id={id}
        className={`w-full px-3 py-2  placeholder:text-brown-200 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-brown-700 resize-none ${className}`}
        {...rest}
      />
    </div>
  );
};

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  optionList: { value: string; label: string }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  optionList,
  className,
  ...rest
}) => {
  return (
    <select
      className={`w-full px-3 py-2 bg-brown-400 text-brown-100 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-brown-700 ${className}`}
      {...rest}
    >
      {optionList.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
