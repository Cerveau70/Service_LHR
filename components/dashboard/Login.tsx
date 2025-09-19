"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { User } from "../../types";

const Auth: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [step, setStep] = useState<"login-email" | "login-mfa" | "signup">(
    "login-email"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ----- LOGIN EMAIL -----
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await api.sendMfaCode(email);
    if (success) setStep("login-mfa");
    else setError("Aucun utilisateur trouvé avec cet email.");
    setLoading(false);
  };

  // ----- LOGIN MFA -----
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = await api.verifyMfaCode(email, mfaCode);
    if (user) {
      onLogin(user);
      navigate("/dashboard");
    } else setError("Code MFA invalide.");
    setLoading(false);
  };

  // ----- SIGNUP -----
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = await api.signup({ username, email, password });
    if (user) {
      onLogin(user);
      navigate("/dashboard");
    } else setError("Impossible de créer le compte.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            {step === "signup"
              ? "Inscription"
              : step === "login-email"
              ? "Connexion"
              : "Vérification MFA"}
          </h2>
          <p className="text-sm text-gray-600">
            {step === "signup"
              ? "Créez votre compte professionnel"
              : step === "login-email"
              ? "Connectez-vous à votre tableau de bord"
              : "Entrez le code envoyé à votre email"}
          </p>
        </div>

        {/* ----- LOGIN EMAIL ----- */}
        {step === "login-email" && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-800 transition"
            >
              {loading ? "Envoi du code..." : "Envoyer le code"}
            </button>
            <p
              className="text-sm text-gray-500 text-center mt-2 cursor-pointer hover:underline"
              onClick={() => setStep("signup")}
            >
              Pas de compte ? Inscrivez-vous
            </p>
          </form>
        )}

        {/* ----- LOGIN MFA ----- */}
        {step === "login-mfa" && (
          <form className="mt-8 space-y-6" onSubmit={handleMfaSubmit}>
            <input
              type="text"
              placeholder="Code MFA"
              required
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-800 transition"
            >
              {loading ? "Vérification..." : "Vérifier le code"}
            </button>
          </form>
        )}

        {/* ----- SIGNUP ----- */}
        {step === "signup" && (
          <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
            <input
              type="text"
              placeholder="Nom complet"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-800 transition"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
            <p
              className="text-sm text-gray-500 text-center mt-2 cursor-pointer hover:underline"
              onClick={() => setStep("login-email")}
            >
              Déjà un compte ? Connectez-vous
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
