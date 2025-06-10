import React from "react";

export const FormInput = ({ className, ...rest }) => {
  return (
    <input
      className={"bg-brown-100 rounded p-1 w-full" + (className ?? "")}
      {...rest}
    />
  );
};
