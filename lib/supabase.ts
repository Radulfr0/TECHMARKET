// lib/supabase.ts

// Esta importação é crucial. Ela "preenche" funcionalidades de URL que a biblioteca do Supabase espera
// que existam, mas que nao sao nativas do ambiente React Native.
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Substitua pelas credenciais do seu projeto Supabase (encontradas nas Configurações -> API).
const supabaseUrl = 'https://jxowxjxcuslfqokkpedn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b3d4anhjdXNsZnFva2twZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTgyMzcsImV4cCI6MjA3OTc5NDIzN30.plFTQrTwlxsSGSJoPo6VP5D5vEOTHxcXNwS0-c5rdPQ' ;

// Aqui criamos e exportamos uma instância única (singleton) do cliente Supabase.
// Isso permite que importemos 'supabase' em qualquer parte do nosso app para interagir com o banco.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);