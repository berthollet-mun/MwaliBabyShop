import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, ShieldCheck, UserCheck, Key, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { User, Role } from '../../types';

export const UsersManager: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useStore();
  const { showSuccess } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'RESPONSABLE' as Role,
    password: '',
  });

  // Strict check: only INFORMATICIEN can access users management
  if (role !== 'INFORMATICIEN') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Accès Restreint</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Conformément au cahier des charges de MWALI Baby Shop, la gestion des comptes utilisateurs, des mots de passe et des permissions système est strictement réservée à l'<strong>Ingénieur Informaticien</strong>.
        </p>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      role: 'RESPONSABLE' as Role,
      password: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingId(u.id);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      password: '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      showSuccess('Compte utilisateur modifié', `L'accès pour ${formData.name} a été mis à jour.`);
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      showSuccess('Compte utilisateur créé', `L'accès pour ${formData.name} est activé.`);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header admin-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Zone Ingénieur Informaticien</span>
          </div>
          <h2 className="font-['Playfair_Display',serif] text-lg sm:text-xl font-bold text-stone-900">
            Gestion des Comptes & Rôles d'Accès
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Deux rôles autorisés : <strong>Responsable</strong> (catalogue) et <strong>Ingénieur Informaticien</strong> (accès total).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="admin-btn admin-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Utilisateur</span>
        </button>
      </div>

      {/* Users List */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4 min-w-[160px]">Utilisateur</th>
              <th className="py-3.5 px-4 min-w-[150px]">Email</th>
              <th className="py-3.5 px-4 min-w-[180px]">Rôle & Privilèges</th>
              <th className="py-3.5 px-4 min-w-[110px]">Date de Création</th>
              <th className="py-3.5 px-4 min-w-[80px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {users.map((u: User) => {
              const isCurrent = u.id === currentUser?.id;
              const isIT = u.role === 'INFORMATICIEN';
              return (
                <tr key={u.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5 truncate">
                          {u.name}
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-medium shrink-0">
                              Vous
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">{u.email}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                        isIT
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isIT ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                          <span>Ingénieur Informaticien (Total)</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Responsable (Catalogue)</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                        title="Modifier"
                        aria-label="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!isCurrent && (
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer l'accès pour ${u.name} ?`)) {
                              deleteUser(u.id);
                              showSuccess('Accès supprimé', `Le compte de ${u.name} a été révoqué.`);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          title="Supprimer"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isFormOpen && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal-card max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900 truncate">
                {editingId ? "Modifier l'Utilisateur" : 'Créer un Compte Collaborateur'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="admin-modal-body space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex. Judith Lumumba"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Adresse Email de connexion *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nom@ortance.com"
                    className="admin-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Attribution du Rôle *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="admin-select font-medium"
                  >
                    <option value="RESPONSABLE">
                      Responsable — Catalogue & Contenus
                    </option>
                    <option value="INFORMATICIEN">
                      Ingénieur Informaticien — Accès total
                    </option>
                  </select>
                </div>

                {!editingId && (
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Mot de passe provisoire
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="admin-input"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Le collaborateur pourra le modifier lors de sa première connexion.
                    </p>
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
