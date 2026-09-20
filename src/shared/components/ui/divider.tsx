import cn from "@/shared/utils/cn";

const Divider = ({
  className,
  orientation = "horizontal",
  text,
  textClassName,
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
  text?: string;
  textClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
    >
      {text ? (
        <>
          <div className="flex-grow border-t border-border" />
          <span
            className={cn("px-4 text-sm font-medium text-muted", textClassName)}
          >
            {text}
          </span>
          <div className="flex-grow border-t border-border" />
        </>
      ) : (
        <div className="w-full flex-1 border-t border-border" />
      )}
    </div>
  );
};

export default Divider;
