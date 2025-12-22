import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

export const UploadPhotosPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const jeromeFileInputRef = useRef<HTMLInputElement>(null);
  const thomasFileInputRef = useRef<HTMLInputElement>(null);
  
  const [jeromePhoto, setJeromePhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('skillshield_jerome_photo');
    } catch {
      return null;
    }
  });
  
  const [thomasPhoto, setThomasPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('skillshield_thomas_photo');
    } catch {
      return null;
    }
  });

  const [jeromeStatus, setJeromeStatus] = useState<string>('');
  const [thomasStatus, setThomasStatus] = useState<string>('');

  const handleJeromeUpload = () => {
    jeromeFileInputRef.current?.click();
  };

  const handleJeromeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      try {
        localStorage.setItem('skillshield_jerome_photo', base64String);
        setJeromePhoto(base64String);
        setJeromeStatus('success');
        setTimeout(() => setJeromeStatus(''), 3000);
      } catch (e) {
        setJeromeStatus('error');
        setTimeout(() => setJeromeStatus(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleThomasUpload = () => {
    thomasFileInputRef.current?.click();
  };

  const handleThomasFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      try {
        localStorage.setItem('skillshield_thomas_photo', base64String);
        setThomasPhoto(base64String);
        setThomasStatus('success');
        setTimeout(() => setThomasStatus(''), 3000);
      } catch (e) {
        setThomasStatus('error');
        setTimeout(() => setThomasStatus(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Inputs cachés */}
        <input 
          type="file" 
          ref={jeromeFileInputRef}
          onChange={handleJeromeFileChange}
          className="hidden"
          accept="image/*"
        />
        <input 
          type="file" 
          ref={thomasFileInputRef}
          onChange={handleThomasFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            📸 Upload des Photos
          </h1>
          <p className="text-gray-400 text-lg">
            Ajoutez les photos de Jérôme et Thomas. Une fois sauvegardées, elles seront figées sur la page "À propos".
          </p>
          <Button 
            onClick={onNavigateHome}
            className="mt-6"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </motion.div>

        {/* Section Jérôme */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 p-8 bg-white/5 rounded-2xl border border-violet-500/30"
        >
          <h2 className="text-2xl font-bold text-violet-400 mb-6">Photo de Jérôme Karr</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-violet-500/30 p-2 overflow-hidden bg-slate-800">
              {jeromePhoto ? (
                <img 
                  src={jeromePhoto} 
                  alt="Jérôme Karr" 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-gray-500">
                  Aucune photo
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <Button 
                onClick={handleJeromeUpload}
                className="w-full md:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                {jeromePhoto ? 'Changer la photo' : 'Uploader la photo'}
              </Button>
              
              {jeromeStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Photo sauvegardée avec succès !
                </div>
              )}
              
              {jeromeStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                  Erreur : Image trop lourde pour la sauvegarde
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section Thomas */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-8 bg-white/5 rounded-2xl border border-cyan-500/30"
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Photo de Thomas Estevenon</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-cyan-500/30 p-2 overflow-hidden bg-slate-800">
              {thomasPhoto ? (
                <img 
                  src={thomasPhoto} 
                  alt="Thomas Estevenon" 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-gray-500">
                  Aucune photo
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <Button 
                onClick={handleThomasUpload}
                className="w-full md:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                {thomasPhoto ? 'Changer la photo' : 'Uploader la photo'}
              </Button>
              
              {thomasStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Photo sauvegardée avec succès !
                </div>
              )}
              
              {thomasStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                  Erreur : Image trop lourde pour la sauvegarde
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center"
        >
          <p className="text-cyan-300">
            ✅ Une fois les photos uploadées, elles apparaîtront automatiquement sur la page "À propos" et ne pourront plus être modifiées depuis cette page.
          </p>
        </motion.div>
      </div>
    </div>
  );
};










