import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { s3 } from '../../shared/storage';
import { db } from '../../shared/db';
import { config } from '../../shared/config';
import { PDFParse } from 'pdf-parse';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

// Download file from S3, count words, store in DB
export async function processResume(resumeId: string, s3Key: string): Promise<void> {
  // Download the file from S3
  const command = new GetObjectCommand({
    Bucket: config.S3_BUCKET,
    Key: s3Key,
  });
  const response = await s3.send(command);

  // Stream body to a buffer
  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of stream) {
    const bufferChunk = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
    totalBytes += bufferChunk.length;

    // Reject processing early if stream exceeds 2 MB limit
    if (totalBytes > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the 2 MB limit (${totalBytes} bytes received).`);
    }

    chunks.push(bufferChunk);
  }

  const buffer = Buffer.concat(chunks);

  const parser = new PDFParse({ data: buffer });

  // Word count: split the raw text on whitespace
  const result = await parser.getText();
  const wordCount = result.text.split(/\s+/).filter(Boolean).length;

  // Cleanup parser resources
  await parser.destroy();

  // Write back to the database
  await db.query(
    `UPDATE resumes SET word_count = $1 WHERE id = $2`,
    [wordCount, resumeId]
  );
}