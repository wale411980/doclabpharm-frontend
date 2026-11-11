"use client";

import { useState, type FormEvent } from "react";
import { API_URL } from "@/site/basket";

/**
 * Shown after payment: the visitor chooses a password for the account that was
 * made for them, and is signed in. `path` is the API path that accepts it.
 */
export function SetPassword({ path, claimKey, intro }: { path: string; claimKey: string; intro: string }) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ claim_token: localStorage.getItem(claimKey), password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(body.message || "We could not save your password. Use Forgot password on the sign in page.");
      } else {
        // Same places the sign-in page keeps them, so the account opens signed in.
        const { token, ...user } = body.data;
        localStorage.setItem("user", JSON.stringify({ ...user, token }));
        localStorage.setItem("token", token);
        localStorage.removeItem(claimKey);
        setReady(true);
      }
    } catch {
      setMessage("No connection. Check your internet and try again.");
    }
    setSaving(false);
  };

  if (ready) {
    return (
      <div className="flex flex-col gap-4 rounded-[28px] bg-night p-6 text-white sm:p-7">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Your account is ready</h2>
        <a href="/user/dashboard" className="inline-flex min-h-14 w-fit items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night">
          Open my account
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-[28px] bg-night p-6 text-white sm:p-7">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Choose a password</h2>
        <p className="mt-1 text-white/75">{intro}</p>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[15px] font-bold">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="h-14 w-full rounded-2xl bg-white px-4 text-base font-medium text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-lime"
        />
      </label>
      {message && (
        <p role="alert" className="text-[15px] font-semibold text-[#ffb4a6]">
          {message}
        </p>
      )}
      <button type="submit" disabled={saving} className="min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night disabled:opacity-60">
        {saving ? "Saving" : "Save password"}
      </button>
    </form>
  );
}
