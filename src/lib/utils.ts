import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// === AI Client Helpers ===

/** Convert Blob/File to base64 string (without data URL prefix). */
export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

/** Capture microphone for up to `ms` milliseconds and return WAV Blob. */
export async function recordMicrophone(ms: number = 5000): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = 'audio/webm';
  const mediaRecorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];
  return new Promise<Blob>((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onerror = (e) => reject(e);
    mediaRecorder.onstop = async () => {
      try {
        const webmBlob = new Blob(chunks, { type: mimeType });
        resolve(webmBlob);
      } catch (err) {
        reject(err);
      } finally {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), ms);
  });
}

export async function apiPostJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
    throw new Error(errorData.message || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function playBase64Audio(audioBase64: string, mimeType: string): Promise<void> {
  const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
  const blob = new Blob([audioBytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play();
  // Cleanup when playback ends
  audio.onended = () => URL.revokeObjectURL(url);
}
