"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { UserDetails } from "@/services/user/getUserDetails";
import { getUserDetails } from "@/services/user/getUserDetails";
import { SectionLabel } from "@/components/account/SectionLabel";
import { FieldRow } from "@/components/account/FieldRow";
import { SaveButton } from "@/components/account/SaveButton";

export default function ProfilePage() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const userData = await getUserDetails();
        
        if (userData) {
          setUser(userData);
          setFirstName(userData.firstName ?? "");
          setLastName(userData.lastName ?? "");
          setEmail(userData.email ?? "");
          setBio(userData.bio ?? "");
        } else {
          setError("User data not found");
        }
      } catch (err) {
        console.error("Failed to load user", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  function handleSave() {
    // TODO: wire to your API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <p style={{ fontSize: "0.875rem", color: "oklch(0.708 0 0)" }}>
      Loading…
    </p>;
  }

  if (error || !user) {
    return <p style={{ fontSize: "0.875rem", color: "oklch(0.637 0.237 25.331)" }}>
      {error || "Failed to load user data"}
    </p>;
  }

  return (
    <div>
      <SectionLabel>Profile</SectionLabel>
      <FieldRow label="First name">
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
      </FieldRow>
      <FieldRow label="Last name">
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
      </FieldRow>
      <FieldRow label="Email" hint="Address associated with your account.">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
        />
      </FieldRow>
      <FieldRow
        label="Bio"
        hint="A short description shown on your public profile."
      >
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself…"
          rows={3}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
            border: "1px solid oklch(0.922 0 0)",
            borderRadius: 4,
            background: "oklch(0.985 0 0)",
            color: "oklch(0.145 0 0)",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "var(--font-geist-sans), sans-serif",
            lineHeight: 1.6,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "oklch(0.556 0 0)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "oklch(0.922 0 0)")
          }
        />
      </FieldRow>
      <div style={{ paddingTop: "1.5rem" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}
