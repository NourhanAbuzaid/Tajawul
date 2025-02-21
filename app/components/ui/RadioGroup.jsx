"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

const RadioGroup = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "12px",
        ...style,
      }}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <RadioGroupPrimitive.Item
        ref={ref}
        style={{
          aspectRatio: "1 / 1",

          height: "16px",
          width: "16px",
          borderRadius: "50%",
          border: "1px solid currentColor",
          color: "var(--Green-Perfect)",
          outline: "none",
          opacity: props.disabled ? 0.5 : 1,
          cursor: props.disabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Circle
            style={{
              height: "14px",
              width: "14px",
              fill: "var(--Green-Perfect)",
            }}
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <label>{props.children}</label>
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
