export interface AudioFile {
  id: string;
  title: string;
  filename: string;
  filePath: string;
  category: AudioCategory;
  module: string;
  language: 'tr' | 'en';
  voiceId?: string;
  voiceName?: string;
  duration?: number;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  description?: string;
  tags?: string[];
}

export type AudioCategory = 'letter' | 'word' | 'sentence' | 'celebration' | 'custom';

export interface AudioFileCreate {
  title: string;
  filename: string;
  filePath: string;
  category: AudioCategory;
  module: string;
  language: 'tr' | 'en';
  voiceId?: string;
  voiceName?: string;
  duration?: number;
  fileSize?: number;
  description?: string;
  tags?: string[];
}

export interface AudioFileUpdate {
  title?: string;
  filename?: string;
  filePath?: string;
  category?: AudioCategory;
  module?: string;
  language?: 'tr' | 'en';
  voiceId?: string;
  voiceName?: string;
  duration?: number;
  fileSize?: number;
  description?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface AudioFileStats {
  totalFiles: number;
  totalSize: number;
  categoryCounts: Record<AudioCategory, number>;
  moduleCounts: Record<string, number>;
  languageCounts: Record<string, number>;
} 