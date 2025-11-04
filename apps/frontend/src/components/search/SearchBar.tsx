'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log({
      destination,
      startDate,
      endDate,
      travelers
    });
    
    alert(`Buscando viajes a: ${destination || 'cualquier destino'}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-black/30 backdrop-blur-sm rounded-full p-2 flex items-center gap-2 flex-wrap md:flex-nowrap max-w-4xl mx-auto"
    >
      {/* Destino */}
      <div className="flex items-center gap-2 px-4 flex-1 min-w-[200px]">
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          placeholder="Destino"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 outline-none bg-transparent text-white placeholder-white/70"
        />
      </div>

      {/* Rango de fechas */}
      <div className="flex items-center gap-2 px-4 flex-1 min-w-[200px] border-l border-white/30">
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 outline-none bg-transparent text-white"
          placeholder="Selecciona fechas"
        />
      </div>

      {/* Travelers */}
      <div className="flex items-center gap-2 px-4 flex-1 min-w-[150px] border-l border-white/30">
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <input
          type="number"
          min="1"
          value={travelers}
          onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
          className="w-20 outline-none bg-transparent text-white"
          placeholder="Viajeros"
        />
      </div>

      {/* Boton de busqueda */}
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar
      </button>
    </form>
  );
}