import React from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'Service' | 'FAQPage' | 'WebSite' | 'BreadcrumbList' | 'HowTo';
  data?: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  React.useEffect(() => {
    let structuredData: any = {};

    switch (type) {
      case 'Organization':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'SkillShield AI',
          url: 'https://skillshield.app',
          logo: {
            '@type': 'ImageObject',
            url: 'https://skillshield.app/logo.png',
            width: 1200,
            height: 1200,
            caption: 'SkillShield AI Logo - Bouclier bleu avec cerveau'
          },
          image: 'https://skillshield.app/logo.png',
          description: "Agence française d'implémentation d'intelligence artificielle pour entreprises. Système de gardien humain, remboursement 90% si non performant.",
          address: {
            '@type': 'PostalAddress',
            streetAddress: '113 Rue Jean Jaurès',
            addressLocality: 'Levallois-Perret',
            postalCode: '92300',
            addressCountry: 'FR'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Service client',
            email: 'contact@skillshield-ai.com',
            availableLanguage: 'French'
          },
          sameAs: [
            'https://www.linkedin.com/company/skillshield-ai',
            'https://twitter.com/skillshield_ai'
          ],
          ...data
        };
        break;

      case 'Service':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: "Implémentation d'Intelligence Artificielle pour Entreprises",
          provider: {
            '@type': 'Organization',
            name: 'SkillShield AI'
          },
          areaServed: {
            '@type': 'Country',
            name: 'France'
          },
          description: "Implémentation d'agents IA sur mesure avec système de gardien humain. Remboursement 90% si le système n'est pas performant. Diagnostic SaaS unique pour restaurer 10-20h/semaine aux dirigeants.",
          offers: {
            '@type': 'Offer',
            description: "Garantie résultat avec remboursement à 90% si le système n'est pas performant ou comme le client le souhaitait",
            priceCurrency: 'EUR'
          },
          ...data
        };
        break;

      case 'FAQPage':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data?.faqs || []
        };
        break;

      case 'WebSite':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'SkillShield AI',
          url: 'https://skillshield.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://skillshield.app/?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          },
          ...data
        };
        break;

      case 'BreadcrumbList':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.items || []
        };
        break;

      case 'HowTo':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: data?.name || '',
          description: data?.description || '',
          image: data?.image || 'https://skillshield.app/og-image.jpg',
          totalTime: data?.totalTime || '',
          supply: data?.supply || [],
          tool: data?.tool || [],
          step: data?.steps || []
        };
        break;
    }

    // Supprimer l'ancien script s'il existe
    const existingScript = document.getElementById(`structured-data-${type}`);
    if (existingScript) {
      existingScript.remove();
    }

    // Créer le nouveau script
    const script = document.createElement('script');
    script.id = `structured-data-${type}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 0);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(`structured-data-${type}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
};

