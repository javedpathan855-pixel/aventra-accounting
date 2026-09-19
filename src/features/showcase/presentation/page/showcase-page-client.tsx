import ShowcaseButtons from "../components/showcase-buttons";
import ShowcaseInput from "../components/showcase-input";
import ShowcaseTrignography from "../components/showcase-trignograpy";

const ShowcasePageClient = () => {
  return (
    <div className="flex flex-col mt-20 p-6 gap-4">
      <ShowcaseTrignography />
      <ShowcaseButtons />
      <ShowcaseInput />
    </div>
  );
};

export default ShowcasePageClient;
