INSERT INTO users (username, password) VALUES 
('vicente.placet@gmail.com', '$2b$10$c5BqqW5iWVAcFvkv2sarKOW5GuZnyTkt2Yec4/ToDaLk4ECoTgzmm'),
('Jorge Barria', '$2b$10$3aHMYncPOXc5fkm/GCsoVuJtqWtmjDgklvhtTiCq6tMNDrghP2k6y'),
('Matias Espinoza', '$2b$10$tanZYBzujj7Z7tRuF/f8yOtoumpJbGQWVe0rk4xzJyg2PbQZCkVpy')
ON CONFLICT (username) DO NOTHING;

-- Obtener los IDs insertados para roles
INSERT INTO user_roles (user_id, roles)
SELECT id, 'ADMIN' FROM users WHERE username = 'vicente.placet@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, roles)
SELECT id, 'MECANICO' FROM users WHERE username = 'Jorge Barria'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, roles)
SELECT id, 'USER' FROM users WHERE username = 'Matias Espinoza'
ON CONFLICT DO NOTHING;
