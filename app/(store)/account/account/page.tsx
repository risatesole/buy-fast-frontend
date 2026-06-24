"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { UserDetails } from "@/services/user/getUserDetails";
import { getUserDetails } from "@/services/user/getUserDetails";
import { SectionLabel } from "@/components/account/SectionLabel";
import { FieldRow } from "@/components/account/FieldRow";
import { SaveButton } from "@/components/account/SaveButton";

export default function AccountPage() {
  // Profile state
  const [user, setUser] = useState<UserDetails | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Account state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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
      {/* Profile Section */}
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

      {/* Account Section - Password */}
      <div style={{ marginTop: "3rem" }}>
        <SectionLabel>Security</SectionLabel>
        <FieldRow label="Current password">
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FieldRow>
        <FieldRow label="New password" hint="Minimum 8 characters.">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FieldRow>
        <FieldRow label="Confirm new password">
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FieldRow>
        <div style={{ paddingTop: "1.5rem" }}>
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid oklch(0.922 0 0)",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(0.637 0.237 25.331)",
            marginBottom: "1rem",
          }}
        >
          Danger zone
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            border: "1px solid oklch(0.922 0 0)",
            borderRadius: 4,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "0.25rem",
              }}
            >
              Delete account
            </p>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.708 0 0)" }}>
              Permanently remove your account and all data.
            </p>
          </div>
          {deleteConfirm ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={{
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.75rem",
                  border: "1px solid oklch(0.922 0 0)",
                  borderRadius: 4,
                  background: "white",
                  cursor: "pointer",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.75rem",
                  border: "none",
                  borderRadius: 4,
                  background: "oklch(0.637 0.237 25.331)",
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                }}
              >
                Confirm delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{
                padding: "0.4rem 0.9rem",
                fontSize: "0.75rem",
                border: "1px solid oklch(0.922 0 0)",
                borderRadius: 4,
                background: "white",
                color: "oklch(0.637 0.237 25.331)",
                cursor: "pointer",
                fontFamily: "var(--font-geist-sans), sans-serif",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
