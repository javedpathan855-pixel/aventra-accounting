import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Dialog, {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

const ShowcaseDialog = () => {
  return (
    <Card className="grid grid-cols-4 gap-4">
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>

            <DialogDescription>
              Enter the customer details below to create a new customer.
            </DialogDescription>
          </DialogHeader>

          {/* Form / Content */}

          <DialogFooter>
            <DialogClose>Cancel</DialogClose>

            <Button>Create Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ShowcaseDialog;
