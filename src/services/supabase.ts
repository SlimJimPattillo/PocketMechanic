import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Config } from '../constants/config';

export const supabase = createClient(Config.supabase.url, Config.supabase.anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // Enable session detection in URL for web builds
    // This allows email confirmation links to automatically sign users in
    // For mobile, users will need to manually sign in after email confirmation
    detectSessionInUrl: Platform.OS === 'web',
  },
});
