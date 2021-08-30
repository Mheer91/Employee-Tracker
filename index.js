const inquirer = require('inquirer');
const mysql = require('mysql2');

//Creates connection to the mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Ranger9!',
        database: 'employee_db',
        multipleStatements: 'true'
    },
    console.log(`Connected to the employee_db database.`)
);

const introPrompt = [
    {
        type: 'list',
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee's role"],
        name: "introMenuChoice"
    }
];


function initProgram() {
    inquirer
        .prompt(introPrompt)
        .then((response) => {
            if (response.introMenuChoice === "View all departments") {
                db.query(`
                    SELECT
                    department.id AS ID,
                    department.name AS 'Department Name'
                    FROM department`,
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        console.table(res)
                        initProgram();
                    }
                )
            }
            else if (response.introMenuChoice === "View all roles") {
                db.query(`
                    SELECT 
                    role.id AS ID, 
                    role.title AS 'Role Title', 
                    role.salary AS Salary, 
                    department.name AS Department 
                    FROM role 
                    LEFT JOIN department ON role.department_id = department.id`,
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        console.table(res)
                        initProgram();
                    }
                )
            }
            else if (response.introMenuChoice === "View all employees") {
                db.query(`
                    SELECT
                    employee.id AS "ID", 
                    employee.first_name AS 'First Name',
                    employee.last_name AS 'Last Name',
                    role.title AS Title,
                    department.name AS Department,
                    role.salary AS Salary,
                    CONCAT(mgr.first_name," ",mgr.last_name) AS Manager
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee mgr ON mgr.id = employee.manager_id`,
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        console.table(res)
                        initProgram();
                    }
                )
            }
            else if (response.introMenuChoice === "Add a department") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Please enter the name of the new department:",
                            name: "addDepartment",
                            validate: string => string.length > 0 ? true : "Please enter a department name!"
                        }
                    ])
                    .then((department) => {
                        db.query(`
                            INSERT INTO 
                            department (name)
                            VALUES (?)`, department.addDepartment,
                            (err, res) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log("Department added!")
                                initProgram();
                            })
                    })
            }
            else if (response.introMenuChoice === "Add an employee") {
                db.query(`
                    SELECT
                    *
                    FROM employee
                    WHERE manager_id IS NULL;
                    SELECT *
                    FROM role`, (err, res) => {
                    if (err) {
                        console.log(err)
                    }

                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Enter employee's first name:",
                                name: "firstName",
                                validate: string => string.length > 0 ? true : "Please enter a first name!"
                            },
                            {
                                type: "input",
                                message: "Enter employee's last name:",
                                name: "lastName",
                                validate: string => string.length > 0 ? true : "Please enter a last name!"
                            },
                            {
                                type: "list",
                                message: "Who will be managing this employee?",
                                choices: function () {
                                    let managers = res[0].map(managerName => managerName.first_name + " " + managerName.last_name);
                                    return managers;
                                },
                                name: "empManager"
                            },
                            {
                                type: "list",
                                message: "What role will this employee be filling?",
                                choices: function () {
                                    let roles = res[1].map(role => role.title);
                                    return roles;
                                },
                                name: "empRole"
                            }
                        ]).then((addEmployee) => {
                            let managerChoice = addEmployee.empManager.split(" ");

                            db.query(`
                                INSERT INTO
                                employee (first_name, last_name, role_id, manager_id)
                                VALUES
                                (?, ?, 
                                (SELECT id FROM role WHERE title = ?), 
                                (SELECT id FROM (SELECT id FROM employee WHERE first_name = ? AND last_name = ?) AS mgrId))`,
                                [addEmployee.firstName, addEmployee.lastName, addEmployee.empRole, managerChoice[0], managerChoice[1]],
                                (err, res) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log("Employee added!")
                                    initProgram();
                                })
                        })
                })
            }
            else if (response.introMenuChoice === "Add a role") {
                db.query(`SELECT * FROM department`, (err, res) => {
                    if (err) {
                        console.log(err)
                    }

                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Enter new role name:",
                                name: "name",
                                validate: string => string.length > 0 ? true : "Please enter a role name!"
                            },
                            {
                                type: "list",
                                message: "What department does this role belong to?",
                                choices: function () {
                                    let departments = res.map(dep => dep.name);
                                    return departments;
                                },
                                name: "dept"
                            },
                            {
                                type: "input",
                                message: "How much does this role make anually?",
                                name: "salary",
                                validate: addSalary => /^\d+$/.test(addSalary) ? true : "Ender a valid number!"
                            }
                        ])
                        .then((role) => {
                            db.query(`
                                INSERT INTO 
                                role (title, salary, department_id)
                                VALUES (?, ?, (SELECT id FROM department WHERE name = ?))`, [role.name, role.salary, role.dept],
                                (err, res) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log("Role added!")
                                    initProgram();
                                })
                        })
                })
            }
            else if (response.introMenuChoice === "Update an employee's role") {
                db.query(`
                    SELECT *
                    FROM employee;
                    SELECT *
                    FROM role`, (err, res) => {
                    if (err) {
                        console.log(err)
                    }

                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Which employee's role would you like to change?",
                                choices: function () {
                                    let employees = res[0].map(emp => emp.first_name + " " + emp.last_name);
                                    return employees;
                                },
                                name: "editEmployee"
                            },
                            {
                                type: "list",
                                message: "What would you like their new role to be?",
                                choices: function () {
                                    let roles = res[1].map(role => role.title);
                                    return roles;
                                },
                                name: "newRole"
                            }
                        ])
                        .then((changeRole) => {
                            let employeeName = changeRole.editEmployee.split(' ')
                            db.query(`
                                UPDATE employee
                                SET role_id = (SELECT id FROM role WHERE title = ?)
                                WHERE id = (SELECT id FROM (SELECT id FROM employee WHERE first_name = ? AND last_name = ?) AS newRole)`,
                                [changeRole.newRole, employeeName[0], employeeName[1]], (err, res) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log("Role successfully changed!")
                                    initProgram();
                                })
                        })
                })
            }
        })
}


initProgram();
