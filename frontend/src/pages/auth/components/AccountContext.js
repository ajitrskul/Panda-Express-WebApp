import React, { createContext, useState, useEffect } from 'react';

//Create the context
export const AccountContext = createContext();

// Create the provider component
export const AccountProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = sessionStorage.getItem('customer');

    return savedCustomer ? JSON.parse(savedCustomer) : 
    {isSignedIn: false,
      customer_id: null,
      email: null,
      first_name: null,
      last_name: null,
      beast_points: null};
  });

  const [employee, setEmployee] = useState(() => {
    const savedEmployee = sessionStorage.getItem('employee');

    return savedEmployee ? JSON.parse(savedEmployee) : 
    {isSignedIn: false,
      employee_id: null,
      email: null,
      first_name: null,
      last_name: null,
      role: null};
  });

  useEffect(() => {
    sessionStorage.setItem('customer', JSON.stringify(customer))
  }, [customer]);

  useEffect(() => {
    sessionStorage.setItem('employee', JSON.stringify(employee))
  }, [employee]);

  //signs in the customer
  const customerSignIn = (customerData) => {
    setCustomer({ 
      isSignedIn: true,
      customer_id: customerData.customer_id,
      email: customerData.email,
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      beast_points: customerData.beast_points});
  };

  //signs out the customer
  const customerSignOut = () => {
    setCustomer({ 
      isSignedIn: false, 
      customer_id: null,
      email: '',
      first_name: '',
      last_name: '',
      beast_points: null});
  };

  //signs in employee
  const employeeSignIn = (employeeData) => {
    setEmployee({
      isSignedIn: true,
      employee_id: employeeData.employee_id,
      email: employeeData.email,
      first_name: employeeData.first_name,
      last_name: employeeData.last_name,
      role: employeeData.role});
  };

  //signs out the employee
  const employeeSignOut = () => {
    setEmployee({
      isSignedIn: false,
      employee_id: null,
      email: null,
      first_name: null,
      last_name: null,
      role: null});
  };

  return (
    <AccountContext.Provider value={{ customer, setCustomer, customerSignIn, customerSignOut, employeeSignIn, employeeSignOut }}>
      {children}
    </AccountContext.Provider>
  );
};
