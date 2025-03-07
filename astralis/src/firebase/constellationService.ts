import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from './config';
import { Constellation } from '../assets/types';

// Helper to generate a unique numeric ID from Firestore ID
const firestoreIdToNumeric = (firestoreId: string): number => {
  // Convert the base36 string to a number
  return parseInt(firestoreId, 36);
};

// Save a new constellation to Firestore
export const saveConstellation = async (constellation: Omit<Constellation, 'id'>): Promise<string> => {
    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in to save a constellation');
      }
  
      // Convert nested arrays to maps/objects
      const starPositionsMap = constellation.starPositions.map((pos, index) => ({
        index,
        x: pos[0],
        y: pos[1],
        z: pos[2]
      }));
  
      const connectionsMap = constellation.connections.map((conn, index) => ({
        index,
        start: conn[0],
        end: conn[1]
      }));
  
      const constellationsRef = collection(db, 'constellations');
      const docRef = await addDoc(constellationsRef, {
        name: constellation.name,
        latinName: constellation.latinName,
        season: constellation.season,
        description: constellation.description,
        starPositionsMap, // Using the converted map instead of the nested array
        connectionsMap,   // Using the converted map instead of the nested array
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });
  
      return docRef.id;
    } catch (error) {
      console.error('Error saving constellation:', error);
      throw error;
    }
  };

// Get all constellations for the current user
export const getUserConstellations = async (): Promise<Constellation[]> => {
    try {
      if (!auth.currentUser) {
        return [];
      }
  
      const constellationsRef = collection(db, 'constellations');
      const q = query(constellationsRef, where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
  
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert maps back to arrays
        const starPositions = data.starPositionsMap 
          ? Array(data.starPositionsMap.length).fill([0, 0, 0])
          : [];
          
        const connections = data.connectionsMap
          ? Array(data.connectionsMap.length).fill([0, 0])
          : [];
        
        // Populate the arrays from the maps
        if (data.starPositionsMap) {
          data.starPositionsMap.forEach((pos: any) => {
            starPositions[pos.index] = [pos.x, pos.y, pos.z];
          });
        }
        
        if (data.connectionsMap) {
          data.connectionsMap.forEach((conn: any) => {
            connections[conn.index] = [conn.start, conn.end];
          });
        }
  
        return {
          id: firestoreIdToNumeric(doc.id),
          name: data.name,
          latinName: data.latinName || data.name,
          season: data.season || 'Spring',
          description: data.description || '',
          starPositions,
          connections,
        };
      });
    } catch (error) {
      console.error('Error getting user constellations:', error);
      throw error;
    }
  };
  
// Delete a constellation by ID
export const deleteConstellation = async (firestoreId: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('You must be logged in to delete a constellation');
    }

    const constellationRef = doc(db, 'constellations', firestoreId);
    await deleteDoc(constellationRef);
  } catch (error) {
    console.error('Error deleting constellation:', error);
    throw error;
  }
};