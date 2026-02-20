'use client';

import React, { useState, useEffect } from 'react';
import { AudioFile, AudioFileCreate, AudioFileUpdate, AudioFileStats, AudioCategory } from '@/lib/types/audio';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

const AudioManagement: React.FC = () => {
  const router = useRouter();
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [stats, setStats] = useState<AudioFileStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState<AudioFileCreate>({
    title: '',
    filename: '',
    filePath: '',
    category: 'letter',
    module: 'alphabet-reading',
    language: 'tr',
    description: '',
    tags: []
  });

  useEffect(() => {
    fetchAudioFiles();
    fetchStats();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/audio');
      if (!response.ok) throw new Error('Failed to fetch audio files');
      const data = await response.json();
      setAudioFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/audio?stats=true');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handlePlayAudio = (audioFile: AudioFile) => {
    // Stop current playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // If same file is playing, stop it
    if (playingId === audioFile.id) {
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    // Play new audio
    const audio = new Audio(audioFile.filePath);
    audio.addEventListener('ended', () => {
      setPlayingId(null);
      setCurrentAudio(null);
    });
    audio.addEventListener('error', () => {
      setError(`Failed to play audio: ${audioFile.filename}`);
      setPlayingId(null);
      setCurrentAudio(null);
    });

    audio.play();
    setCurrentAudio(audio);
    setPlayingId(audioFile.id);
  };

  const handleCreateAudioFile = async () => {
    try {
      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create audio file');
      
      await fetchAudioFiles();
      await fetchStats();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateAudioFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch(`/api/audio/${selectedFile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update audio file');
      
      await fetchAudioFiles();
      await fetchStats();
      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedFile(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteAudioFile = async (id: string) => {
    if (!confirm('Bu ses dosyasını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/audio/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete audio file');
      
      await fetchAudioFiles();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      filename: '',
      filePath: '',
      category: 'letter',
      module: 'alphabet-reading',
      language: 'tr',
      description: '',
      tags: []
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (audioFile: AudioFile) => {
    setFormData({
      title: audioFile.title,
      filename: audioFile.filename,
      filePath: audioFile.filePath,
      category: audioFile.category,
      module: audioFile.module,
      language: audioFile.language,
      description: audioFile.description || '',
      tags: audioFile.tags || []
    });
    setSelectedFile(audioFile);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredAudioFiles = audioFiles.filter(file => {
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    const matchesModule = moduleFilter === 'all' || file.module === moduleFilter;
    const matchesSearch = !searchQuery || 
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesModule && matchesSearch;
  });

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const categories: AudioCategory[] = ['letter', 'word', 'sentence', 'celebration', 'custom'];
  const modules = ['alphabet-reading', 'vocabulary', 'social-communication', 'writing-expression', 'basic-concepts', 'mathematics', 'music-room', 'video-room', 'literacy', 'puzzle'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => router.push('/admin')}
            >
              ← Admin Paneli
            </Button>
            <h1 className="text-3xl font-bold text-white">🎵 Ses Dosyası Yönetimi</h1>
          </div>
          <Button
            variant="success"
            size="medium"
            onClick={openCreateModal}
          >
            + Yeni Ses Dosyası
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Dosya</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalFiles}</p>
                </div>
                <div className="text-3xl">📁</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Boyut</p>
                  <p className="text-2xl font-bold text-green-600">{formatFileSize(stats.totalSize)}</p>
                </div>
                <div className="text-3xl">💾</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Harfler</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.categoryCounts.letter}</p>
                </div>
                <div className="text-3xl">🔤</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kelimeler</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.categoryCounts.word}</p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tümü</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'letter' ? 'Harf' : 
                     category === 'word' ? 'Kelime' :
                     category === 'sentence' ? 'Cümle' :
                     category === 'celebration' ? 'Kutlama' : 'Özel'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modül
              </label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tümü</option>
                {modules.map(module => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arama
              </label>
              <input
                type="text"
                placeholder="Dosya adı ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                size="medium"
                onClick={() => {
                  setCategoryFilter('all');
                  setModuleFilter('all');
                  setSearchQuery('');
                }}
                className="w-full"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        </div>

        {/* Audio Files Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modül
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Boyut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAudioFiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Ses dosyası bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredAudioFiles.map((audioFile) => (
                    <tr key={audioFile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{audioFile.title}</div>
                        <div className="text-sm text-gray-500">{audioFile.filename}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          audioFile.category === 'letter' ? 'bg-blue-100 text-blue-800' :
                          audioFile.category === 'word' ? 'bg-green-100 text-green-800' :
                          audioFile.category === 'sentence' ? 'bg-purple-100 text-purple-800' :
                          audioFile.category === 'celebration' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {audioFile.category === 'letter' ? 'Harf' : 
                           audioFile.category === 'word' ? 'Kelime' :
                           audioFile.category === 'sentence' ? 'Cümle' :
                           audioFile.category === 'celebration' ? 'Kutlama' : 'Özel'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audioFile.module}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(audioFile.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatFileSize(audioFile.fileSize)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          audioFile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {audioFile.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePlayAudio(audioFile)}
                            className={`${
                              playingId === audioFile.id ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white px-3 py-1 rounded text-xs transition-colors`}
                          >
                            {playingId === audioFile.id ? '⏹️ Durdur' : '▶️ Oynat'}
                          </button>
                          <button
                            onClick={() => openEditModal(audioFile)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            ✏️ Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteAudioFile(audioFile.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? 'Ses Dosyasını Düzenle' : 'Yeni Ses Dosyası Ekle'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ses dosyası başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosya Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.filename}
                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="dosya-adi.mp3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosya Yolu *
                  </label>
                  <input
                    type="text"
                    value={formData.filePath}
                    onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="/audio/letters/a.mp3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as AudioCategory })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'letter' ? 'Harf' : 
                           category === 'word' ? 'Kelime' :
                           category === 'sentence' ? 'Cümle' :
                           category === 'celebration' ? 'Kutlama' : 'Özel'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dil *
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value as 'tr' | 'en' })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">İngilizce</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modül *
                  </label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {modules.map(module => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Ses dosyası açıklaması"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setSelectedFile(null);
                    resetForm();
                  }}
                >
                  İptal
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={isEditing ? handleUpdateAudioFile : handleCreateAudioFile}
                >
                  {isEditing ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioManagement; 