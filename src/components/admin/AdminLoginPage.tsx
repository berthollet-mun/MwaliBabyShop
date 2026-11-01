import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminLoginPageProps {
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToSite }) => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      const errMsg = res.error || 'Identifiants incorrects. Vérifiez votre adresse email et mot de passe.';
      setError(errMsg);
      showError('Connexion échouée', errMsg);
    } else {
      showSuccess('Connexion réussie', 'Bienvenue sur l’espace d’administration MWALI Baby Shop.');
    }
  };

  return (
    <div className="min-h-screen bg-[#24103f] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-3 sm:px-4">
        {/* Brand mark */}
        <div className="text-center space-y-1.5 mb-6 sm:mb-8">
          <span className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white">
            MWALI Baby Shop
          </span>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#ff8fb5] font-semibold">
            Espace d'Administration & Gestion
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#32144f] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">Connexion Collaborateur</h2>
            <p className="text-xs text-stone-400">
              Saisissez vos identifiants pour accéder à la console de gestion.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Adresse email
              </label>
              <div className="admin-login-input-wrap relative">
                <Mail className="admin-login-input-icon" aria-hidden="true" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@gmail.com"
                  className="admin-input admin-login-input w-full bg-[#24103f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e83c78]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Mot de passe
              </label>
              <div className="admin-login-input-wrap relative">
                <Lock className="admin-login-input-icon" aria-hidden="true" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input admin-login-input w-full bg-[#24103f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e83c78]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 min-h-[46px] rounded-xl bg-[#e83c78] hover:bg-[#cf2c67] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se Connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

