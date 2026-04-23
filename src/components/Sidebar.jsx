import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useInvoices } from '../context/InvoiceContext';
import ProfileImage from "../assets/profile.png"

export default function Sidebar() {
  const { darkMode, setDarkMode } = useInvoices();

  return (
    <aside className="fixed left-0 top-0 w-full h-[72px] md:h-[80px] lg:h-screen lg:w-24 bg-[#373b53] dark:bg-inverse-surface lg:rounded-r-3xl flex flex-row lg:flex-col items-center justify-between lg:justify-start z-50 shadow-xl transition-colors duration-300">
      <div className="h-full w-[64px] md:w-[72px] lg:w-full lg:h-[103px] bg-primary flex items-center justify-center relative overflow-hidden lg:mb-auto shadow-lg shadow-primary/20 rounded-r-[1.25rem] cursor-pointer">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary-container rounded-tl-2xl"></div>
        <img src="/Logo.svg" alt="Logo" className="relative z-10 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </div>

      <div className="flex flex-row lg:flex-col items-center gap-6 lg:mt-auto h-full lg:h-auto lg:w-full pr-6 lg:pr-0 lg:py-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-[#858BB2] hover:text-[#DFE3FA] transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="h-full lg:h-auto lg:w-full border-l lg:border-l-0 lg:border-t border-[#494E6E] pl-6 lg:pl-0 lg:pt-6 flex items-center justify-center">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-container overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer">
            <img src={ProfileImage} alt="User avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </aside>
  );
}
