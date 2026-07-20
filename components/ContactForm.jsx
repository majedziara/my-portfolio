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
    setLoading(true);
    setMessage("");
    setMessageType("");

    // تحقق بسيط
    if (!formData.firstName || !formData.email || !formData.message) {
      setMessage("Please fill all fields");
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
        setMessage(data.error || "something wrong");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("server error");
      setMessageType("error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="order-2 lg:order-1 lg:w-[54%]">
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl"
    >
      <h3 className="text-4xl text-accent">Let's work together</h3>
      <p className="text-white/60">
        Looking for a professional web application, custom business system, or
        SaaS solution? Share your project details, and I'll get back to you with
        the best approach and a clear development plan.{" "}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-4 py-3 bg-[#1f1f23] border border-[#3f3f46] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-4 py-3 bg-[#1f1f23] border border-[#3f3f46] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full px-4 py-3 bg-[#1f1f23] border border-[#3f3f46] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-3 bg-[#1f1f23] border border-[#3f3f46] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* إذا كنت تستخدم Select من مكتبة shadcn/ui */}
      <div className="relative">
        <select
          value={formData.service}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full px-4 py-3 bg-[#1f1f23] border border-[#3f3f46] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
        >
          <option value="">Select a service</option>
          <option value="web">Web Development</option>
          <option value="mobile">Mobile Development</option>
          <option value="design">Graphic Design & Motion Graphic</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-[#1f1f23] border border-[#3f3f46] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent h-[200px] resize-none"
        placeholder="Type your message here."
        required
      />

      {message && (
        <div
          className={`p-3 rounded-lg ${messageType === "success" ? "bg-green-900/20 text-green-400 border border-green-800" : "bg-red-900/20 text-red-400 border border-red-800"}`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-semibold ring-offset-white transition-colors cursor-pointer bg-accent text-primary hover:bg-accent-hover h-[48px] px-6"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
    // </div>
  );
}
