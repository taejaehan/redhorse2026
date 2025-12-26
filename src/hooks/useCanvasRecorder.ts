import { useRef, useCallback, useState } from 'react';

interface UseCanvasRecorderOptions {
  filename?: string;
  fps?: number;
}

interface UseCanvasRecorderReturn {
  isRecording: boolean;
  startRecording: (canvas: HTMLCanvasElement) => void;
  stopRecording: () => void;
}

export function useCanvasRecorder({
  filename = 'recording',
  fps = 60,
}: UseCanvasRecorderOptions = {}): UseCanvasRecorderReturn {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const filenameRef = useRef(filename);

  filenameRef.current = filename;

  const downloadBlob = useCallback((blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const startRecording = useCallback(
    (canvas: HTMLCanvasElement) => {
      chunksRef.current = [];

      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        downloadBlob(blob, `${filenameRef.current}.webm`);
        setIsRecording(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    },
    [fps, downloadBlob]
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
