/**
 * Générateur de Clés de Licence
 * 
 * Usage:
 *   node générateur-clés.js              # Génère 1 clé
 *   node générateur-clés.js 10            # Génère 10 clés
 *   node générateur-clés.js 5 PROD        # Génère 5 clés avec préfixe "PROD"
 */

const crypto = require('crypto');

/**
 * Génère une clé de licence unique
 * @param {string} prefix - Préfixe (ex: "NX", "PROD")
 * @returns {string} - Clé de licence générée
 */
function genererCle(prefix = 'NX') {
  // Générer 4 groupes de 4 caractères alphanumériques
  const groupe1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const groupe2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const groupe3 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const groupe4 = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `${prefix}-${groupe1}-${groupe2}-${groupe3}-${groupe4}`;
}

/**
 * Génère plusieurs clés de licence
 * @param {number} nombre - Nombre de clés à générer
 * @param {string} prefix - Préfixe
 * @returns {string[]} - Tableau de clés
 */
function genererCles(nombre = 1, prefix = 'NX') {
  const cles = [];
  const clesUniques = new Set();
  
  // Générer des clés uniques
  while (clesUniques.size < nombre) {
    const cle = genererCle(prefix);
    clesUniques.add(cle);
  }
  
  return Array.from(clesUniques);
}

// Exemple d'utilisation en ligne de commande
if (require.main === module) {
  const nombre = process.argv[2] || 1;
  const prefix = process.argv[3] || 'NX';
  
  console.log(`\n🔑 Génération de ${nombre} clé(s) de licence avec préfixe "${prefix}"...\n`);
  
  const cles = genererCles(parseInt(nombre), prefix);
  
  cles.forEach((cle, index) => {
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ${cle}`);
  });
  
  console.log(`\n✅ ${cles.length} clé(s) générée(s) !\n`);
  console.log('💡 Copiez ces clés et distribuez-les à vos utilisateurs.\n');
}

module.exports = { genererCle, genererCles };
