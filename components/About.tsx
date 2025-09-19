"use client";
import React from "react";
import { motion } from "framer-motion";
import { Building2, Hotel, Home } from "lucide-react";

const About: React.FC = () => {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Décor animé subtil */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-indigo-300 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -30, 15, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Titre */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          À propos de{" "}
          <span className="text-indigo-600">Service LHR</span>
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Nous simplifions la réservation et la gestion de logements, hôtels et
          résidences en Côte d'Ivoire grâce à une plateforme moderne, fluide et
          sécurisée.
        </motion.p>

        {/* Icônes */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          <motion.div
            className="flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-12 h-12 text-indigo-500 mb-3" />
            <p className="text-gray-800 font-semibold">Logements modernes</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <Hotel className="w-12 h-12 text-purple-500 mb-3" />
            <p className="text-gray-800 font-semibold">Hôtels sécurisés</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <Building2 className="w-12 h-12 text-pink-500 mb-3" />
            <p className="text-gray-800 font-semibold">Résidences confortables</p>
          </motion.div>
        </div>

        {/* Texte en bas */}
        <motion.div
          className="space-y-5 text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.3 },
            },
          }}
        >
          <motion.p>
            Service LHR est votre partenaire de confiance pour vos séjours.
          </motion.p>
          <motion.p>
            Nous connectons propriétaires, gestionnaires d'hôtels et voyageurs
            pour créer des expériences fluides et mémorables.
          </motion.p>
          <motion.p>
            Avec notre plateforme, trouvez le logement idéal ou gérez vos
            propriétés en toute simplicité.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
