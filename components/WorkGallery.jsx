"use client";
import { useRef, useState } from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

export default function WorkGallery({ children, count }) {
  const galleryRef = useRef(null);
  const [index, setIndex] = useState(0);
  function move(direction) {
    const gallery = galleryRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gallery.scrollBy({ left: direction * gallery.clientWidth, behavior: reducedMotion ? "instant" : "smooth" });
  }
  return (
    <div>
      <div className="flex justify-end items-center gap-4 mb-6">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-white/70 text-sm">Project {index + 1} of {count}</p>
        <button type="button" aria-label="Previous project" aria-controls="project-gallery" disabled={index === 0} onClick={() => move(-1)} className="bg-accent text-primary w-11 h-11 flex justify-center items-center rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-default"><PiCaretLeftBold aria-hidden="true" /></button>
        <button type="button" aria-label="Next project" aria-controls="project-gallery" disabled={index === count - 1} onClick={() => move(1)} className="bg-accent text-primary w-11 h-11 flex justify-center items-center rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-default"><PiCaretRightBold aria-hidden="true" /></button>
      </div>
      <div id="project-gallery" ref={galleryRef} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Selected projects"
        onScroll={(event) => setIndex(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
        onKeyDown={(event) => {
          if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-md">
        {children}
      </div>
    </div>
  );
}
