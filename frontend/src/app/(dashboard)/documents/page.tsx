"use client"

import { useState, useCallback } from "react"
import { UploadDocument } from "@/components/upload-document"
import { DocumentList } from "@/components/document-list"

export default function DocumentsPage() {
  const [key, setKey] = useState(0)

  const handleRefresh = useCallback(() => {
    setKey(prev => prev + 1)
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground">
          Upload and manage your documents. We support PDF, DOCX, XLSX, XLS, and TXT files.
        </p>
      </div>

      <div className="grid gap-8">
        <UploadDocument onUploadSuccess={handleRefresh} />
        <DocumentList key={key} />
      </div>
    </div>
  )
}
