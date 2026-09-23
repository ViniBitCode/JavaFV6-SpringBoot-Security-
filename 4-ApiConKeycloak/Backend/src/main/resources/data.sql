INSERT INTO permission (id_permission, permission_name) VALUES
(1, 'READ'), (2, 'CREATE'), (3, 'UPDATE'), (4, 'DELETE')
    ON CONFLICT DO NOTHING;

INSERT INTO role (id_role, role_name) VALUES
(1, 'ADMIN'), (2, 'USER')
    ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (id_role, id_permission) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1)
    ON CONFLICT DO NOTHING;