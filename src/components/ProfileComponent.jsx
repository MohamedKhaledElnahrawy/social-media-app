import React from 'react';

// (Followers, Following, Book Marks)
export function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-[25px] w-full md:w-32 py-5 text-center shadow-sm transition-transform hover:scale-105">
      <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest">{label}</p>
      <p className="text-3xl font-black text-[#1B2733]">{value}</p>
    </div>
  );
}

// (My Posts, Saved Posts)
export function InfoRow({ icon, label, value }) {
  return (
    <div className="bg-[#F8F9FA] rounded-[22px] p-5 flex justify-between items-center border border-gray-50 hover:bg-white transition-colors">
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-xl shadow-sm">
          {icon}
        </div>
        <span className="font-bold text-[#1B2733] text-sm tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-2xl font-black text-[#1B2733]">{value}</span>
    </div>
  );
}