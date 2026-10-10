"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' أو 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");
    setMessageType("");

    // تحقق بسيط
    if (!formData.firstName || !formData.email || !formData.message) {
      setMessage("Please enter your first name, email address, and message.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Your message was sent, I'll reply soon.");
        setMessageType("success");

        // إعادة تعيين الفورم
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        setMessage(data.error || "Unable to send your message. Please try again.");
        setMessageType("error");
      }
    } catch {
      setMessage("Unable to connect. Please try again or contact me by email.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-[#1f1f23] border border-[#777780] rounded-lg text-white placeholder:text-white/65 focus:ring-2 focus:ring-accent";
  return (
    <form onSubmit={handleSubmit} aria-busy={loading} aria-describedby="contact-instructions"
      className="flex flex-col gap-6 p-5 sm:p-10 bg-[#27272c] rounded-xl">
      <h2 className="text-3xl sm:text-4xl text-accent">Let&apos;s work together</h2>
      <p className="text-white/70">Looking for a professional web application, custom business system, or SaaS solution? Share your project details, and I&apos;ll get back to you with a development plan.</p>
      <p id="contact-instructions" className="text-sm text-white/70">First name, email, and message are required.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "firstName", label: "First name (required)", type: "text", autoComplete: "given-name", required: true, maxLength: 100 },
          { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name", maxLength: 100 },
          { name: "email", label: "Email (required)", type: "email", autoComplete: "email", required: true, maxLength: 254 },
          { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", maxLength: 40 },
        ].map(({ name, label, ...attributes }) => (
          <div key={name}>
            <label htmlFor={`contact-${name}`} className="block mb-2 text-sm">{label}</label>
            <input {...attributes} id={`contact-${name}`} name={name} value={formData[name]} onChange={handleChange} className={inputClass} />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="contact-service" className="block mb-2 text-sm">Service</label>
        <select id="contact-service" name="service" value={formData.service} onChange={(e) => handleSelectChange(e.target.value)} className={inputClass}>
          <option value="">Select a service</option>
          <option value="laravel-backend">Laravel Backend Development</option>
          <option value="full-stack">Full-Stack Web Application</option>
          <option value="integrations">Payments & API Integrations</option>
          <option value="maintenance">Maintenance & Product Support</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block mb-2 text-sm">Message (required)</label>
        <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange}
          className={`${inputClass} min-h-[200px] resize-y`} placeholder="Tell me about your project." maxLength={5000} required />
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {message && <p className={`p-3 rounded-lg ${messageType === "success" ? "bg-green-900/20 text-green-300 border border-green-800" : "bg-red-900/20 text-red-300 border border-red-800"}`}>{message}</p>}
      </div>
      <button type="submit" disabled={loading}
        className="inline-flex items-center justify-center rounded-full font-semibold transition-colors cursor-pointer bg-accent text-primary hover:bg-accent-hover h-12 px-6 disabled:opacity-60 disabled:cursor-wait">
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
