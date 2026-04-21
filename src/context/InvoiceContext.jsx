import React, { createContext, useContext, useState, useEffect } from 'react';


const InvoiceContext = createContext();

const initialInvoices = [
  { id: 'RT3080', dueDate: '19 Aug 2021', name: 'Jensen Huang', email: 'jensen@nvidia.com', amount: 1800.90, status: 'Paid', items: [] },
  { id: 'XM9141', dueDate: '20 Sep 2021', name: 'Alex Rivera', email: 'alex@example.com', amount: 556.00, status: 'Pending', items: [] },
  { id: 'FV2353', dueDate: '12 Oct 2021', name: 'Anita Wainwright', email: 'anita@example.com', amount: 3102.04, status: 'Draft', items: [] }
];

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const addInvoice = (invoice) => {
    const total = invoice.items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.price)), 0);
    setInvoices(prev => [{
      ...invoice,
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      amount: total,
    }, ...prev]);
  };

  const updateInvoice = (id, updatedData) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const total = updatedData.items ? updatedData.items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.price)), 0) : inv.amount;
        return { ...inv, ...updatedData, amount: total };
      }
      return inv;
    }));
  };

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const markAsPaid = (id) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      darkMode,
      setDarkMode,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoices = () => useContext(InvoiceContext);
