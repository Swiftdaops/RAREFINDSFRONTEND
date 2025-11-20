// src/pages/OwnerSignup.jsx
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// If you have shadcn input/textarea/button, use them.
// Adjust imports if your paths differ.
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function OwnerSignup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      storeName: "",
      email: "",
      password: "",
      whatsappNumber: "",
      bio: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await axios.post(`${API_BASE}/api/owners/signup`, values, {
        withCredentials: true,
      });

      toast.success(
        "Registration received. We’ll review your bookstore and notify you once you’re approved."
      );
      reset();
      // After signup, send them to login or home:
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Could not complete signup. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white p-6"
        >
        <div className="mb-5 text-center">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-yellow-400">
            Join JOHNBOOKS
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            Register your bookstore or author catalogue
          </h1>
          <p className="mt-2 text-[12px] text-slate-400">
            Share your rare ebooks with Nigerian readers. Your account will be
            reviewed by the JOHNBOOKS team before you can publish titles.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Full name */}
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              Your full name
            </label>
            <Input
              type="text"
              placeholder="e.g. Chinedu Obi"
              className="h-9 rounded-2xl border-slate-700 card text-xs"
              {...register("name", { required: true })}
            />
          </div>

          {/* Store / brand name */}
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              Store / brand name
            </label>
            <Input
              type="text"
              placeholder="e.g. Chinedu Rare Books"
              className="h-9 rounded-2xl border-slate-700 card text-xs"
              {...register("storeName", { required: true })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-[11px] font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-9 rounded-2xl border-slate-700 card text-xs"
              {...register("email", { required: true })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              Password
            </label>
            <Input
              type="password"
              placeholder="Create a password"
              className="h-9 rounded-2xl border-slate-700 card text-xs"
              {...register("password", { required: true, minLength: 6 })}
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Minimum 6 characters. You’ll use this to log into your seller
              dashboard after approval.
            </p>
          </div>

          {/* WhatsApp number */}
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              WhatsApp number (for orders)
            </label>
            <Input
              type="tel"
              placeholder="e.g. 2348160000000 (no + sign)"
              className="h-9 rounded-2xl border-slate-700 card text-xs"
              {...register("whatsappNumber", { required: true })}
            />
            <p className="mt-1 text-[10px] text-slate-500">
              This is where readers will message when they tap “Buy on WhatsApp”
              for your books.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              Short bio / what you sell
            </label>
            <Textarea
              rows={3}
              placeholder="Tell readers what kind of books you specialise in — rare textbooks, African literature, design ebooks, etc."
              className="rounded-2xl border border-black bg-white text-black p-2 text-xs"
              {...register("bio")}
            />
          </div>

          {/* Info text */}
          <div className="mt-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-[11px] text-grey-700">
            <p className="font-medium">How approval works</p>
            <p className="mt-1">
              Once you submit this form, JOHNBOOKS will review your store. When
              approved, you’ll be able to log in, upload ebooks, and your books
              will appear in the public search with your WhatsApp buy link.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 h-9 w-full rounded-2xl text-xs font-semibold card text-slate-950 shadow-lg shadow-emerald-500/40 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit application"}
          </Button>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            Already approved as a seller?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="font-medium text-emerald-400 underline-offset-2 hover:underline"
            >
              Log in to your dashboard
            </button>
          </p>
        </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default OwnerSignup;
