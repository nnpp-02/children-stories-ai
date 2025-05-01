import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLORS, type ColorTheme } from "@/constants/theme";

type ColorPickerProps = {
  selectedColor: ColorTheme;
  onColorChange: (color: ColorTheme) => void;
  onClose: () => void;
};

/**
 * Color picker component for theme selection
 */
export function ColorPicker({
  selectedColor,
  onColorChange,
  onClose,
}: ColorPickerProps) {
  // Map of color names to their tailwind color values for inline styles
  const colorMap = {
    gray: { bg: "#d1d5db", text: "#1f2937" },
    red: { bg: "#fecaca", text: "#991b1b" },
    green: { bg: "#bbf7d0", text: "#166534" },
    blue: { bg: "#bfdbfe", text: "#1e40af" },
    yellow: { bg: "#fef08a", text: "#854d0e" },
    purple: { bg: "#e9d5ff", text: "#6b21a8" },
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-950 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-[1000] w-[290px] animate-in slide-in-from-top-5 fade-in duration-200">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Choose Theme Color</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {COLORS.map((color) => {
          const colorStyle = colorMap[color as keyof typeof colorMap];
          return (
            <button
              key={color}
              className={`
                flex flex-col items-center justify-center p-2 rounded-md h-[70px]
                transition-all duration-200
                ${
                  selectedColor === color
                    ? `ring-2 ring-offset-2 ring-${color}-500 bg-${color}-50 dark:bg-${color}-900/30`
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
              onClick={() => onColorChange(color)}
              aria-label={`Select ${color} theme`}
              style={{
                backgroundColor:
                  selectedColor === color
                    ? `${colorStyle.bg}20` // Light version with transparency
                    : undefined,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1 border"
                style={{ backgroundColor: colorStyle.bg }}
              >
                {selectedColor === color && (
                  <Check
                    className="h-4 w-4"
                    style={{ color: colorStyle.text }}
                  />
                )}
              </div>
              <span
                className="text-xs font-medium capitalize"
                style={{
                  color: selectedColor === color ? colorStyle.text : undefined,
                }}
              >
                {color}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
