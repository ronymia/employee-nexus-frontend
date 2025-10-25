import { underConstructionImage } from "@/assets";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className={`relative`}>
      <Image
        loading="eager"
        src={underConstructionImage}
        alt="Under Construction"
      />
      <h1 className={`absolute top-3 left-1/2 text-2xl font-medium`}>
        Under Construction
      </h1>
    </div>
  );
}
