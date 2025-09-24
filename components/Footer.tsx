import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-900 text-white py-6 w-full fixed bottom-0">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} PrestiSéjour Services. Tous droits réservés.</p>
                <div className="mt-2 text-sm text-gray-300">
                    <a href="#" className="hover:text-white mx-2">Politique de confidentialité</a>
                    <span className="text-gray-400">|</span>
                    <a href="#" className="hover:text-white mx-2">Termes et conditions</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
