// Script pour extraire la photo de Thomas depuis localStorage
// À exécuter dans la console du navigateur sur localhost:3000

const photoBase64 = localStorage.getItem('skillshield_thomas_photo');
if (photoBase64) {
  console.log('Photo de Thomas trouvée !');
  console.log('Longueur:', photoBase64.length);
  console.log('Début:', photoBase64.substring(0, 100));
  // Copier dans le presse-papier
  navigator.clipboard.writeText(photoBase64).then(() => {
    console.log('✅ Photo copiée dans le presse-papier !');
    console.log('Vous pouvez maintenant la coller dans le code.');
  });
} else {
  console.log('❌ Aucune photo trouvée dans localStorage');
}



