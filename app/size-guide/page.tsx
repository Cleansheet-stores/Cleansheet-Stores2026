import Link from "next/link";

const sizeChart = [
  { size: "S", chest: "88-92 cm", length: "70 cm" },
  { size: "M", chest: "96-100 cm", length: "72 cm" },
  { size: "L", chest: "104-108 cm", length: "74 cm" },
  { size: "XL", chest: "112-116 cm", length: "76 cm" },
  { size: "XXL", chest: "120-124 cm", length: "78 cm" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Size Guide</h1>
      <p className="mt-2 text-gray-600">
        Use this chart to find your perfect jersey fit. Measure around the
        fullest part of your chest.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-primary text-white">
            <tr>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Chest</th>
              <th className="px-4 py-3">Length</th>
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((row, i) => (
              <tr
                key={row.size}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 font-bold">{row.size}</td>
                <td className="px-4 py-3">{row.chest}</td>
                <td className="px-4 py-3">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-brand-muted p-4 text-sm text-gray-600">
        <p className="font-semibold text-brand-primary">Fit Tips</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>For a relaxed fit, go one size up</li>
          <li>Replica jerseys fit true to size</li>
          <li>Player version jerseys run slimmer — consider sizing up</li>
        </ul>
      </div>

      <Link
        href="/shop"
        className="mt-6 inline-block text-sm font-semibold text-brand-primary hover:underline"
      >
        ← Back to Shop
      </Link>
    </div>
  );
}
