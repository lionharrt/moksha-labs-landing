import { initializeApp, getApps } from 'firebase/app'
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'

export const useFirebase = () => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  // Initialize Firebase
  const apps = getApps()
  const app = !apps.length ? initializeApp(firebaseConfig) : apps[0]
  const storage = getStorage(app)

  /**
   * Get a download URL for a file in Firebase Storage
   * @param path The path to the file in storage (e.g., 'projects/my-image.jpg')
   */
  const getAssetUrl = async (path: string) => {
    try {
      const fileRef = storageRef(storage, path)
      return await getDownloadURL(fileRef)
    } catch (error) {
      console.error('Error fetching Firebase asset:', error)
      return null
    }
  }

  return {
    app,
    storage,
    getAssetUrl
  }
}

