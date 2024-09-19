import * as React from "react"
import { Search } from "lucide-react"; 

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input-a bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

// Search Input Component
const SearchInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative flex items-center ">
      {/* Lucide Search Icon */}
      <Search className="absolute left-3 text-muted-foreground" size={18} />
      <Input
        type="text"
        className={cn(
          "pl-10", // Add padding to the left to make space for the icon
          className
        )}
        placeholder="Search logs..."
        ref={ref}
        {...props}
      />
    </div>
  );
});
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };