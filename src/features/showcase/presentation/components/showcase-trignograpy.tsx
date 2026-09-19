import Card from "@/shared/components/ui/card";

const ShowcaseTrignography = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <div className="flex flex-col gap-2">
          <h1 className="font-lato font-bold text-2xl">Lato</h1>
          <p className="font-lato text-lg">Primary UI Typeface</p>
          <p className="font-lato text-sm">
            Clean, modern, and highly readable — designed for everyday
            interfaces, financial data, and business communication.
          </p>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat font-bold text-2xl">Montserrat</h1>
          <p className="font-montserrat text-lg">Secondary UI Typeface</p>
          <p className="font-montserrat text-sm">
            Clean, modern, and highly readable — designed for everyday
            interfaces, financial data, and business communication.
          </p>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-2">
          <h1 className="font-signature font-bold text-2xl">Signature</h1>
          <p className="font-signature text-lg">Signature UI Typeface</p>
          <p className="font-signature text-sm">
            Clean, modern, and highly readable — designed for everyday
            interfaces, financial data, and business communication.
          </p>
        </div>
      </Card>
    </div>
  );
};
export default ShowcaseTrignography;
