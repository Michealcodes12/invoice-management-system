import React, { useState } from 'react';
import { useInvoices } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceForm from './components/InvoiceForm';
import { ChevronRight, Plus, ChevronLeft, Trash2 } from 'lucide-react';
import emptyIllustration from './assets/Email campaign_Flatline.svg';
import Button from './components/Button';

import InvoiceDetail from './components/InvoiceDetail';
import StatusBadge from './components/StatusBadge';

export default function App() {
  const { invoices, deleteInvoice, markAsPaid } = useInvoices();
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredInvoices = invoices.filter(inv => filter === 'All' || inv.status === filter);

  const openForm = (inv = null) => {
    setEditingInvoice(inv);
    setFormOpen(true);
  };

  const handleBack = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className="min-h-screen font-sans flex transition-colors duration-300 bg-background dark:bg-[#0C0E16] text-slate-900 dark:text-white">
      <Sidebar />

      <main className="mt-[72px] md:mt-[80px] lg:mt-0 lg:ml-24 flex-1 flex flex-col items-center">
        {!selectedInvoice ? (
          <div className="w-full max-w-5xl py-10 px-6 md:px-12">
            <header className="flex flex-wrap justify-between items-center w-full mb-16">
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tighter dark:text-white">Invoices</h1>
                <p className="text-on-surface-variant dark:text-gray-400 text-sm font-medium mt-1">
                  {filteredInvoices.length === 0 ? 'No invoices' : `There are ${filteredInvoices.length} total invoices`}
                </p>
              </div>

              <div className="flex items-center gap-4 md:gap-10">
                <div className="relative group cursor-pointer z-40">
                  <div className="flex items-center gap-3" onClick={() => setFilterOpen(!filterOpen)}>
                    <span className="font-bold text-sm tracking-tight dark:text-white">Filter <span className="hidden md:inline">by status</span></span>
                    <ChevronRight className={`w-4 h-4 text-primary font-bold ${filterOpen ? '-rotate-90' : 'rotate-90'} transition-transform`} />
                  </div>
                  {filterOpen && (
                    <div className="absolute top-10 w-48 bg-white dark:bg-inverse-surface shadow-2xl rounded-xl p-4 flex flex-col gap-3 left-1/2 -translate-x-1/2">
                      {['All', 'Draft', 'Pending', 'Paid'].map(opt => (
                        <label key={opt} className="flex items-center gap-4 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filter === opt}
                            onChange={() => { setFilter(opt); setFilterOpen(false); }}
                            className="w-5 h-5 accent-primary rounded bg-surface-container-high border-none cursor-pointer"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  onClick={() => openForm()}
                  className="pl-2 pr-4 py-2 active:scale-95 gap-3"
                >
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                    <Plus className="text-primary w-5 h-5 font-black" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">New <span className="hidden md:inline">Invoice</span></span>
                </Button>
              </div>
            </header>

            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-20">
                <img src={emptyIllustration} alt="Illustration of an empty invoice list" />
                <h2 className="text-3xl font-extrabold dark:text-white mt-8 mb-4 tracking-tighter">There is nothing here</h2>
                <p className="text-[#888eb0] text-sm md:w-64 leading-relaxed font-medium">Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredInvoices.map((inv) => (
                  <article
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="group bg-surface-container-lowest dark:bg-inverse-surface hover:ring-1 hover:ring-primary transition-all duration-300 p-6 md:py-4 md:px-8 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer shadow-sm border border-transparent dark:border-white/5"
                  >
                    <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 md:gap-12">
                      <span className="font-bold tracking-tight dark:text-white"><span className="text-[#888EB0]">#</span>{inv.id}</span>
                      <span className="text-[#888EB0] dark:text-[#DFE3FA] font-medium text-sm">Due {inv.dueDate}</span>
                      <span className="text-[#888EB0] dark:text-white text-sm md:w-32 truncate">{inv.name}</span>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 md:flex-1">
                      <span className="text-lg font-extrabold tracking-tighter dark:text-white">£ {inv.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={inv.status} />
                        <ChevronRight className="text-primary hidden md:block group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
         
          <InvoiceDetail 
            invoice={selectedInvoice}
            onBack={handleBack}
            onEdit={openForm}
            onMarkAsPaid={() => {
              markAsPaid(selectedInvoice.id);
              setSelectedInvoice({ ...selectedInvoice, status: 'Paid' });
            }}
            onDelete={(id) => {
              deleteInvoice(id);
              handleBack();
            }}
          />
        )}
      </main>

      <InvoiceForm
        key={formOpen ? (editingInvoice ? editingInvoice.id : 'new') : 'closed'}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        invoiceToEdit={editingInvoice}
      />
    </div>
  )
}
