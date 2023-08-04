import React from 'react';
import { PageContainer, EmployeeList, EmployeeItem, EmployeeForm, Buttons, TabButtons, ShelterForm, Input, Button } from './HomeStyle';
import { employees } from "../employeesData";
import { useState, useEffect, useRef } from "react";

const Home = () => {
    const employeesCount = useRef(employees.length);
    const [listOfEmployees, setListOfEmployees] = useState(employees);
    const [newEmployee, setNewEmployee] = useState({
        id: employeesCount.current + 1,
        name: "",
        surname: "",
        gender: ""
    });
    const [valid, setValid] = useState(false);
    const [activeTab, setActiveTab] = useState("list-of-employees");
    const [numberOfEmployees, setNumberOfEmployees] = useState({
        men: 2,
        women: 1
    })
    const [requirements, setRequirements] = useState({
        meters: 0,
        hours: 0
    })
    const [color, setColor] = useState("gray")

    useEffect(() => {
        if (isNaN(requirements.meters) || isNaN(requirements.hours)) {
          setColor("red");
          return;
        }
        let actualWorkLoad = numberOfEmployees.men + (numberOfEmployees.women * 0.5);
        let wantedWorkLoad = requirements.meters / requirements.hours
    
        if (wantedWorkLoad > actualWorkLoad) {
            setColor("red");
            console.log( requirements.meters, requirements.hours, actualWorkLoad, wantedWorkLoad)
        } else {
          setColor("green");
        }
    
        if (requirements.hours === 0 || requirements.meters === 0) {
          setColor("red");
        }
      }, [requirements, numberOfEmployees]);
    

    const handleRequirements = (e) => {
        const updaterequirements = { ...requirements, [e.target.name]: parseInt(e.target.value) };
        setRequirements(updaterequirements);

    }

    const handleChange = (e) => {
        const updateEmployee = { ...newEmployee, [e.target.name]: e.target.value };
        setNewEmployee(updateEmployee);
        validateData(updateEmployee);
    }
    
    const validateData = (employee) => {
        if (employee.name.trim().length === 0 || employee.surname.trim().length === 0 || !employee.gender) {
            return setValid(false);
        }
        return setValid(true);
    }
    const handleAdd = () => {
            const pushEmployee = true;
        if (pushEmployee) {
            setListOfEmployees((listOfEmployees) => {
                return [...listOfEmployees, newEmployee];
            });
            employeesCount.current++;
            const updateEmployee = {
                id: employeesCount.current + 1,
                name: "",
                surname: "",
                gender: ""
            }
            setNewEmployee(updateEmployee);
            let updateNumberOfEmployees = {
                men: 0,
                women: 0
            };
            if(newEmployee.gender === "MEN"){
                updateNumberOfEmployees = {
                    men: numberOfEmployees.men + 1,
                    women: numberOfEmployees.women
                }
            } else if(newEmployee.gender === "WOMEN") {
                updateNumberOfEmployees = {
                    women: numberOfEmployees.women + 1,
                    men: numberOfEmployees.men
                }
            }

            setNumberOfEmployees(updateNumberOfEmployees);
            setValid(false);
        }
    };
    const handleDel = (idtodelete) => {

        let updateNumberOfEmployees = numberOfEmployees;
        listOfEmployees.map((employee) => {
            if (employee.id === idtodelete && employee.gender === "MEN") {
                updateNumberOfEmployees = {
                    men: numberOfEmployees.men - 1,
                    women: numberOfEmployees.women
                }
            } else if (employee.id === idtodelete && employee.gender === "WOMEN"){
                updateNumberOfEmployees = {
                    women: numberOfEmployees.women - 1,
                    men: numberOfEmployees.men
                }
            }
            setNumberOfEmployees(updateNumberOfEmployees);
            setListOfEmployees(listOfEmployees.filter((employee) => employee.id !== idtodelete));
        })
    };

    return(
        <PageContainer>
            <Buttons>
                <TabButtons name="list-of-employees"
                    data-active={activeTab}
                    onClick={() => {setActiveTab('list-of-employees')}}
                >List of employees</TabButtons>
                <TabButtons name="shelter-storage"
                    data-active={activeTab}
                    onClick={() => {setActiveTab('shelter-storage')}}
                >Tasks</TabButtons>
            </Buttons>
            {(activeTab === "list-of-employees") &&
                <>
                    <EmployeeList name="dogList">
                        {listOfEmployees.map((employee) => {
                            return <EmployeeItem key={employee.id}>{employee.name} {employee.surname} / {employee.gender}
                                <Button style={{
                                    color: "#64766a",
                                    fontWeight: "bolder",
                                    border: 2 + "px solid #64766a",
                                    borderRadius: 50 + "%",
                                    height: 25 + "px",
                                    width: 25 + "px"
                                }}
                                    onClick={() => { handleDel(employee.id) }}>
                                    X
                                </Button>
                            </EmployeeItem>
                        })}
                    </EmployeeList>
                    <EmployeeForm>
                        <Input
                            type="text"
                            placeholder='jmeno'
                            name="name"
                            value={newEmployee.name}
                            onChange={handleChange}
                        ></Input>
                        <Input
                            type="text"
                            placeholder='prijmeni'
                            name="surname"
                            value={newEmployee.surname}
                            onChange={handleChange}
                        ></Input>
                        <Input
                            type="radio"
                            name="gender"
                            value="MEN"
                        id="men"

                        onChange={handleChange}
                    ></Input>
                    <label for ="men">MEN</label>
                        <Input
                            type="radio"
                            name="gender"
                            value="WOMEN"
                        id="women"
                        onChange={handleChange}
                    ></Input>
                    <label for = "women">WOMEN</label>
                        <Button disabled={!valid} onClick={handleAdd}>Přidat</Button>
                    </EmployeeForm>
                </>}
            {(activeTab === "shelter-storage") && (
                <>
                <h3>Planning excavation works</h3>
                <p>Men: {numberOfEmployees.men} </p>
                    <p>Women: {numberOfEmployees.women}</p>
                <ShelterForm>
                    <Input
                        type="number"
                        min="1"
                        placeholder='Enter meters'
                        name="meters"
                        onChange={handleRequirements}
                    />
                    <Input
                        type="number"
                        placeholder='enter the hours'
                        name="hours"
                        onChange={handleRequirements}
                    />
                    <Button id="planning" style={{backgroundColor: color}}>
                        Work planning   
                    </Button>
                </ShelterForm>
                </>
            )}
        </PageContainer>
    );
}

export default Home;
