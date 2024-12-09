
import { SidebarManager } from './components/SidebarManager';
import { useState, useEffect, useRef } from 'react';
import '../../styles/manager/employee.css';
import api from '../../services/api'; 

function Employees() {
  const employeeData = useRef([]);

  const [search, setSearch] = useState("");

  const [employeeDisplay, setEmployeeDisplay] = useState([
    {
      id: "N/A",
      name: "N/A",
      email: "N/A",
      role: "N/A"
    }
  ]);

  const [popup, setPopUp] = useState({
    editEmployee: false,
    addEmployee: false
  });

  const [newEmployee, setNewEmployee] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: ""
  });

  const [newEmployeeError, setNewEmployeeError] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "",
    valid_email: {
      email_class: "employee-add-input",
      isHighlighted: false
    },
    valid_first_name: {
      first_name_class: "employee-add-input",
      isHighlighted: false
    },
    valid_last_name: {
      last_name_class: "employee-add-input",
      isHighlighted: false
    },
    valid_password: {
      password_class: "employee-add-input",
      isHighlighted: false
    },
    valid_role: {
      role_class: "employee-add-input",
      isHighlighted: false
    }
  });

  const [submitClass, setSubmitClass] = useState({
    button_class: "submit-employee-button",
    loading_class: "spinner-border employee-spinning-loader"
  })

  const fetchEmployees = async () => {
    try{
      const response = await api.get('/manager/employee/get');
      if (response.data) {
        employeeData.current = response.data;
        setEmployeeDisplay(employeeData.current);
      }
    }
    catch {
      setEmployeeDisplay([
        {
          id: "Error",
          name: "Error",
          email: "Error",
          role: "Error"
        }
      ])
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [])

  const fireEmployee = async (id) => {
    try {
      const response = await api.post('/manager/employee/fire', id);
      if (response.data) {
        fetchEmployees();
      }
      else {
        //add same error message
        setEmployeeDisplay([
          {
            id: "Failed to fetch data",
            name: "Failed to fetch data",
            email: "Failed to fetch data",
            role: "Failed to fetch data"
          }
        ])
      }
    }
    catch {
      //add error message
      setEmployeeDisplay([
        {
          id: "Failed to fetch data",
          name: "Failed to fetch data",
          email: "Failed to fetch data",
          role: "Failed to fetch data"
        }
      ])
    }
  }

  const searchEmployee = (event) => {
    event.preventDefault();
    if (search === "") {
      if (employeeData.current === employeeDisplay) {
        return;
      }
      else {
        setEmployeeDisplay(employeeData.current);
      }
    }
    else {
      const employees = employeeData.current.filter(employee => employee.name.toLowerCase().includes(search.toLowerCase()));
      setEmployeeDisplay(employees);
    }
  }

  const handleAddEmployeeInput = (name, value) => {
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  }

  const addEmployee = async () => {
    try {
      const response = await api.post("/manager/employee/email", newEmployee.email);
      if (!response.data) { //email already exists in database
        setNewEmployeeError({
          ...newEmployeeError,
          email: "Email already in use",
          valid_email: {
            email_class: "employee-add-input invalid-input",
            isHighlighted: true
          }
        });
        //email exists
      }
      else { //email does not exist in database (valid email)
          if (newEmployee.password) { //need to hash password
            const hashData = await fetch(`${process.env.REACT_APP_HASH_API_KEY}hash?plain=${newEmployee.password}`);
            const hashPassword = await hashData.json();
            if (!hashPassword) {
              return;
            }
            else {
              await api.post("/manager/employee/add", {...newEmployee, password: hashPassword});
              fetchEmployees();
              closePopUp();
              return; //adding to database successful
            }
          }
          else {
            await api.post("/manager/employee/add", newEmployee);
            fetchEmployees();
            closePopUp();
            return; //adding to database successful
          }
        }
    } catch {
      //some error message
    }
  }

  const validateEmployeeInput = async (event) => {
    setSubmitClass({
      ...submitClass,
      button_class: "submit-employee-button",
    loading_class: "spinner-border employee-spinning-loader employee-loader-opacity"
    });

    event.preventDefault();
    let isInvalid = false;
    let currentError = {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "",
      valid_email: {
        email_class: "employee-add-input",
        isHighlighted: false
      },
      valid_first_name: {
        first_name_class: "employee-add-input",
        isHighlighted: false
      },
      valid_last_name: {
        last_name_class: "employee-add-input",
        isHighlighted: false
      },
      valid_password: {
        password_class: "employee-add-input",
        isHighlighted: false
      },
      valid_role: {
        role_class: "employee-add-input",
        isHighlighted: false
      }
    };

    if (!newEmployee.email) {
      currentError.email = "Email is required";
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }
    else if (newEmployee.email.length > 50){
      currentError.email= "Email length cannot exceed 50 characters"
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }
    else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email))){
      currentError.email = "Please enter a valid email"
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }

    if (!newEmployee.first_name) {
      currentError.first_name = "First name is required";
      if (!currentError.valid_first_name.isHighlighted) {
        currentError.valid_first_name.first_name_class += " invalid-input";
      }
      currentError.valid_first_name.isHighlighted = true;
      isInvalid = true;
    }
    
    if (!newEmployee.last_name) {
      currentError.last_name = "Last name is required";
      if (!currentError.valid_last_name.isHighlighted) {
        currentError.valid_last_name.last_name_class += " invalid-input";
      }
      currentError.valid_last_name.isHighlighted = true;
      isInvalid = true;
    }

    if (newEmployee.first_name && newEmployee.last_name) {
      if (newEmployee.first_name.length > 50) {
        currentError.first_name = "Name lengths may not exceed 50 characters";
        if (!currentError.valid_first_name.isHighlighted) {
          currentError.valid_first_name.first_name_class += " invalid-input";
        }
        currentError.valid_first_name.isHighlighted = true;
        isInvalid = true;
      }
      if (newEmployee.last_name.length > 50) {
        currentError.last_name = "Name lengths may not exceed 50 characters";
        if (!currentError.valid_last_name.isHighlighted) {
          currentError.valid_last_name.last_name_class += " invalid-input";
        }
        currentError.valid_last_name.isHighlighted = true;
        isInvalid = true;
      }
    }

    if (newEmployee.password && newEmployee.password.length > 50) {
      currentError.password = "Password may not exceed 50 characters"
      if (!currentError.valid_password.isHighlighted) {
        currentError.valid_password.password_class += " invalid-input";
      }
      currentError.valid_password.isHighlighted = true;
      isInvalid = true;
    }

    if (!newEmployee.role) {
      currentError.role = "Role is required";
      if (!currentError.role.isHighlighted) {
        currentError.valid_role.role_class += " invalid-input";
      }
      currentError.valid_role.isHighlighted = true
      isInvalid = true;
    }

    //should only be not equal when there is an error present
    if (currentError !== newEmployeeError){ 
      setNewEmployeeError(currentError);
    }

    if (!isInvalid) {
      //send request to server
      await addEmployee();
    }

    setSubmitClass({
      button_class: "submit-employee-button",
      loading_class: "spinner-border employee-spinning-loader"
    })
  }

  const closePopUp = () => {
    setPopUp({
      editEmployee: false,
      addEmployee: false
    });

    setNewEmployee({
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: ""
    });

    setNewEmployeeError({
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "",
      valid_email: {
        email_class: "employee-add-input",
        isHighlighted: false
      },
      valid_first_name: {
        first_name_class: "employee-add-input",
        isHighlighted: false
      },
      valid_last_name: {
        last_name_class: "employee-add-input",
        isHighlighted: false
      },
      valid_password: {
        password_class: "employee-add-input",
        isHighlighted: false
      },
      valid_role: {
        role_class: "employee-add-input",
        isHighlighted: false
      }
    });
  }

  const openAddEmployee = () => {
    setPopUp({
      addEmployee: true,
      editEmployee: false
    });
  }

  const openEditEmployee = (id) => {
    //get employee you're querying for
    const currentEmployee = employeeData.current.find(employee => id === employee.id);
    if (currentEmployee) {
      setNewEmployee(currentEmployee);
    }
    setPopUp({
      addEmployee: false,
      editEmployee: true
    });
  }

  const editEmployee = async () => {
    try {
      const response = await api.post("/manager/employee/addemail", newEmployee.email);
      if (!response.data) { //email used by other employee in database
        setNewEmployeeError({
          ...newEmployeeError,
          email: "Email already in use",
          valid_email: {
            email_class: "employee-add-input invalid-input",
            isHighlighted: true
          }
        });
        //email exists
      }
      else { //email not used by other employee in database (valid email)
        await api.post("/manager/employee/edit", newEmployee);
        fetchEmployees();
        closePopUp();
        return; //adding to database successful
      } //end else
    } //end try
    catch {
      //some error message
    }
  }

  const validateEmployeeChanges = async (event) => {
    event.preventDefault();

    let isInvalid = false;
    let currentError = {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "",
      valid_email: {
        email_class: "employee-add-input",
        isHighlighted: false
      },
      valid_first_name: {
        first_name_class: "employee-add-input",
        isHighlighted: false
      },
      valid_last_name: {
        last_name_class: "employee-add-input",
        isHighlighted: false
      },
      valid_password: {
        password_class: "employee-add-input",
        isHighlighted: false
      },
      valid_role: {
        role_class: "employee-add-input",
        isHighlighted: false
      }
    };

    if (!newEmployee.email) {
      currentError.email = "Email is required";
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }
    else if (newEmployee.email.length > 50){
      currentError.email= "Email length cannot exceed 50 characters"
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }
    else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email))){
      currentError.email = "Please enter a valid email"
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }

    if (!newEmployee.first_name) {
      currentError.first_name = "First name is required";
      if (!currentError.valid_first_name.isHighlighted) {
        currentError.valid_first_name.first_name_class += " invalid-input";
      }
      currentError.valid_first_name.isHighlighted = true;
      isInvalid = true;
    }
    
    if (!newEmployee.last_name) {
      currentError.last_name = "Last name is required";
      if (!currentError.valid_last_name.isHighlighted) {
        currentError.valid_last_name.last_name_class += " invalid-input";
      }
      currentError.valid_last_name.isHighlighted = true;
      isInvalid = true;
    }

    if (newEmployee.first_name && newEmployee.last_name) {
      if (newEmployee.first_name.length > 50) {
        currentError.first_name = "Name lengths may not exceed 50 characters";
        if (!currentError.valid_first_name.isHighlighted) {
          currentError.valid_first_name.first_name_class += " invalid-input";
        }
        currentError.valid_first_name.isHighlighted = true;
        isInvalid = true;
      }
      if (newEmployee.last_name.length > 50) {
        currentError.last_name = "Name lengths may not exceed 50 characters";
        if (!currentError.valid_last_name.isHighlighted) {
          currentError.valid_last_name.last_name_class += " invalid-input";
        }
        currentError.valid_last_name.isHighlighted = true;
        isInvalid = true;
      }
    }

    if (newEmployee.password && newEmployee.password.length > 50) {
      currentError.password = "Password may not exceed 50 characters"
      if (!currentError.valid_password.isHighlighted) {
        currentError.valid_password.password_class += " invalid-input";
      }
      currentError.valid_password.isHighlighted = true;
      isInvalid = true;
    }

    if (!newEmployee.role) {
      currentError.role = "Role is required";
      if (!currentError.role.isHighlighted) {
        currentError.valid_role.role_class += " invalid-input";
      }
      currentError.valid_role.isHighlighted = true
      isInvalid = true;
    }

    //should only be not equal when there is an error present
    if (currentError !== newEmployeeError){ 
      setNewEmployeeError(currentError);
    }

    if (!isInvalid) {
      //send request to server
        await editEmployee();
    }
    setSubmitClass({
      button_class: "submit-employee-button",
      loading_class: "spinner-border employee-spinning-loader"
    })
  }

  return (
    <div className="employee-bg">
      <SidebarManager></SidebarManager>
      <div className="fluid-container employee-container">
        {popup.editEmployee &&
          <>
            <div className="employee-popup-bg"></div>
            <div className="employee-edit-popup fluid-container">
              <div className="row text-center" style={{marginTop:"20px"}}>
                <h2>Edit Employee</h2>
              </div>
              <button className="employee-close-button" onClick={closePopUp}>
                <i class="bi bi-x-lg"></i>
              </button>
              <form onSubmit={validateEmployeeChanges}>
                <div className="row text-start justify-content-center text-center" style={{marginBottom: "30px"}}>
                  <label className="employee-add-label text-center" style={{marginLeft:"10px"}}>Email:</label>
                  <input name="email" value={newEmployee.email} className={newEmployeeError.valid_email.email_class} placeholder="email" onChange={({ target }) => {
                    handleAddEmployeeInput(target.name, target.value);
                  }}></input>
                  {newEmployeeError.valid_email.isHighlighted && <p className="add-employee-error text-center">{newEmployeeError.email}</p>}            
                  <label className="employee-add-label text-center" style={{marginLeft:"10px"}}>First Name:</label>
                  <input name="first_name" value={newEmployee.first_name} className={newEmployeeError.valid_first_name.first_name_class} placeholder="first name" onChange={({ target }) => {
                    handleAddEmployeeInput(target.name, target.value);
                  }}></input>
                  {newEmployeeError.valid_first_name.isHighlighted && <p className="add-employee-error text-center">{newEmployeeError.first_name}</p>}
                  <label style={{marginLeft:"10px"}}>Last Name:</label>
                  <input name="last_name" value={newEmployee.last_name} className={newEmployeeError.valid_last_name.last_name_class} placeholder="last name" onChange={({ target }) => {
                    handleAddEmployeeInput(target.name, target.value);
                  }}></input>
                  {newEmployeeError.valid_last_name.isHighlighted && <p className="add-employee-error text-center">{newEmployeeError.last_name}</p>}
                  <label style={{marginLeft:"10px"}}>Role:</label>
                  <select name="role" value={newEmployee.role} className={newEmployeeError.valid_role.role_class} onChange={({ target }) => {
                    handleAddEmployeeInput(target.name, target.value);
                  }}>
                    <option value="">--Select a role--</option>
                    <option value="manager">manager</option>
                    <option value="cashier">cashier</option>
                    <option value="fired">fired</option>
                  </select>
                  {newEmployeeError.valid_role.isHighlighted && <p className="add-employee-error">{newEmployeeError.role}</p>}
                </div>
                <div className="row justify-content-center">
                  <button type="submit" className={submitClass.button_class}>
                    Submit
                    <div className={submitClass.loading_class} role="status"></div>
                  </button>
                </div>
              </form>
            </div>
          </>
        }
        {popup.addEmployee &&
          <>
            <div className="employee-popup-bg"></div>
            <div className="employee-add-popup fluid-container">
              <div className="row text-center" style={{marginTop:"20px"}}>
                <h2>Add Employee</h2>
              </div>
              <button className="employee-close-button" onClick={closePopUp}>
                <i class="bi bi-x-lg"></i>
              </button>
              <form onSubmit={validateEmployeeInput} className="employee-form">
                <div className="row justify-content-center align-items-center" style={{ marginBottom: "30px" }}>
                  <label className="employee-add-label text-center">Email:</label>
                  <input
                    name="email"
                    value={newEmployee.email}
                    className={`text-center ${newEmployeeError.valid_email.email_class}`}
                    placeholder="email"
                    onChange={({ target }) => {
                      handleAddEmployeeInput(target.name, target.value);
                    }}
                  />
                  {newEmployeeError.valid_email.isHighlighted && (
                    <p className="add-employee-error">{newEmployeeError.email}</p>
                  )}

                  <label className="employee-add-label text-center">First Name:</label>
                  <input
                    name="first_name"
                    value={newEmployee.first_name}
                    className={`text-center ${newEmployeeError.valid_first_name.first_name_class}`}
                    placeholder="first name"
                    onChange={({ target }) => {
                      handleAddEmployeeInput(target.name, target.value);
                    }}
                  />
                  {newEmployeeError.valid_first_name.isHighlighted && (
                    <p className="add-employee-error">{newEmployeeError.first_name}</p>
                  )}

                  <label className="employee-add-label text-center">Last Name:</label>
                  <input
                    name="last_name"
                    value={newEmployee.last_name}
                    className={`text-center ${newEmployeeError.valid_last_name.last_name_class}`}
                    placeholder="last name"
                    onChange={({ target }) => {
                      handleAddEmployeeInput(target.name, target.value);
                    }}
                  />
                  {newEmployeeError.valid_last_name.isHighlighted && (
                    <p className="add-employee-error">{newEmployeeError.last_name}</p>
                  )}

                  <label className="employee-add-label text-center">Role:</label>
                  <select
                    name="role"
                    value={newEmployee.role}
                    className={`text-center ${newEmployeeError.valid_role.role_class}`}
                    onChange={({ target }) => {
                      handleAddEmployeeInput(target.name, target.value);
                    }}
                  >
                    <option value="">--Select a role--</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                    <option value="fired">Fired</option>
                  </select>
                  {newEmployeeError.valid_role.isHighlighted && (
                    <p className="add-employee-error">{newEmployeeError.role}</p>
                  )}
                </div>
                <div className="row justify-content-center">
                  <button type="submit" className={`submit-btn ${submitClass.button_class}`}>
                    Submit
                    <div className={submitClass.loading_class} role="status"></div>
                  </button>
                </div>
              </form>

            </div>
          </>
        }
        <div className="row justify-content-start">
          <h1 className="employee-title">
            Manage Employees
          </h1>
          <hr className="col-12 employee-divider"></hr>
        </div>
        <div className="row justify-content-start employee-card" style={{marginBottom:"25px", minWidth:"1000px"}}>
          <div className="col-11" style={{minWidth:"950px"}}>
            <form onSubmit={searchEmployee}>
              <label htmlFor="employee-search" style={{fontSize:"25px", display:"inline-block", marginRight:"15px"}}>Search Employees:</label>
              <input 
                type="text" 
                id="employee-search" 
                placeholder="e.g., John Smith" 
                className="employee-search"
                value={search} 
                onChange={(e) => setSearch(e.target.value)}>
              </input>
              <button className="employee-search-button" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
          <div className="col-1 text-end">
            <button className="employee-refresh" onClick={fetchEmployees}>
              <i class="bi bi-arrow-clockwise employee-refresh-icon"></i>
            </button>
          </div>
        </div>
        <div className="row justify-content-center employee-card" styles={{minWidth:"900px"}}>
          <div className="col-12 fluid-container">
            <div className="row justify-content-start text-center" style={{minWidth: "900px"}}>
              <div className="col-1 employee-table-bg">
                ID
              </div>
              <div className="col-3 employee-table-bg">
                Employee Name
              </div>
              <div className="col-3 employee-table-bg">
                Employee Email
              </div>
              <div className="col-3 employee-table-bg">
                Employee Role
              </div>
              <div className="col pt-2 text-end">
                <button
                  id="add-employee"
                  className="add-employee-icon-button"
                  onClick={openAddEmployee}
                  aria-label="Add Employee"
                >
                  <i 
                    className="bi bi-plus-lg"
                  ></i>
                </button>
              </div>
            </div>
            <hr className="report-divider"></hr>

            
            {employeeDisplay.map(employee => (
              <div className="row employee-row align-items-center text-center">
                <div className="col-1 employee-row-bg">
                  {employee.id}
                </div>
                <div className="col-3 employee-row-bg">
                  {employee.name}
                </div>
                <div className="col-3 employee-row-bg">
                  {employee.email}
                </div>
                <div className="col-3 employee-row-bg">
                  {employee.role}
                </div>
                <div className="col text-center employee-button-row">
                  <button className="edit-employee-button mx-2" onClick={() => {openEditEmployee(employee.id)}}>
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button className="fire-button" onClick={() => {fireEmployee(employee.id)}}>
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;
