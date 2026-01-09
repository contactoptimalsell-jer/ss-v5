// Script à exécuter dans la console du navigateur sur localhost:3000
// Copiez-collez ce code dans la console et appuyez sur Entrée

(function() {
  const photoBase64 = localStorage.getItem('skillshield_thomas_photo');
  
  if (photoBase64) {
    console.log('✅ Photo trouvée !');
    console.log('📋 Chaîne base64 copiée dans le presse-papier.');
    console.log('📏 Longueur:', photoBase64.length, 'caractères');
    
    // Copier dans le presse-papier
    navigator.clipboard.writeText(photoBase64).then(() => {
      console.log('✅ Photo copiée dans le presse-papier !');
      console.log('📝 Collez-la maintenant dans votre message.');
    }).catch(err => {
      console.error('❌ Erreur lors de la copie:', err);
      console.log('📋 Voici la chaîne (copiez-la manuellement):');
      console.log(photoBase64);
    });
  } else {
    console.error('❌ Aucune photo trouvée dans localStorage.');
    console.log('💡 Assurez-vous d\'avoir uploadé la photo sur localhost:3000');
  }
})();













