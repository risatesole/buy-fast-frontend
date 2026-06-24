"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SectionLabel } from "@/components/account/SectionLabel";
import { FieldRow } from "@/components/account/FieldRow";
import { SaveButton } from "@/components/account/SaveButton";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleSave() {
    // TODO: wire to your API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionLabel>Account</SectionLabel>
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
