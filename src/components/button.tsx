import { ComponentProps } from "react";

export default function Button(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-slate-800/50 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
