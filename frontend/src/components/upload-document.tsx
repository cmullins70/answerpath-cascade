"use client"

import { useState } from "react"
import { Upload, File, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface UploadDocumentProps {
  onUploadSuccess?: () => void;
}

export function UploadDocument({ onUploadSuccess }: UploadDocumentProps) {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log("File selected:", file)
    if (!file) return

    setStatus("uploading")
    setProgress(0)
    setError("")
    setFileName(file.name)

    console.log("Starting upload for:", file.name)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    const formData = new FormData()
    formData.append("file", file)

    console.log("Sending request to /api/documents/upload")
    fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed")
        }
        return response.json()
      })
      .then((data) => {
        console.log("Upload successful:", data)
        clearInterval(progressInterval)
        setProgress(100)
        setStatus("success")
        onUploadSuccess?.()
      })
      .catch((err) => {
        console.error("Upload error:", err)
        clearInterval(progressInterval)
        setError(err.message)
        setStatus("error")
      })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Upload your documents for processing. Supported formats: PDF, DOCX, XLSX, XLS, TXT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors",
              status === "error" && "border-destructive",
              status === "success" && "border-green-500"
            )}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={onFileSelect}
              accept=".pdf,.docx,.xlsx,.xls,.txt"
              disabled={status === "uploading"}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {status === "idle" && (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOCX, XLSX, XLS, TXT up to 10MB
                  </span>
                </>
              )}
              {status === "uploading" && (
                <>
                  <File className="h-8 w-8 text-primary animate-pulse" />
                  <span className="text-sm">Uploading {fileName}...</span>
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <span className="text-sm text-green-500">
                    Successfully uploaded {fileName}!
                  </span>
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </>
              )}
            </label>
          </div>
          {status === "uploading" && (
            <Progress value={progress} className="w-full" />
          )}
          {(status === "success" || status === "error") && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setStatus("idle")
                setProgress(0)
                setError("")
                setFileName("")
              }}
            >
              Upload Another Document
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
