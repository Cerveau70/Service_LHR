import React, { useEffect, useState } from 'react';
import { User, UserRole, Property, Reservation } from '../../types/extended';
import extendedApi from '../../services/extendedApiFixed';
import { FaBuilding, FaCalendarAlt, FaUsers, FaClipboardList, FaTrashAlt, FaEdit, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IconType } from 'react-icons';

const IconWrapper: React.FC<{ icon: IconType; className?: string }> = ({ icon: Icon, className }) => <Icon className={className} />;

interface DashboardHomeProps {
  currentUser: User;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ currentUser }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      if (currentUser.role === UserRole.ADMIN) {
        const [fetchedProperties, fetchedReservations, fetchedUsers] = await Promise.all([
          extendedApi.getProperties(),
          extendedApi.getAllReservations(),
          extendedApi.getUsers()
        ]);
        setProperties(fetchedProperties);
        setReservations(fetchedReservations);
        setUsers(fetchedUsers);
      } else if ([UserRole.AGENT, UserRole.MANAGER].includes(currentUser.role)) {
        const [agentProps, agentRes] = await Promise.all([
          extendedApi.getAgentProperties(currentUser.id),
          extendedApi.getReservationsForAgent(currentUser.id)
        ]);
        setProperties(agentProps);
        setReservations(agentRes);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce bien ?')) {
      await extendedApi.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      await extendedApi.deleteReservation(id);
      setReservations(reservations.filter(r => r.id !== id));
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      await extendedApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Cartes statistiques
  const stats = [
    { label: 'Biens Disponibles', value: properties.filter(p => p.available).length, icon: FaCheckCircle, color: 'bg-green-600' },
    { label: 'Biens Indisponibles', value: properties.filter(p => !p.available).length, icon: FaTimesCircle, color: 'bg-red-600' },
    { label: 'Réservations', value: reservations.length, icon: FaCalendarAlt, color: 'bg-blue-600' },
    { label: 'Utilisateurs', value: users.length, icon: FaUsers, color: 'bg-purple-600' },
  ];

  return (
    <div className="flex flex-col space-y-6 w-full">

      {/* Cartes statistiques en haut sans espace blanc inutile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((s, idx) => (
          <div key={idx} className={`p-6 rounded-xl shadow-lg text-white bg-blue-600 flex items-center justify-between transition-transform hover:scale-105`}>

            <div>
              <h3 className="text-lg font-semibold">{s.label}</h3>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
            <IconWrapper icon={s.icon} className="text-5xl opacity-80" />
          </div>
        ))}
      </div>

      {/* Sections principales */}
      {currentUser.role === UserRole.ADMIN && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biens */}
          <section className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <IconWrapper icon={FaBuilding} className="mr-2 text-blue-700" /> Biens
            </h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2">Nom</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Disponibilité</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.serviceType}</td>
                    <td className="p-2">{p.available ? 'Disponible' : 'Indisponible'}</td>
                    <td className="p-2 flex space-x-2">
                      <button onClick={() => handleDeleteProperty(p.id)} className="text-red-600 hover:text-red-800"><FaTrashAlt /></button>
                      <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Réservations */}
          <section className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <IconWrapper icon={FaClipboardList} className="mr-2 text-blue-700" /> Réservations
            </h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2">Client</th>
                  <th className="p-2">Bien</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2">{r.clientName}</td>
                    <td className="p-2">{r.propertyName}</td>
                    <td className="p-2">{r.startDate}</td>
                    <td className="p-2 flex space-x-2">
                      <button onClick={() => handleDeleteReservation(r.id)} className="text-red-600 hover:text-red-800"><FaTrashAlt /></button>
                      <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Utilisateurs */}
          <section className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <IconWrapper icon={FaUsers} className="mr-2 text-blue-700" /> Utilisateurs
            </h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2">Nom</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Rôle</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2 flex space-x-2">
                      <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-800"><FaTrashAlt /></button>
                      <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
