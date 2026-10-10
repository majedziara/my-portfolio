"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import useMotionPreference from "./useMotionPreference";

const stats = [
  { num: 4, suffix: "+", value: "4+", text: "Years of experience" },
  { num: 10, suffix: "+", value: "10+", text: "Projects completed" },
  { num: 5, suffix: "–6", value: "5–6", text: "Client sites delivered at DIGO" },
  { num: 2, suffix: "", value: "2", text: "Languages supported in products" },
];
export default function Stats() {
  const [inView, setInView] = useState(false);
  const statsRef = useRef(null);
  const reducedMotion = useMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section aria-label="Professional highlights" className="pt-4 pb-12">
      <div className="container mx-auto">
        <dl ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.text} className="flex flex-col sm:flex-row gap-4 items-center lg:justify-start">
              <dt className="max-w-[150px] leading-snug text-white/80 order-2">{stat.text}</dt>
              <dd className="text-4xl lg:text-6xl font-extrabold order-1" style={{ minWidth: `${stat.value.length}ch` }}>
                <span className="sr-only">{stat.value}</span>
                <span aria-hidden="true">
                  {inView && !reducedMotion ? <CountUp end={stat.num} suffix={stat.suffix} duration={5} delay={0.5} /> : stat.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
