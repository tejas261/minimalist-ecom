-- Replace 'your-email@example.com' with the actual email of the user you want to make admin
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com'; 