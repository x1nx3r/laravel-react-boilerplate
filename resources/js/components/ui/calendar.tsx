"use client"

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import "react-day-picker/style.css"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background p-3",
        className
      )}
      captionLayout={captionLayout}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: "relative flex flex-col gap-4 md:flex-row md:gap-2",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 select-none p-0 aria-disabled:opacity-50"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 select-none p-0 aria-disabled:opacity-50"
        ),
        month_caption: "flex h-8 items-center justify-center px-8",
        dropdowns: "flex h-8 w-full items-center justify-center gap-1",
        dropdown_root: "relative rounded-md border border-input shadow-xs",
        months_dropdown: "relative inline-flex",
        years_dropdown: "relative inline-flex",
        dropdown:
          "absolute inset-0 cursor-pointer appearance-none opacity-0",
        caption_label: "flex items-center gap-1 text-sm font-medium",
        month_grid: "mx-auto mt-4 border-collapse",
        weekdays: "flex",
        weekday:
          "flex-1 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground",
        week: "mt-2 flex w-full",
        day: "relative flex-1 p-0 text-center text-sm select-none",
        day_button:
          "size-full rounded-md p-0 text-sm font-normal text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today: "[&>button]:font-semibold",
        outside:
          "text-muted-foreground opacity-50 [&>button]:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50 [&>button]:text-muted-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          ) : orientation === "right" ? (
            <ChevronRightIcon className={cn("size-4", className)} {...props} />
          ) : (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
