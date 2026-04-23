import React, { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { Trash2 } from 'lucide-react';
import Button from './Button';

export default function InvoiceForm({ isOpen, onClose, invoiceToEdit = null }) {
  const { addInvoice, updateInvoice } = useInvoices();

  const [formData, setFormData] = useState(
    invoiceToEdit || { name: '', email: '', dueDate: '', items: [] }
  );

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Client Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.dueDate) newErrors.dueDate = 'Due Date is required';
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';

    formData.items.forEach((item, idx) => {
      if (!item.name) newErrors[`item_${idx}_name`] = 'Item name required';
      if (!item.qty || parseFloat(item.qty) <= 0) newErrors[`item_${idx}_qty`] = 'Positive quantity required';
      if (!item.price || parseFloat(item.price) <= 0) newErrors[`item_${idx}_price`] = 'Positive price required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (status) => {
    if (status !== 'Draft' && !validate()) return;

    const invoice = {
      ...formData,
      status: status
    };

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, invoice);
    } else {
      addInvoice(invoice);
    }
    onClose();
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', qty: '1', price: '0' }]
    });
  };

  const removeItem = (idx) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx)
    });
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...formData.items];
    newItems[idx][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-start w-full transition-opacity duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-[#141625] h-full overflow-y-auto pl-20 lg:pl-24 transition-transform duration-300 transform translate-x-0">
        <div className="p-8 md:p-14">
          <h2 className="text-2xl font-bold dark:text-white mb-8">
            {invoiceToEdit ? 'Edit Invoice' : 'New Invoice'}
          </h2>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-4">
              <h3 className="text-primary font-bold text-sm tracking-wide">Bill To</h3>
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Client Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.name ? 'border-error' : 'border-transparent'} rounded-md p-4 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
                {errors.name && <span className="text-error text-xs font-bold">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Client Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.email ? 'border-error' : 'border-transparent'} rounded-md p-4 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
                {errors.email && <span className="text-error text-xs font-bold">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.dueDate ? 'border-error' : 'border-transparent'} rounded-md p-4 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
                {errors.dueDate && <span className="text-error text-xs font-bold">{errors.dueDate}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <h3 className="text-[#777F98] text-lg font-bold">Item List</h3>
              {errors.items && <span className="text-error text-xs font-bold mb-2">{errors.items}</span>}

              {formData.items.map((item, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-4">
                  <div className="flex flex-col flex-1 gap-2">
                    <label className="text-on-surface-variant dark:text-gray-400 text-xs">Item Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors[`item_${idx}_name`] ? 'border-error' : 'border-transparent'} rounded-md p-4 dark:text-white`}
                    />
                  </div>
                  <div className="flex flex-col w-16 gap-2">
                    <label className="text-on-surface-variant dark:text-gray-400 text-xs">Qty.</label>
                    <input
                      type="number"
                      min="0"
                      value={item.qty}
                      onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                      className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors[`item_${idx}_qty`] ? 'border-error' : 'border-transparent'} rounded-md p-4 dark:text-white px-2`}
                    />
                  </div>
                  <div className="flex flex-col w-24 gap-2">
                    <label className="text-on-surface-variant dark:text-gray-400 text-xs">Price</label>
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(idx, 'price', e.target.value)}
                      className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors[`item_${idx}_price`] ? 'border-error' : 'border-transparent'} rounded-md p-4 dark:text-white px-2`}
                    />
                  </div>
                  <div className="flex flex-col w-20 gap-2">
                    <label className="text-on-surface-variant dark:text-gray-400 text-xs truncate">Total</label>
                    <div className="p-4 text-on-surface-variant dark:text-gray-400 bg-transparent font-bold">
                      {((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-6">
                    <button type="button" onClick={() => removeItem(idx)} className="p-4 text-[#888EB0] hover:text-error transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="light"
                onClick={addItem}
                className="w-full"
              >
                + Add New Item
              </Button>
            </div>

          </form>

          {/* Footer Controls */}
          <div className="flex items-center justify-between mt-12 bg-white dark:bg-[#141625] sticky bottom-0 py-6 border-t border-surface-variant/40 dark:border-inverse-surface/40">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Discard
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="dark"
                onClick={() => handleSave('Draft')}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => handleSave('Pending')}
              >
                Save & Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
