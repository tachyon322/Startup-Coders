"use client";

import React from "react";
import { useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setStatus("loading");
      
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          url: "https://startup.style32.online"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }
      
      setStatus("success");
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={submit} className="flex flex-col gap-2 w-48">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-amber-200" 
          disabled={status === "loading"}
        />
        <button 
          type="submit" 
          className="bg-amber-200"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>
        
        {status === "success" && (
          <p className="text-green-600 text-sm mt-2">Email sent successfully!</p>
        )}
        
        {status === "error" && (
          <p className="text-red-600 text-sm mt-2">Failed to send email. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default page;
