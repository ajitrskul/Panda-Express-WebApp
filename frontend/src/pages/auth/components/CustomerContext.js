import React, { createContext, useState, useEffect } from 'react';

//Create the context
export const CustomerContext = createContext();

// Create the provider component
export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = sessionStorage.getItem('customer');

    return savedCustomer ? JSON.parse(savedCustomer) : 
    {isSignedIn: false,
      customer_id: null,
      email: '',
      first_name: '',
      last_name: '',
      beast_points: null};
  });

  useEffect(() => {
    sessionStorage.setItem('customer', JSON.stringify(customer))
  }, [customer]);

  // Function to sign in the customer
  const signIn = (customerData) => {
    setCustomer({ 
      isSignedIn: true,
      customer_id: customerData.customer_id,
      email: customerData.email,
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      beast_points: customerData.beast_points});
  };

  // Function to sign out the customer
  const signOut = () => {
    setCustomer({ 
      isSignedIn: false, 
      customer_id: null,
      email: '',
      first_name: '',
      last_name: '',
      beast_points: null});
  };

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, signIn, signOut }}>
      {children}
    </CustomerContext.Provider>
  );
};
