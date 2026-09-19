import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";

const ShowcaseButtons = () => {
  return (
    <Card className="grid grid-cols-5 gap-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </Card>
  );
};

export default ShowcaseButtons;
