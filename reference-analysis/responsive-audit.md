# Audit responsive — 7 novembre 2026

## Périmètre

12 formats : 320×568, 360×800, 390×844, 430×932, 640×800, 768×1024, 1024×768, 1366×768, 1440×900, 1920×904, 2560×1440 et 844×390 (paysage).

Pages contrôlées : accueil, projets, compétences, expérience, certifications, blog, article, contact et événements. Soit 108 combinaisons avec l’accueil. Les fenêtres de projet ont aussi été contrôlées sur petit mobile et tablette, ainsi que le détail sur grand écran.

## Corrections

- Badge : textes, espacements, images et codes-barres dimensionnés par rapport à la carte avec les unités de conteneur, et non à la largeur du navigateur.
- Hero : position et taille du badge calculées à partir de la hauteur réelle du titre et de la zone de texte inférieure ; redimensionnement suivi avec ResizeObserver.
- Processus : disposition en grille, étapes visibles à la suite sur écrans très courts ou très étroits ; aucun chevauchement entre contenu et navigation.
- Expérience : dossiers dimensionnés par rapport à leur conteneur en tenant compte des documents dépliés et du rendu WebGL.
- Ancienne navigation : menu compact jusqu’à 1024 px ; menu déroulant et défilable sur les écrans courts.

## Résultat

96 combinaisons pages secondaires/formats : aucun débordement horizontal du document ni titre/paragraphe débordant détecté. Les éléments volontairement tronqués (line-clamp), les contenus réservés aux lecteurs d’écran et les zones à défilement interne sont exclus du contrôle de texte.

Accueil : vérification des 12 formats, des deux faces du badge et des espacements titre/carte/texte inférieur. Les mesures de la carte correspondent à ses dimensions disponibles ; le nom tient dans sa largeur.

Build, lint et 12 tests unitaires réussis. Les données détaillées des mesures sont dans responsive-audit.json. Ces contrôles représentent les principales tailles et leurs seuils ; ils ne prétendent pas couvrir tous les navigateurs physiques, tous les niveaux de zoom ou chaque taille possible.
