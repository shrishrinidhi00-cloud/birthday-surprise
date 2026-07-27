import { createFileRoute } from "@tanstack/react-router";
import BirthdayApp from "@/components/BirthdayApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Surprise for Chaitra ♡" },
      {
        name: "description",
        content: "A cute, dreamy birthday surprise made just for Chaitra.",
      },
      { property: "og:title", content: "A Little Surprise for Chaitra ♡" },
      {
        property: "og:description",
        content: "A cute, dreamy birthday surprise made just for Chaitra.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <BirthdayApp />;
}
