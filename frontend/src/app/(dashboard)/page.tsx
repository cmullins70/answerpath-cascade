'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setDocuments((prev) => [data, ...prev]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents</h1>
        <div className="flex items-center space-x-2">
          <Button disabled={isUploading}>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
              />
              <div className="flex items-center">
                <Icons.upload className="mr-2 h-4 w-4" />
                Upload Document
              </div>
            </label>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents uploaded yet. Upload your first document to get started.
              </p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc: any) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <Icons.file className="h-4 w-4" />
                      <span>{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Questions extracted from your documents will appear here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your organization's knowledge base helps improve response accuracy.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/dashboard/knowledge-base">Manage Knowledge Base</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
