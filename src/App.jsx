import React, { useState } from 'react';
import { useInvoices } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceForm from './components/InvoiceForm';
import { ChevronRight, Plus, ChevronLeft, Trash2 } from 'lucide-react';
import emptyIllustration from './assets/Email campaign_Flatline.svg';
import Button from './components/Button';

const StatusBadge = ({ status }) => {
  let colors = '';
  switch (status.toLowerCase()) {
    case 'paid': colors = 'bg-[#33D69F]/10 text-[#33D69F]'; break;
    case 'pending': colors = 'bg-[#FF8F00]/10 text-[#FF8F00]'; break;
    case 'draft': colors = 'bg-slate-400/10 text-slate-500 dark:bg-slate-300/10 dark:text-[#DFE3FA]'; break;
    case 'overdue': colors = 'bg-tertiary/10 text-tertiary'; break;
    default: colors = 'bg-gray-500/10 text-gray-500';
  }

  return (
    <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg min-w-[104px] ${colors}`}>
      <div className="w-2 h-2 rounded-full bg-current shadow-[0_0_3px_currentColor]"></div>
      <span className="text-xs font-bold leading-none">{status}</span>
    </div>
  );
};

export default function App() {
  const { invoices, deleteInvoice, markAsPaid } = useInvoices();
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          /* Detail View */
          <div className="w-full max-w-4xl py-10 px-6 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={handleBack}
              className="flex items-center gap-6 font-bold text-slate-900 dark:text-white hover:text-[#888EB0] transition-colors mb-8"
            >
              <ChevronLeft className="text-primary" />
              Go back
            </button>

            <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-6 md:p-8 flex flex-wrap items-center justify-between shadow-sm border border-transparent dark:border-white/5 mb-6">
              <div className="flex items-center w-full justify-between sm:w-auto sm:justify-start gap-4">
                <span className="text-[#888EB0] text-sm">Status</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="edit" onClick={() => openForm(selectedInvoice)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete
                </Button>
                {selectedInvoice.status === 'Pending' && (
                  <Button
                    variant="primary"
                    onClick={() => { markAsPaid(selectedInvoice.id); setSelectedInvoice({ ...selectedInvoice, status: 'Paid' }); }}
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-8 md:p-12 shadow-sm border border-transparent dark:border-white/5">
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-8 mb-12">
                <div>
                  <h2 className="text-lg font-bold dark:text-white mb-2"><span className="text-[#888EB0]">#</span>{selectedInvoice.id}</h2>
                  <p className="text-[#888EB0] text-sm">Graphic Design</p>
                </div>
                <div className="text-[#888EB0] text-sm md:text-right flex flex-col gap-1">
                  <p>19 Union Terrace</p>
                  <p>London</p>
                  <p>E1 3EZ</p>
                  <p>United Kingdom</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 md:gap-24 mb-12">
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[#888EB0] text-sm mb-3">Invoice Date</h3>
                    <p className="font-bold text-lg dark:text-white">21 Aug 2021</p>
                  </div>
                  <div>
                    <h3 className="text-[#888EB0] text-sm mb-3">Payment Due</h3>
                    <p className="font-bold text-lg dark:text-white">{selectedInvoice.dueDate}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#888EB0] text-sm mb-3">Bill To</h3>
                  <p className="font-bold text-lg dark:text-white mb-2">{selectedInvoice.name}</p>
                  <div className="text-[#888EB0] text-sm flex flex-col gap-1">
                    <p>84 Church Way</p>
                    <p>Bradford</p>
                    <p>BD1 9PB</p>
                    <p>United Kingdom</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#888EB0] text-sm mb-3">Sent to</h3>
                  <p className="font-bold text-lg dark:text-white">{selectedInvoice.email}</p>
                </div>
              </div>

              <div className="bg-surface-container-low dark:bg-[#373B53]/20 rounded-t-xl p-6 md:p-8">
                <div className="hidden md:grid grid-cols-5 text-[#888EB0] text-sm mb-6">
                  <div className="col-span-2">Item Name</div>
                  <div className="text-center">QTY.</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Total</div>
                </div>

                <div className="flex flex-col gap-6">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:grid md:grid-cols-5 items-center dark:text-white font-bold">
                      <div className="col-span-2 w-full md:w-auto mb-2 md:mb-0">
                        {item.name}
                        <div className="text-[#888EB0] md:hidden">{item.qty} x £{item.price}</div>
                      </div>
                      <div className="text-center hidden md:block text-[#888EB0]">{item.qty}</div>
                      <div className="text-right hidden md:block text-[#888EB0]">£ {parseFloat(item.price).toFixed(2)}</div>
                      <div className="text-right w-full md:w-auto">£ {(parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)}</div>
                    </div>
                  )) : (
                    <div className="text-[#888EB0] text-center w-full">No items listed.</div>
                  )}
                </div>
              </div>

              <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-xl p-6 md:p-8 flex items-center justify-between text-white">
                <span className="text-sm">Amount Due</span>
                <span className="text-3xl font-black tracking-tighter">£ {selectedInvoice.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Mobile Footer Actions */}
            <div className="sm:hidden flex items-center justify-center gap-2 mt-6 bg-white dark:bg-inverse-surface p-6 shadow-2xl rounded-xl">
              <Button variant="edit" className="flex-1" onClick={() => openForm(selectedInvoice)}>
                Edit
              </Button>
              <Button variant="danger" className="flex-1" onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </Button>
            </div>
            {selectedInvoice.status === 'Pending' && (
              <div className="sm:hidden mt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => { markAsPaid(selectedInvoice.id); setSelectedInvoice({ ...selectedInvoice, status: 'Paid' }); }}
                >
                  Mark as Paid
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {isDeleteModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-inverse-surface rounded-xl p-8 md:p-12 max-w-[30rem] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl tracking-tighter font-bold text-slate-900 dark:text-white mb-4">Confirm Deletion</h2>
            <p className="text-[#888EB0] text-sm leading-relaxed mb-6 font-medium">
              Are you sure you want to delete invoice #{selectedInvoice.id}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 font-bold">
              <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteInvoice(selectedInvoice.id);
                  setIsDeleteModalOpen(false);
                  handleBack();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <InvoiceForm
        key={formOpen ? (editingInvoice ? editingInvoice.id : 'new') : 'closed'}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        invoiceToEdit={editingInvoice}
      />
    </div>
  );
}
