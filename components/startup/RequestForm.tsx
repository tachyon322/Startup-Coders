"use client"

import { useState } from "react"
import { requestToParticipate } from "@/data/startup"

interface RequestFormProps {
  startupId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function RequestForm({ startupId, onSuccess, onError }: RequestFormProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await requestToParticipate(startupId, message)
      setMessage("")
      onSuccess?.()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Failed to send request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Сообщение
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Расскажите о себе и почему вы хотите присоединиться к проекту..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Отправка..." : "Отправить заявку"}
      </button>
    </form>
  )
} 