import DefaultLayout from "@/layouts/default";
import { useSolana } from "@/context/SolanaContext";

export default function IndexPage() {
  const { solanaAddress } = useSolana();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          {/* Other content */}
        </div>

        <div className="flex gap-3">
          <p className="text-sm font-normal text-default-600">
            Address: {solanaAddress || "Not connected"}
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
