import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/db"
import { saveFile } from "@/lib/files"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    console.log("Auth session:", session)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const uploadedFile = formData.get("file")
    console.log("Received file:", uploadedFile ? {
      name: 'name' in uploadedFile ? uploadedFile.name : 'unknown',
      type: uploadedFile.type,
      size: uploadedFile.size
    } : null)

    if (!uploadedFile || !(uploadedFile instanceof Blob)) {
      console.error("No file or invalid file type received")
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Create a File object from the Blob
    const file = new File([uploadedFile], uploadedFile.name || 'file', {
      type: uploadedFile.type
    })
    console.log("Created File object:", {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/plain"
    ]
    
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type)
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOCX, XLSX, XLS, and TXT files are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      console.error("File too large:", file.size)
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      )
    }

    // Get or create user
    console.log("Creating/updating user for:", session.user.email)
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      },
    })
    console.log("User record:", user)

    // Save the file to disk
    console.log("Saving file to disk...")
    const { filePath } = await saveFile(file)
    console.log("File saved at:", filePath)

    // Create document record
    console.log("Creating document record...")
    const document = await prisma.document.create({
      data: {
        title: file.name, // Use filename as initial title
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        filePath: filePath,
        status: "processing",
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
        userId: user.id,
      },
    })
    console.log("Document record created:", document)

    // For now, we'll just simulate processing
    // TODO: Implement actual document processing (text extraction, etc.)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update document status
    console.log("Updating document status...")
    await prisma.document.update({
      where: { id: document.id },
      data: { status: "processed" },
    })

    return NextResponse.json({ 
      message: "File uploaded successfully",
      document: {
        id: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        fileType: document.fileType,
        status: "processed",
      }
    })
  } catch (error) {
    console.error("Upload error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
