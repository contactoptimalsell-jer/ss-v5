// Script à exécuter dans la console du navigateur sur localhost:3000
// Pour extraire la photo de Thomas et la préparer pour l'intégration

(function() {
  const photoBase64 = localStorage.getItem('skillshield_thomas_photo');
  
  if (!photoBase64) {
    console.error('❌ Aucune photo de Thomas trouvée dans localStorage');
    console.log('Assurez-vous d\'être sur localhost:3000 et d\'avoir uploadé la photo');
    return;
  }
  
  console.log('✅ Photo de Thomas trouvée !');
  console.log('📏 Longueur:', photoBase64.length, 'caractères');
  console.log('🔍 Type:', photoBase64.substring(0, 30));
  console.log('');
  console.log('📋 Copie dans le presse-papier...');
  
  // Copier dans le presse-papier
  navigator.clipboard.writeText(photoBase64).then(() => {
    console.log('✅ Photo copiée dans le presse-papier !');
    console.log('');
    console.log('📝 Instructions:');
    console.log('1. La photo est maintenant dans votre presse-papier');
    console.log('2. Collez-la dans le chat pour que je l\'intègre dans le code');
    console.log('3. Ou utilisez cette commande pour l\'afficher:');
    console.log('   console.log(localStorage.getItem("skillshield_thomas_photo"))');
  }).catch(err => {
    console.error('❌ Erreur lors de la copie:', err);
    console.log('📋 Voici la photo (copiez-la manuellement):');
    console.log(photoBase64);
  });
})();



