import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Button from './Button';
import StatusBadge from './StatusBadge';

export default function InvoiceDetail({ invoice, onBack, onEdit, onMarkAsPaid, onDelete }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl py-10 px-6 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-6 font-bold text-slate-900 dark:text-white hover:text-[#888EB0] transition-colors mb-8"
      >
        <ChevronLeft className="text-primary" />
        Go back
      </button>

      <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-6 md:p-8 flex flex-wrap items-center justify-between shadow-sm border border-transparent dark:border-white/5 mb-6">
        <div className="flex items-center w-full justify-between sm:w-auto sm:justify-start gap-4">
          <span className="text-[#888EB0] text-sm">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="edit" onClick={() => onEdit(invoice)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
          {invoice.status === 'Pending' && (
            <Button variant="primary" onClick={onMarkAsPaid}>
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-8 md:p-12 shadow-sm border border-transparent dark:border-white/5">
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-8 mb-12">
          <div>
            <h2 className="text-lg font-bold dark:text-white mb-2"><span className="text-[#888EB0]">#</span>{invoice.id}</h2>
            <p className="text-[#888EB0] text-sm">{invoice.projectDescription}</p>
          </div>
          <div className="text-[#888EB0] text-sm md:text-right flex flex-col gap-1">
            <p>{invoice.senderAddress?.street}</p>
            <p>{invoice.senderAddress?.city}</p>
            <p>{invoice.senderAddress?.postCode}</p>
            <p>{invoice.senderAddress?.country}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 md:gap-24 mb-12">
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-[#888EB0] text-sm mb-3">Invoice Date</h3>
              <p className="font-bold text-lg dark:text-white">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
            </div>
            <div>
              <h3 className="text-[#888EB0] text-sm mb-3">Payment Due</h3>
              <p className="font-bold text-lg dark:text-white">{invoice.dueDate}</p>
            </div>
          </div>

          <div>
            <h3 className="text-[#888EB0] text-sm mb-3">Bill To</h3>
            <p className="font-bold text-lg dark:text-white mb-2">{invoice.name}</p>
            <div className="text-[#888EB0] text-sm flex flex-col gap-1">
              <p>{invoice.clientAddress?.street}</p>
              <p>{invoice.clientAddress?.city}</p>
              <p>{invoice.clientAddress?.postCode}</p>
              <p>{invoice.clientAddress?.country}</p>
            </div>
          </div>

          <div>
            <h3 className="text-[#888EB0] text-sm mb-3">Sent to</h3>
            <p className="font-bold text-lg dark:text-white">{invoice.email}</p>
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
            {invoice.items && invoice.items.length > 0 ? invoice.items.map((item, idx) => (
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
          <span className="text-3xl font-black tracking-tighter">£ {invoice.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Mobile Footer Actions */}
      <div className="sm:hidden flex items-center justify-center gap-2 mt-6 bg-white dark:bg-inverse-surface p-6 shadow-2xl rounded-xl">
        <Button variant="edit" className="flex-1" onClick={() => onEdit(invoice)}>
          Edit
        </Button>
        <Button variant="danger" className="flex-1" onClick={() => setIsDeleteModalOpen(true)}>
          Delete
        </Button>
      </div>
      {invoice.status === 'Pending' && (
        <div className="sm:hidden mt-2">
          <Button variant="primary" className="w-full" onClick={onMarkAsPaid}>
            Mark as Paid
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-inverse-surface rounded-xl p-8 md:p-12 max-w-[30rem] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl tracking-tighter font-bold text-slate-900 dark:text-white mb-4">Confirm Deletion</h2>
            <p className="text-[#888EB0] text-sm leading-relaxed mb-6 font-medium">
              Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 font-bold">
              <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(invoice.id);
                  setIsDeleteModalOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
