INSERT INTO
  role (title, salary, department_id)
VALUES
  ("CK Manager", 50000, 1),
  ("FT Deli Clerk", 30000, 1),
  ("PT Deli Clerk", 15000, 1),
  ("Market Manager", 50000, 2),
  ("Meat Cutter", 45000, 2),
  ("FT Wrapper", 35000, 2),
  ("PT Wrapper", 15000, 2),
  ("Bakery Manager", 50000, 3),
  ("Crew Chief", 35000, 3),
  ("Baker", 20000, 3),
  ("Produce Manager", 50000, 4),
  ("FT Produce Clerk", 30000, 4),
  ("PT Produce Clerk", 15000, 4);


INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Michael", "Heer", 1, null),
  ("Matthew", "Nelson", 2, 1),
  ("Tommy", "Cooper", 4, null),
  ("Ewansiha", "Perkins", 5, 3),
  ("Maria", "Ramira", 8, null),
  ("Hussein", "Hozza", 9, 5),
  ("Mike", "Romanenko", 11, null),
  ("John", "Robinson", 13, 7);


INSERT INTO
  department (id, name)
VALUES
  (1, "Chef's Kitchen"),
  (2, "Meat Market"),
  (3, "Bake Shop"),
  (4, "Produce");
