"use client"
import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

const stats = [
    {
        num: 4,
        suffix: '+',
        text: 'Years of experience'
    },
    {
        num: 10,
        suffix: '+',
        text: 'Projects completed'
    },
    {
        num: 5,
        suffix: '–6',
        text: 'Client sites delivered at DIGO'
    },
    {
        num: 2,
        suffix: '',
        text: 'Languages supported in products'
    },
]

function Stats() {
  const [inView, setInView] = useState(false); // لحفظ حالة ظهور القسم في العرض
  const statsRef = useRef(null); // المرجع الذي سنستخدمه لمراقبة القسم

  // استخدام IntersectionObserver للكشف عن ظهور القسم
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true); // إذا دخل القسم في العرض، يبدأ العد
        }
      },
      {
        threshold: 0.2, // القسم يجب أن يكون مرئياً بنسبة 20% ليبدأ العد
      }
    );

    const observedElement = statsRef.current;

    if (observedElement) {
      observer.observe(observedElement);
    }

    return () => {
      if (observedElement) {
        observer.unobserve(observedElement);
      }
    };
  }, []);

  return (
    <section className='pt-4 pb-12'>
      <div className="container mx-auto">
        <div ref={statsRef} className='flex flex-wrap gap-6 max-w-[80vw] mx-auto lg:max-w-none'>
          {stats.map((stat, index) => {
            return (
              <div key={index} className='flex-1 flex gap-4 justify-center items-center lg:justify-start'>
                {inView && (
                  <CountUp 
                    end={stat.num} 
                    suffix={stat.suffix}
                    duration={5} 
                    delay={0.5} 
                    className='text-4xl lg:text-6xl font-extrabold' 
                  />
                )}
                <p className={`${stat.text.length < 15 ? 'max-w-[100px]' : 'max-w-[150px]'} leading-snug text-white/80`}>
                  {stat.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;
