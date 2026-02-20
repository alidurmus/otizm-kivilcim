import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AudioFile, AudioFileCreate, AudioFileUpdate, AudioFileStats } from '@/lib/types/audio';

const COLLECTION_NAME = 'audioFiles';

// Mock fallback for development
const mockAudioFiles: AudioFile[] = [];

export class AudioService {
  
  // Create new audio file
  static async createAudioFile(audioData: AudioFileCreate): Promise<string> {
    try {
      const docRef = await addDoc(collection(db as any, COLLECTION_NAME), {
        ...audioData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating audio file:', error);
      // Mock fallback
      const id = `mock-${Date.now()}`;
      mockAudioFiles.push({
        id,
        ...audioData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
      return id;
    }
  }

  // Get all audio files
  static async getAllAudioFiles(): Promise<AudioFile[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db as any, COLLECTION_NAME),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as AudioFile[];
    } catch (error) {
      console.error('Error getting audio files:', error);
      return mockAudioFiles;
    }
  }

  // Get audio file by ID
  static async getAudioFileById(id: string): Promise<AudioFile | null> {
    try {
      const docRef = doc(db as any, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as AudioFile;
      }
      return null;
    } catch (error) {
      console.error('Error getting audio file:', error);
      return mockAudioFiles.find(file => file.id === id) || null;
    }
  }

  // Update audio file
  static async updateAudioFile(id: string, updates: AudioFileUpdate): Promise<boolean> {
    try {
      const docRef = doc(db as any, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating audio file:', error);
      // Mock fallback
      const index = mockAudioFiles.findIndex(file => file.id === id);
      if (index !== -1) {
        mockAudioFiles[index] = {
          ...mockAudioFiles[index],
          ...updates,
          updatedAt: new Date()
        };
        return true;
      }
      return false;
    }
  }

  // Delete audio file
  static async deleteAudioFile(id: string): Promise<boolean> {
    try {
      const docRef = doc(db as any, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting audio file:', error);
      // Mock fallback
      const index = mockAudioFiles.findIndex(file => file.id === id);
      if (index !== -1) {
        mockAudioFiles.splice(index, 1);
        return true;
      }
      return false;
    }
  }

  // Get audio files by category
  static async getAudioFilesByCategory(category: string): Promise<AudioFile[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db as any, COLLECTION_NAME),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as AudioFile[];
    } catch (error) {
      console.error('Error getting audio files by category:', error);
      return mockAudioFiles.filter(file => file.category === category);
    }
  }

  // Get audio files by module
  static async getAudioFilesByModule(module: string): Promise<AudioFile[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db as any, COLLECTION_NAME),
          where('module', '==', module),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as AudioFile[];
    } catch (error) {
      console.error('Error getting audio files by module:', error);
      return mockAudioFiles.filter(file => file.module === module);
    }
  }

  // Get audio files statistics
  static async getAudioFileStats(): Promise<AudioFileStats> {
    try {
      const files = await this.getAllAudioFiles();
      
      const stats: AudioFileStats = {
        totalFiles: files.length,
        totalSize: files.reduce((sum, file) => sum + (file.fileSize || 0), 0),
        categoryCounts: {
          letter: 0,
          word: 0,
          sentence: 0,
          celebration: 0,
          custom: 0
        },
        moduleCounts: {},
        languageCounts: {}
      };

      files.forEach(file => {
        // Category counts
        stats.categoryCounts[file.category]++;
        
        // Module counts
        stats.moduleCounts[file.module] = (stats.moduleCounts[file.module] || 0) + 1;
        
        // Language counts
        stats.languageCounts[file.language] = (stats.languageCounts[file.language] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting audio file stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        categoryCounts: {
          letter: 0,
          word: 0,
          sentence: 0,
          celebration: 0,
          custom: 0
        },
        moduleCounts: {},
        languageCounts: {}
      };
    }
  }

  // Bulk operations
  static async bulkUpdateAudioFiles(updates: { id: string; data: AudioFileUpdate }[]): Promise<boolean> {
    try {
      const batch = writeBatch(db as any);
      
      updates.forEach(({ id, data }) => {
        const docRef = doc(db as any, COLLECTION_NAME, id);
        batch.update(docRef, {
          ...data,
          updatedAt: Timestamp.now()
        });
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error bulk updating audio files:', error);
      return false;
    }
  }

  static async bulkDeleteAudioFiles(ids: string[]): Promise<boolean> {
    try {
      const batch = writeBatch(db as any);
      
      ids.forEach(id => {
        const docRef = doc(db as any, COLLECTION_NAME, id);
        batch.delete(docRef);
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error bulk deleting audio files:', error);
      return false;
    }
  }
} 