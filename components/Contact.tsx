"use client";
import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contactez-nous
        </motion.h2>
        <motion.p
          className="mt-3 text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Une question ? Une suggestion ? On vous répond vite et bien.
        </motion.p>
      </div>

      <motion.form
        className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Nom */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom
          </label>
          <input
            type="text"
            id="name"
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="exemple@email.com"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="message" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Écrivez votre message..."
          ></textarea>
        </div>

        {/* Bouton */}
        <motion.button
          type="submit"
          className="md:col-span-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Send size={18} />
          Envoyer
        </motion.button>
      </motion.form>
    </section>
  );
};

export default Contact;
