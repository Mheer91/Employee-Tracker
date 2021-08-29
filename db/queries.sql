USE employee_db;

SELECT 
employee.first_name AS 'First Name',
employee.last_name AS 'Last Name',
role.title AS Title,
department.name AS Department,
role.salary AS Salary,
CONCAT(mgr.first_name," ",mgr.last_name) AS Manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id 
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee mgr ON mgr.id = employee.manager_id;


SELECT 
role.title AS Title,
role.salary AS Salary,
department.name AS Department
FROM role
LEFT JOIN department ON role.department_id = department.id;

