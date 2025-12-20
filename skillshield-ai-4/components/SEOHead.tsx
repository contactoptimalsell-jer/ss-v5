import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "SkillShield AI - Implémentation IA avec Gardien Humain | Remboursement 90% | France",
  description = "SkillShield AI : Agence française d'implémentation d'intelligence artificielle pour entreprises. Système de gardien humain, remboursement 90% si non performant, diagnostic SaaS unique. Restaurez 10-20h/semaine aux dirigeants.",
  keywords = "implémentation IA, intelligence artificielle entreprise, automatisation IA France, agent IA sur mesure, gardien humain IA, remboursement 90%, diagnostic IA SaaS, gain de temps dirigeant, automatisation processus entreprise",
  ogImage = "https://skillshield.app/og-image.jpg",
  canonicalUrl = "https://skillshield.app",
  noindex = false,
  type = 'website'
}) => {
  React.useEffect(() => {
    // Mettre à jour le titre
    document.title = title;

    // Mettre à jour ou créer les meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta description
    updateMetaTag('description', description);
    
    // Meta keywords
    updateMetaTag('keywords', keywords);

    // Open Graph
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:url', canonicalUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:locale', 'fr_FR', 'property');
    updateMetaTag('og:site_name', 'SkillShield AI', 'property');

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Langue
    document.documentElement.setAttribute('lang', 'fr');

    // Meta viewport (déjà dans index.html mais on s'assure qu'il est présent)
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }

    // Meta charset (déjà dans index.html mais on s'assure qu'il est présent)
    if (!document.querySelector('meta[charset]')) {
      const charset = document.createElement('meta');
      charset.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charset, document.head.firstChild);
    }
  }, [title, description, keywords, ogImage, canonicalUrl, noindex, type]);

  return null;
};

