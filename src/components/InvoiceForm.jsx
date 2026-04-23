import React, { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { Trash2 } from 'lucide-react';
import Button from './Button';

export default function InvoiceForm({ isOpen, onClose, invoiceToEdit = null }) {
  const { addInvoice, updateInvoice } = useInvoices();

  const [formData, setFormData] = useState(
    invoiceToEdit || {
      senderAddress: { street: '', city: '', postCode: '', country: '' },
      name: '',
      email: '',
      clientAddress: { street: '', city: '', postCode: '', country: '' },
      invoiceDate: '',
      paymentTerms: '30',
      projectDescription: '',
      items: []
    }
  );

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.senderAddress.street) newErrors.senderStreet = 'Required';
    if (!formData.senderAddress.city) newErrors.senderCity = 'Required';
    if (!formData.senderAddress.postCode) newErrors.senderPostCode = 'Required';
    if (!formData.senderAddress.country) newErrors.senderCountry = 'Required';

    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid';
    }

    if (!formData.clientAddress.street) newErrors.clientStreet = 'Required';
    if (!formData.clientAddress.city) newErrors.clientCity = 'Required';
    if (!formData.clientAddress.postCode) newErrors.clientPostCode = 'Required';
    if (!formData.clientAddress.country) newErrors.clientCountry = 'Required';

    if (!formData.invoiceDate) newErrors.invoiceDate = 'Required';
    if (!formData.projectDescription) newErrors.projectDescription = 'Required';

    if (formData.items.length === 0) newErrors.items = 'At least one item is required';

    formData.items.forEach((item, idx) => {
      if (!item.name) newErrors[`item_${idx}_name`] = 'Required';
      if (!item.qty || parseFloat(item.qty) <= 0) newErrors[`item_${idx}_qty`] = 'Required';
      if (!item.price || parseFloat(item.price) <= 0) newErrors[`item_${idx}_price`] = 'Required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (status) => {
    if (status !== 'Draft' && !validate()) return;

    let dueDate = '';
    if (formData.invoiceDate) {
      const date = new Date(formData.invoiceDate);
      date.setDate(date.getDate() + parseInt(formData.paymentTerms || 30));
      dueDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const invoice = {
      ...formData,
      dueDate,
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

  const updateNestedField = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-start w-full transition-opacity duration-300">
      <div className="w-full max-w-[714px] bg-white dark:bg-[#141625] h-full overflow-y-auto pt-[72px] md:pt-[80px] lg:pt-0 lg:pl-[103px] transition-transform duration-300 transform translate-x-0 rounded-r-2xl lg:rounded-r-3xl">
        <div className="p-6 md:p-14 pb-32">
          <button type="button" onClick={onClose} className="flex items-center gap-4 font-bold text-slate-900 dark:text-white hover:text-[#888EB0] transition-colors mb-6 md:hidden">
            <span className="text-primary font-bold text-lg leading-none">{"<"}</span>
            <span className="text-sm">Go back</span>
          </button>
          <h2 className="text-2xl font-bold dark:text-white mb-8">
            {invoiceToEdit ? (
              <>Edit <span className="text-[#888EB0]">#</span>{invoiceToEdit.id}</>
            ) : (
              'New Invoice'
            )}
          </h2>

          <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
            {/* Bill From */}
            <div className="flex flex-col gap-6">
              <h3 className="text-primary font-bold text-sm tracking-wide">Bill From</h3>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Street Address</label>
                <input
                  type="text"
                  value={formData.senderAddress.street}
                  onChange={(e) => updateNestedField('senderAddress', 'street', e.target.value)}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.senderStreet ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">City</label>
                  <input
                    type="text"
                    value={formData.senderAddress.city}
                    onChange={(e) => updateNestedField('senderAddress', 'city', e.target.value)}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.senderCity ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">Post Code</label>
                  <input
                    type="text"
                    value={formData.senderAddress.postCode}
                    onChange={(e) => updateNestedField('senderAddress', 'postCode', e.target.value)}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.senderPostCode ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">Country</label>
                  <input
                    type="text"
                    value={formData.senderAddress.country}
                    onChange={(e) => updateNestedField('senderAddress', 'country', e.target.value)}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.senderCountry ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="flex flex-col gap-6">
              <h3 className="text-primary font-bold text-sm tracking-wide">Bill To</h3>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Client's Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.name ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Client's Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.email ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Street Address</label>
                <input
                  type="text"
                  value={formData.clientAddress.street}
                  onChange={(e) => updateNestedField('clientAddress', 'street', e.target.value)}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.clientStreet ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">City</label>
                  <input
                    type="text"
                    value={formData.clientAddress.city}
                    onChange={(e) => updateNestedField('clientAddress', 'city', e.target.value)}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.clientCity ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">Post Code</label>
                  <input
                    type="text"
                    value={formData.clientAddress.postCode}
                    onChange={(e) => updateNestedField('clientAddress', 'postCode', e.target.value)}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.clientPostCode ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">Country</label>
                  <input
                    type="text"
                    value={formData.clientAddress.country}
                    onChange={(e) => updateNestedField('clientAddress', 'country', e.target.value)}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.clientCountry ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap md:flex-nowrap gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">Invoice Date</label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.invoiceDate ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant dark:text-gray-400 text-sm">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full bg-surface-container-low dark:bg-inverse-surface border border-transparent rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="1">Net 1 Day</option>
                    <option value="7">Net 7 Days</option>
                    <option value="14">Net 14 Days</option>
                    <option value="30">Net 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant dark:text-gray-400 text-sm">Project Description</label>
                <input
                  type="text"
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors.projectDescription ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
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
                      className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors[`item_${idx}_name`] ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white`}
                    />
                  </div>
                  <div className="flex flex-col w-16 gap-2">
                    <label className="text-on-surface-variant dark:text-gray-400 text-xs">Qty.</label>
                    <input
                      type="number"
                      min="0"
                      value={item.qty}
                      onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                      className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors[`item_${idx}_qty`] ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white px-2`}
                    />
                  </div>
                  <div className="flex flex-col w-24 gap-2">
                    <label className="text-on-surface-variant dark:text-gray-400 text-xs">Price</label>
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(idx, 'price', e.target.value)}
                      className={`w-full bg-surface-container-low dark:bg-inverse-surface border ${errors[`item_${idx}_price`] ? 'border-error' : 'border-transparent'} rounded-md p-4 font-bold dark:text-white px-2`}
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
          <div className="flex mt-12 bg-white dark:bg-[#141625] sticky bottom-0 py-6 border-t border-surface-variant/40 dark:border-inverse-surface/40 px-4 sm:px-6 w-full shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            {invoiceToEdit ? (
              <div className="flex justify-end gap-2 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-6 py-2"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="px-6 py-3"
                  onClick={() => handleSave(invoiceToEdit.status)}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-bold"
                  onClick={onClose}
                >
                  Discard
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="dark"
                    className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-bold"
                    onClick={() => handleSave('Draft')}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-bold"
                    onClick={() => handleSave('Pending')}
                  >
                    Save & Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
