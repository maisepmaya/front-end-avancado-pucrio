import type React from "react";
import { type ReactNode, forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  id: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      id,
      icon,
      className = "",
      error,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ");

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
          {icon && (
            <div
              className="absolute text-brown-900 left-2 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            autoComplete="off"
            id={id}
            className={`size-full px-3 ${
              icon ? "pl-8" : ""
            } pt-2 pb-1 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-brown-700 transition-colors ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            } ${className}`}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? "true" : "false"}
            {...rest}
          />
        </div>

        {error && (
          <p id={errorId} className="text-red-600 text-xs mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  id: string; // Declare id variable
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      id,
      className = "",
      error,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ");

    return (
      <div className="w-full mb-2">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-brown-800 mb-1"
        >
          {label}:
        </label>
        <textarea
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 placeholder:text-brown-200 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-brown-700 resize-none transition-colors ${
            error ? "ring-2 ring-red-500 border-red-500" : ""
          } ${className}`}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />

        {error && (
          <p id={errorId} className="text-red-600 text-xs mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  optionList: { value: string; label: string }[];
  error?: string;
  id: string; // Declare id variable
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      optionList,
      id,
      className = "",
      error,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ");

    return (
      <div className="w-full mb-2">
        <select
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 bg-brown-400 text-brown-100 text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-brown-700 transition-colors ${
            error ? "ring-2 ring-red-500 border-red-500" : ""
          } ${className}`}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? "true" : "false"}
          {...rest}
        >
          {optionList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={errorId} className="text-red-600 text-xs mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export { FormInput, FormTextarea, FormSelect };
