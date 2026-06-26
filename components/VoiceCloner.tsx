'use client';

import React, { useState, useRef } from 'react';
import { Upload, Mic, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceClonerProps {
  onVoiceCreated?: (voiceId: string) => void;
}

export default function VoiceCloner({ onVoiceCreated }: VoiceClonerProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setStatus('error');
        setErrorMessage('Dosya boyutu çok büyük. Lütfen 5MB altında bir dosya seçin.');
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) {
      setStatus('error');
      setErrorMessage('Lütfen ses ismi girin ve dosya seçin.');
      return;
    }

    setIsUploading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', 'Kıvılcım uygulaması için ebeveyn/özel ses klonu');
      formData.append('file', file);

      const response = await fetch('/api/speech/voices/add', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        if (onVoiceCreated) {
          onVoiceCreated(data.voiceId);
        }
        // Save to local storage automatically as the preferred custom voice
        localStorage.setItem('kivilcim_custom_voice_id', data.voiceId);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Ses yüklenirken bir hata oluştu.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Bağlantı hatası.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border-2 border-gray-200 dark:border-dark-border shadow-sm max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-focus-blue/10 rounded-xl">
          <Mic className="w-6 h-6 text-focus-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-text-color dark:text-dark-text">Sesini Klonla</h2>
          <p className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary">
            Çocuğunuzun eğitiminde kullanmak üzere kendi sesinizi yükleyin
          </p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-dark-text mb-2">
            Ses Adı (Örn: Anne Sesi)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUploading || status === 'success'}
            className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-text-color dark:text-dark-text focus:border-focus-blue focus:ring-2 focus:ring-focus-blue/20 transition-all outline-none"
            placeholder="Kısa bir isim girin"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-dark-text mb-2">
            Ses Dosyası (.mp3 veya .wav)
          </label>
          <div 
            onClick={() => !isUploading && status !== 'success' && fileInputRef.current?.click()}
            className={`w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
              file 
                ? 'border-focus-blue bg-focus-blue/5' 
                : 'border-gray-300 dark:border-dark-border hover:border-focus-blue hover:bg-gray-50 dark:hover:bg-dark-border'
            } ${isUploading || status === 'success' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/mpeg, audio/wav"
              className="hidden"
              disabled={isUploading || status === 'success'}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-success-green mb-2" />
                <span className="font-bold text-text-color dark:text-dark-text">{file.name}</span>
                <span className="text-xs text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500 dark:text-dark-text-secondary">
                <Upload className="w-8 h-8 mb-2" />
                <span className="font-bold">Dosya seçmek için tıklayın</span>
                <span className="text-xs mt-1">Maksimum 5 MB (Gürültüsüz, temiz bir kayıt)</span>
              </div>
            )}
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center p-4 bg-success-green/10 rounded-xl border-2 border-success-green/30 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <p className="font-extrabold text-lg">Ses Başarıyla Klonlandı!</p>
            <p className="text-sm font-bold mt-1 text-center">Artık oyunlarda sizin sesiniz kullanılacak.</p>
          </div>
        ) : (
          <button
            type="submit"
            disabled={!file || !name || isUploading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-focus-blue text-white rounded-xl font-extrabold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Yükleniyor... (Bu işlem sürebilir)
              </>
            ) : (
              'Sesi Klonla'
            )}
          </button>
        )}
      </form>
    </div>
  );
}
