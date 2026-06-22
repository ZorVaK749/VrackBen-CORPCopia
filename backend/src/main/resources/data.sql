-- ============================================================
-- VraKBen Catalog Lite - Datos iniciales de demostración
-- Se ejecuta automáticamente al arrancar con H2 en memoria.
-- Tabla: catalog_products (creada por Hibernate con ddl-auto: create-drop)
-- ============================================================

INSERT INTO catalog_products (sku, name, brand, category, description, price, stock, image_url) VALUES
(
    'FIL-ACE-001',
    'Filtro de Aceite Premium',
    'Bosch',
    'Filtros',
    'Filtro de aceite de alto rendimiento compatible con motores de 1.4L a 2.5L. Filtra partículas de hasta 25 micras.',
    12.99,
    150,
    'https://placehold.co/300x300?text=Filtro+Aceite'
),
(
    'FIL-AIR-002',
    'Filtro de Aire Deportivo',
    'K&N',
    'Filtros',
    'Filtro de aire lavable y reutilizable. Aumenta hasta un 15% el flujo de aire para mayor rendimiento.',
    45.50,
    75,
    'https://placehold.co/300x300?text=Filtro+Aire'
),
(
    'FRE-PAD-003',
    'Pastillas de Freno Delanteras',
    'Brembo',
    'Frenos',
    'Pastillas de freno de cerámica para vehículos sedán y SUV. Sin polvo metálico, silenciosas.',
    38.00,
    200,
    'https://placehold.co/300x300?text=Pastillas+Freno'
),
(
    'ELE-BAT-004',
    'Batería 12V 60Ah',
    'Optima',
    'Eléctrico',
    'Batería AGM de ciclo profundo. Ideal para vehículos con sistemas Start-Stop. Garantía 2 años.',
    189.99,
    40,
    'https://placehold.co/300x300?text=Bateria'
),
(
    'SUS-AMO-005',
    'Amortiguador Trasero',
    'Monroe',
    'Suspensión',
    'Amortiguador de gas presurizado para eje trasero. Compatible con Toyota Corolla 2018-2024.',
    65.00,
    60,
    'https://placehold.co/300x300?text=Amortiguador'
),
(
    'LUB-MOT-006',
    'Aceite Motor 5W-30 Sintético',
    'Mobil 1',
    'Lubricantes',
    'Aceite de motor sintético de grado 5W-30. Bidón de 4 litros. Para motores gasolina y diésel modernos.',
    55.99,
    300,
    'https://placehold.co/300x300?text=Aceite+Motor'
),
(
    'ILU-BOM-007',
    'Bombilla LED H7 6000K',
    'Philips',
    'Iluminación',
    'Par de bombillas LED H7 con temperatura de color 6000K. Instalación plug & play, sin canbus.',
    29.99,
    120,
    'https://placehold.co/300x300?text=LED+H7'
);
