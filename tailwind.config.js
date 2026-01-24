/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette FLOW MOTOR - Luxe Automobile
        'cream': '#F4E8D8',           // Fond principal site & app
        'aubergine': '#3D1E1E',       // Titres, textes forts
        'brown': '#5C3A2E',           // Boutons, accents, header
        'black-tech': '#1A0F0F',      // Footer, éléments techniques
      },
      fontFamily: {
        // Typographie Luxe
        'playfair': ['"Playfair Display"', 'serif'],   // Titres
        'roboto': ['Roboto', 'sans-serif'],           // Corps de texte
      },
      borderRadius: {
        'xl': '1rem',  // Arrondis modernes mais structurés
      }
    },
  },
  plugins: [],
}
