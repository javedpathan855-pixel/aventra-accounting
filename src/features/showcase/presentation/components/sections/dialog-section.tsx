"use client";

import { useState, type FormEvent } from "react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogX,
} from "@/shared/components/ui/dialog";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import {
  ToastProvider,
  useToasts,
} from "@/shared/components/ui/toast";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const CustomerFormDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToasts();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length === 0) {
      setNameError("Enter the customer name to continue.");
      return;
    }
    setNameError(undefined);
    onOpenChange(false);
    setName("");
    toast({
      title: "Customer created",
      description: "Acme Industries was added to your workspace.",
      tone: "success",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <DialogTitle>Create customer</DialogTitle>
              <DialogDescription>
                Add a customer to your Aventra workspace.
              </DialogDescription>
            </div>
            <DialogX />
          </div>
        </DialogHeader>
        <DialogBody>
          <form
            id="showcase-customer-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 py-4"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-customer-name">Customer name</Label>
              <Input
                id="showcase-customer-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setNameError(undefined);
                }}
                placeholder="Acme Industries"
                autoComplete="organization"
                variant={nameError ? "error" : "default"}
                aria-invalid={Boolean(nameError)}
                aria-describedby={
                  nameError ? "showcase-customer-name-error" : undefined
                }
              />
              <FieldError
                id="showcase-customer-name-error"
                message={nameError}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-customer-email">Email</Label>
              <Input
                id="showcase-customer-email"
                type="email"
                placeholder="accounts@acme.com"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-customer-phone">Phone</Label>
              <Input
                id="showcase-customer-phone"
                type="tel"
                placeholder="+91 98200 12345"
                autoComplete="tel"
              />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button type="submit" form="showcase-customer-form">
            Create customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DialogDemos = () => {
  const { toast } = useToasts();
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setBasicOpen(true)}>
          Open basic dialog
        </Button>
        <Button variant="outline" onClick={() => setFormOpen(true)}>
          Open form dialog
        </Button>
        <Button variant="outline" onClick={() => setConfirmOpen(true)}>
          Open confirmation dialog
        </Button>
      </div>
      <p className="font-lato text-sm text-muted">
        Tab into an open dialog and press Tab repeatedly — focus cycles
        inside. Escape closes, and focus returns to the button that opened
        it.
      </p>

      <Dialog open={basicOpen} onOpenChange={setBasicOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <DialogTitle>Report ready</DialogTitle>
                <DialogDescription>
                  Your September profit and loss statement finished
                  generating.
                </DialogDescription>
              </div>
              <DialogX />
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Dismiss</DialogClose>
            <Button
              onClick={() => {
                setBasicOpen(false);
                toast({
                  title: "Report opened",
                  description: "September P&L is now visible.",
                  tone: "info",
                });
              }}
            >
              View report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <DialogTitle>Delete draft invoice?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The draft will be removed
                  from your workspace.
                </DialogDescription>
              </div>
              <DialogX />
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                toast({
                  title: "Demo only",
                  description: "Nothing was deleted — this is a showcase.",
                  tone: "warning",
                });
              }}
              className="bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90"
            >
              Delete draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DialogSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Dialog"
      description="The Auth Card, elevated into a modal. Focus moves in on open and returns on close, Tab cycles inside, Escape dismisses."
    >
      <ToastProvider>
        <Card className="flex flex-col gap-6 p-6 sm:p-8">
          <Subsection>Interactive playground</Subsection>
          <Preview>
            <DialogDemos />
          </Preview>
        </Card>
      </ToastProvider>
    </ShowcaseSection>
  );
};

export default DialogSection;
