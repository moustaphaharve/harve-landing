import { createRoot } from "react-dom/client";
import HarveFullDemo from "./harve-demo.jsx";

const el = document.getElementById("harve-demo-root");
if (el) {
  createRoot(el).render(<HarveFullDemo />);
}
