// Client-only RandomImage wrapper
import dynamic from "next/dynamic";

export default dynamic(() => import("./RandomImage.client"), { ssr: false });
