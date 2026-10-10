const stats = [
  { value: "4+", text: "Years of experience" },
  { value: "10+", text: "Projects completed" },
  { value: "5–6", text: "Client sites delivered at DIGO" },
  { value: "2", text: "Languages supported in products" },
];
export default function Stats() {
  return (
    <section aria-label="Professional highlights" className="pt-4 pb-12">
      <div className="container mx-auto">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.text} className="flex flex-col sm:flex-row gap-4 items-center lg:justify-start">
              <dt className="max-w-[150px] leading-snug text-white/80 order-2">{stat.text}</dt>
              <dd className="text-4xl lg:text-6xl font-extrabold order-1">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
