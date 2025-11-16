"use client"

import { useState, useEffect } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let toastId = 0
const toasts: Toast[] = []
const listeners: Array<() => void> = []

export function toast(toast: Omit<Toast, "id">) {
  const id = (toastId++).toString()
  toasts.push({ ...toast, id })
  listeners.forEach((listener) => listener())
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
      listeners.forEach((listener) => listener())
    }
  }, 5000)
  return id
}

export function Toaster() {
  const [toastList, setToastList] = useState<Toast[]>([])

  useEffect(() => {
    const update = () => setToastList([...toasts])
    listeners.push(update)
    return () => {
      const index = listeners.indexOf(update)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all ${
            toast.variant === "destructive"
              ? "border-red-500 bg-red-50 text-red-900"
              : "border bg-background text-foreground"
          }`}
        >
          <div className="grid gap-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

