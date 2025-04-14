"use client";

import type React from "react";

import { Dispatch, SetStateAction, useState } from "react";
import Button from "../../ui/button";
import { Icons } from "../../ui/icons";
import { Textarea } from "../../ui/textarea";
import ModalWrapper from "../ModalWrapper";

interface ContactSalesModalProps {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
}

export function ContactSalesModal({
  modalVisibility,
  setModalVisibility,
}: ContactSalesModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      console.log("Submitting contact sales form:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - close modal and reset form
      setModalVisibility(false);

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      visibility={modalVisibility}
      setVisibility={setModalVisibility}
      styles={{
        backgroundColor: "transparent",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <div className="w-full md:w-[28.125rem] max-h-[86vh] overflow-y-auto p-6 rounded-[20px] bg-container-grey [scrollbar-width:none]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-medium text-white">
            Contact Sales
          </h2>
          <span
            className="ml-auto size-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-white [&_svg_path]:fill-white"
            onClick={() => {
              setModalVisibility(false);
            }}
          >
            <Icons.Close />
          </span>
        </div>

        <p className="text-white/80 mb-6">
          Fill out the form below and our sales team will get back to you within
          24 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={`input !mt-0 !rounded-lg w-full !bg-white/10 text-sm ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`input !mt-0 !rounded-lg w-full !bg-white/10 text-sm ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white mb-2" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              placeholder="Your company name"
              value={formData.company}
              onChange={handleChange}
              className={`input !mt-0 !rounded-lg w-full !bg-white/10 text-sm ${
                errors.company ? "border-red-500" : ""
              }`}
            />
            {errors.company && (
              <p className="text-xs text-red-500">{errors.company}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white mb-2" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={`input !mt-0 !rounded-lg w-full !bg-white/10 text-sm`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white mb-2" htmlFor="message">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="How can we help you?"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`!mt-0 ${errors.message ? "border-red-500" : ""}`}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full purple-gradient hover:opacity-90 transition-opacity"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
