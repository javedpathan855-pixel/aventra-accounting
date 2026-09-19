import Card from "@/shared/components/ui/card";
import Input from "@/shared/components/ui/input";

const ShowcaseInput = () => {
  return (
    <Card className="grid grid-cols-5 gap-4">
      <Input placeholder="Default" />
      <Input placeholder="Error" variant="error" />
      <Input placeholder="Success" variant="success" />
      <Input placeholder="Warning" variant="warning" />
      <Input placeholder="Info" variant="info" />
    </Card>
  );
};

export default ShowcaseInput;
