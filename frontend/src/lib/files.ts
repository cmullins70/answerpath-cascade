import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { Blob } from 'buffer'

// Base directory for file uploads
const UPLOADS_DIR = path.join(process.cwd(), 'src', 'uploads')

export async function saveFile(file: File | Blob): Promise<{ filePath: string }> {
  try {
    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true })

    // Generate a unique filename using timestamp and hash
    const timestamp = Date.now()
    const filename = 'name' in file ? file.name : `file-${timestamp}`
    const hash = crypto.createHash('md5').update(`${filename}-${timestamp}`).digest('hex')
    const ext = 'name' in file ? path.extname(file.name) : ''
    const uniqueFilename = `${timestamp}-${hash}${ext}`
    const filePath = path.join(UPLOADS_DIR, uniqueFilename)

    // Convert File/Blob to Buffer and save
    const arrayBuffer = await file.arrayBuffer()
    await fs.writeFile(filePath, Buffer.from(arrayBuffer))

    return { filePath }
  } catch (error) {
    console.error('Error saving file:', error)
    throw new Error('Failed to save file')
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Failed to delete file')
  }
}

export async function getFile(filePath: string): Promise<Buffer> {
  try {
    return await fs.readFile(filePath)
  } catch (error) {
    console.error('Error reading file:', error)
    throw new Error('Failed to read file')
  }
}
