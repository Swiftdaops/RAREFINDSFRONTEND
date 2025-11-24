import React from 'react';
import { Moon, Sun } from "lucide-react";
// Adjust import path for local ThemeProvider
import { useTheme } from "./ThemeProvider"; 

// --- Placeholder Components matching shadcn/ui contract ---

// Simplified Button placeholder
const Button = ({ children, onClick, size, variant, className = '', asChild = false }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ';
  let styleClasses = 'bg-slate-800 text-slate-50 hover:bg-slate-700';

  if (variant === 'outline') {
    styleClasses = 'bg-transparent border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-50';
  }

  let sizeClasses = 'h-10 px-4 py-2';
  if (size === 'icon') {
    sizeClasses = 'h-9 w-9 p-0';
  }

  const Tag = asChild ? 'span' : 'button';

  return (
    <Tag onClick={onClick} className={`${baseClasses} ${styleClasses} ${sizeClasses} ${className}`}>
      {children}
    </Tag>
  );
};

// Simplified Dropdown Menu Placeholder
const DropdownMenu = ({ children }) => <div className="relative inline-block text-left">{children}</div>;
const DropdownMenuTrigger = ({ children, asChild }) => children;
const DropdownMenuContent = ({ children, align = 'end' }) => (
    <div 
        className={`absolute z-50 mt-2 w-40 rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-lg right-0`}
        // Basic positioning based on align='end'
        style={align === 'end' ? { right: 0 } : { left: 0 }}
    >
        {children}
    </div>
);
const DropdownMenuItem = ({ children, onClick }) => (
    <div 
        onClick={onClick} 
        className="px-2 py-1.5 text-sm rounded-md cursor-pointer text-slate-50 hover:bg-slate-700 transition-colors"
    >
        {children}
    </div>
);
// ------------------------------------------------------------------------

/**
 * ModeToggle: A button component that uses a dropdown menu to allow 
 * the user to switch between "light", "dark", and "system" themes.
 */
export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Sun icon is visible in light mode (scale-100) and hidden in dark mode (dark:scale-0) */}
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          {/* Moon icon is hidden in light mode (scale-0) and visible in dark mode (dark:scale-100) */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}