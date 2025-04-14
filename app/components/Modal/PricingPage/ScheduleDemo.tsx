"use client";

import type React from "react";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Icons } from "../../ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import Button from "../../ui/button";
import BasicDateTimePicker from "../../custom/DateTimePicker";
import moment from "moment";

interface ScheduleDemoModalProps {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
}

interface ScheduleDemoReq {
  name: string;
  email: string;
  company: string;
  attendees: string;
  date: string;
  time: string;
  interests: string;
}

export function ScheduleDemoModal({
  modalVisibility,
  setModalVisibility,
}: ScheduleDemoModalProps) {
  const [formData, setFormData] = useState<ScheduleDemoReq>({
    name: "",
    email: "",
    company: "",
    attendees: "1-5",
    date: "",
    time: "",
    interests: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user selects
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
    if (!formData.date.trim()) newErrors.date = "Date is required";
    // if (!formData.time.trim()) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      console.log("Scheduling demo:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - close modal and reset form
      setModalVisibility(false);

      setFormData({
        name: "",
        email: "",
        company: "",
        attendees: "1-5",
        date: "",
        time: "",
        interests: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  const preferredDateTimeRef = useRef(null);

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-white">Schedule a Demo</h2>
          <span
            className="ml-auto size-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-white [&_svg_path]:fill-white"
            onClick={() => {
              setModalVisibility(false);
            }}
          >
            <Icons.Close />
          </span>
        </div>

        <p className="text-text-grey mb-6">
          Book a personalized demo to see how Ticketsdeck Events can help you
          organize successful events.
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
            <label className="text-sm text-white mb-2" htmlFor="attendees">
              Number of Attendees
            </label>
            <Select
              value={formData.attendees}
              onValueChange={(value) => handleSelectChange("attendees", value)}
            >
              <SelectTrigger id="attendees" className="!mt-0">
                <SelectValue placeholder="Select number of attendees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1-5 attendees</SelectItem>
                <SelectItem value="6-20">6-20 attendees</SelectItem>
                <SelectItem value="21-50">21-50 attendees</SelectItem>
                <SelectItem value="51-100">51-100 attendees</SelectItem>
                <SelectItem value="100+">100+ attendees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="createEventFormField">
            <label htmlFor="date">Preferred date & time</label>
            <div className="" ref={preferredDateTimeRef}>
              <BasicDateTimePicker
                className="custom-datepicker !mt-0"
                defaultValue={moment(new Date())}
                onChangeFn={(newValue) => {
                  // Set the form value
                  setFormData((prev) => ({
                    ...(prev as ScheduleDemoReq),
                    date: `${newValue.toDate()}`,
                  }));
                }}
                minDate={moment(new Date())}
              />
            </div>
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white mb-2" htmlFor="interests">
              What features are you most interested in? (optional)
            </label>
            <Textarea
              id="interests"
              name="interests"
              placeholder="Tell us what you're looking for"
              className="!mt-0"
              rows={3}
              value={formData.interests}
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full purple-gradient hover:opacity-90 transition-opacity"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Demo"}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
