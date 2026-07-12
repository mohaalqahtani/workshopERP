-- thx claude for this fix :)

SELECT setval(
  pg_get_serial_sequence('"Parts_Inventory"', 'id'),
  COALESCE((SELECT MAX(id) FROM "Parts_Inventory"), 0) + 1,
  false
);