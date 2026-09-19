import Card from "@/shared/components/ui/card";

const ShowcaseHeaderProfile = () => {
  return (
    <Card className="flex gap-4 items-center px-4 py-2">
      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
        <h1 className="text-md font-bold font-montserrat text-primary-foreground ">
          JP
        </h1>
      </div>
      <div className="flex flex-col items-start ">
        <h1 className="leading-none font-montserrat font-semibold">
          Javed Pathan
        </h1>
        <p className=" text-muted leading-none">Owner</p>
      </div>
    </Card>
  );
};

export default ShowcaseHeaderProfile;
