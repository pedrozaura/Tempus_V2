import type { HTMLAttributes } from "react";
import React from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={`rounded-2xl bg-white shadow-lg p-4 ${className || ""}`}
      {...props}
    />
  );
};
