"use client";

import { useState } from "react";
import { Search, SearchX } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import EmptyState from "@/shared/components/ui/empty-state";
import Input from "@/shared/components/ui/input";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const CUSTOMERS = [
  { name: "ABC Enterprises", detail: "12 invoices · ₹2,40,000 billed" },
  { name: "Nextgen Services", detail: "6 invoices · ₹1,24,000 billed" },
  { name: "XYZ Industries", detail: "3 invoices · ₹86,000 billed" },
];

const SearchSection = () => {
  const [query, setQuery] = useState("");
  const matches = CUSTOMERS.filter((customer) =>
    customer.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <ShowcaseSection
      eyebrow="Patterns"
      title="Search"
      description="Search input plus results with a genuine empty state. Filtering is local demo state; production wires the same EmptyState to server results."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Live pattern</Subsection>
        <Preview>
          <div className="flex max-w-xl flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                type="search"
                aria-label="Search customers"
                placeholder="Search customers…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                prefix={<Search aria-hidden="true" className="h-4 w-4" />}
              />
            </div>
            {matches.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {matches.map((customer) => (
                  <li
                    key={customer.name}
                    className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-4 py-3"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-montserrat text-sm font-semibold text-foreground">
                        {customer.name}
                      </span>
                      <span className="truncate font-lato text-xs text-muted">
                        {customer.detail}
                      </span>
                    </span>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<SearchX aria-hidden="true" className="h-5 w-5" />}
                title="Nothing matched your search"
                description="Try a different term, or clear the search to start over."
                action={
                  <Button size="sm" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                }
              />
            )}
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default SearchSection;
