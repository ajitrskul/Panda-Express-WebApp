INSERT INTO menu_item (menu_item_id, item_name, max_entrees, max_sides, is_unique, price_adjustment, premium_price_multiplier, side_price_adjustment)
VALUES
(1, 'bowl', 1, 1, FALSE, 0, 0, 0),
(2, 'plate', 2, 1, FALSE, 0, 0, 0),
(3, 'biggerPlate', 3, 1, FALSE, 0, 0, 0),
(4, 'familyMeal', 3, 2, TRUE, 24.9, 3, 0), 
(5, 'appetizerSmall', 0, 0, FALSE, 0, 0, 0),
(6, 'appetizerMedium', 0, 0, TRUE, 4.2, 0, 0),
(7, 'appetizerLarge', 0, 0, TRUE, 9.2, 0, 0),
(8, 'aLaCarteSmall', 1, 1, TRUE, 3.7, 1, 0),
(9, 'aLaCarteMedium', 1, 1, TRUE, 7.0, 2, -2.4),
(10, 'aLaCarteLarge', 1, 1, TRUE, 9.7, 3, -1.4),
(11, 'drinkSmall', 0, 0, FALSE, 0, 0, 0),
(12, 'drinkMedium', 0, 0, TRUE, 0.2, 0, 0),
(13, 'drinkLarge', 0, 0, TRUE, 0.4, 0, 0),
(14, 'drink', 0, 0, FALSE, 0, 0, 0);