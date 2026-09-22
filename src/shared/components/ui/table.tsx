import type {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import cn from "@/shared/utils/cn";

export type TableDensity = "default" | "compact" | "comfortable";

const DENSITY_CELL_PADDING: Record<
  Exclude<TableDensity, "default">,
  string
> = {
  compact: "[&_td]:py-1.5 [&_th]:py-2",
  comfortable: "[&_td]:py-5 [&_th]:py-4",
};

type TableContainerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Scroll frame for tables. Owns horizontal overflow on small screens so
 * the table itself stays semantic; also draws the single hairline frame.
 * No shadow or padding here — those belong to the surrounding surface.
 */
const TableContainer = ({ className, ...props }: TableContainerProps) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full overflow-x-auto rounded-md border border-border bg-surface",
        className,
      )}
    />
  );
};

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
}

/**
 * Semantic table with Aventra density and type. Cell padding comes from
 * TableCell/TableHead; the density prop only overrides rhythm through
 * descendant selectors. Pass min-width via className (e.g. min-w-[640px])
 * when the table should scroll instead of squashing on small screens.
 */
const Table = ({ density = "default", className, ...props }: TableProps) => {
  return (
    <table
      {...props}
      className={cn(
        "w-full border-collapse text-left font-lato text-sm",
        density !== "default" && DENSITY_CELL_PADDING[density],
        className,
      )}
    />
  );
};

type TableHeaderProps = HTMLAttributes<HTMLElement>;

/**
 * Column header group. Draws the strong rule under the header and
 * neutralizes row hover — header rows are never hover targets.
 */
const TableHeader = ({ className, ...props }: TableHeaderProps) => {
  return (
    <thead
      {...props}
      className={cn(
        "border-b border-border [&_tr:hover]:bg-transparent",
        className,
      )}
    />
  );
};

type TableBodyProps = HTMLAttributes<HTMLElement>;

/**
 * Table body. Drops the separator under the final row so the container
 * frame closes the table cleanly.
 */
const TableBody = ({ className, ...props }: TableBodyProps) => {
  return (
    <tbody {...props} className={cn("[&_tr:last-child]:border-0", className)} />
  );
};

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

/**
 * Table row with a subtle separator, comfortable density, and quiet hover
 * feedback. Selection is a boolean visual state only — state management
 * stays with the consumer (e.g. a controlling checkbox announces it, so
 * no aria-selected is set here and native table semantics are preserved).
 */
const TableRow = ({ selected = false, className, ...props }: TableRowProps) => {
  return (
    <tr
      {...props}
      className={cn(
        "border-b border-border-subtle transition-colors",
        "hover:bg-surface-muted",
        selected && "bg-primary-muted hover:bg-primary-muted",
        className,
      )}
    />
  );
};

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

/**
 * Column header cell. Compact uppercase micro-typography, visually
 * distinct from data without heaviness. Align numerically via className
 * (e.g. text-right) to match the column's data.
 */
const TableHead = ({
  scope = "col",
  className,
  ...props
}: TableHeadProps) => {
  return (
    <th
      scope={scope}
      {...props}
      className={cn(
        "whitespace-nowrap px-4 py-3",
        "font-montserrat text-xs font-semibold uppercase tracking-widest text-muted",
        className,
      )}
    />
  );
};

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

/**
 * Data cell. Inherits table type; alignment and emphasis (e.g.
 * text-right tabular-nums font-medium for amounts) come from className
 * at the call site — formatting belongs to the consuming layer.
 */
const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <td
      {...props}
      className={cn("px-4 py-3 align-middle text-foreground", className)}
    />
  );
};

type TableCaptionProps = HTMLAttributes<HTMLElement>;

/**
 * Accessible table title. Renders above the header and gives screen
 * readers the table's context.
 */
const TableCaption = ({ className, ...props }: TableCaptionProps) => {
  return (
    <caption
      {...props}
      className={cn(
        "px-4 py-3 text-left font-lato text-sm text-muted",
        className,
      )}
    />
  );
};

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
};
