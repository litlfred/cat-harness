import { webpage } from "../../../schemas/webpage.ts";

export default webpage({
  slug: "concepts/content-types",
  title: "Content types",
  documents: ["folio"],
  navOrder: 4,
  nodes: [
    {
      id: "overview",
      block: "overview",
    },
    {
      id: "scientific-papers-books",
      title: "Scientific papers & books",
      block: "scientific-papers-books",
    },
    {
      id: "others-extending-folio-assistant",
      title: "Others — extending folio-assistant",
      block: "others-extending-folio-assistant",
    },
  ],
});
