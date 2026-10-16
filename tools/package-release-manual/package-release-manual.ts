import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "package-release-manual",
    title: "Package release by hand",
    description:
      "A person follows the package-release skill: computes the bump, writes the CHANGELOG entry, tags `<package>-v<version>`, and creates the release on the host. The same four steps with nothing to configure.",
    install: { none: true },
    invoke: { manual: true },
    io: {
      inputs: [
        { name: "package", schema: t("PackageName"), required: true, description: "The package being released." },
        { name: "repo", schema: t("RepoFullName"), required: false, description: "owner/name of the repository the release is made in; the current one when absent." },
      ],
      outputs: [{ name: "tag", schema: t("Text"), description: "The tag created, `<package>-v<version>`." }],
    },
    satisfies: ["package-release"],
    selection: {
      when: "A first release, a rare one, or a repository whose commit messages carry no conventional prefixes.",
      limits: "Every step is a person's, so each is a place to slip; the skill's rules (build first, no reused version) are checked by nobody.",
      cost: "A few minutes of a person's time per release.",
    },
    requires: {},
  }),
);
