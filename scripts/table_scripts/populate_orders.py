from random import *

####GLOBAL VARIABLES####

#organizing product ID's to randomize
entreeProductIDs = {
    'theOriginalOrangeChicken': 5,
    'blackPepperSirloinSteak': 6,
    'honeyWalnutShrimp': 7,
    'grilledTeriyakiChicken': 8,
    'kungPaoChicken': 9,
    'honeySesameChickenBreast': 10,
    'beijingBeef': 11,
    'mushroomChicken': 12,
    'sweetfireChickenBreast': 13,
    'stringBeanChickenBreast': 14,
    'broccoliBeef': 15,
    'blackPepperChicken': 16,
    'superGreensEntree': 17
}

entreeProducts = [
    'theOriginalOrangeChicken', 'blackPepperSirloinSteak', 'honeyWalnutShrimp', 
    'grilledTeriyakiChicken', 'kungPaoChicken', 'honeySesameChickenBreast', 
    'beijingBeef', 'mushroomChicken', 'sweetfireChickenBreast', 
    'stringBeanChickenBreast', 'broccoliBeef', 'blackPepperChicken', 'superGreensEntree'
]

sideProductIDs = {
    'chowMein': 1,
    'friedRice': 2,
    'whiteSteamedRice': 3,
    'superGreensSide': 4
}

sideProducts = ['chowMein', 'friedRice', 'whiteSteamedRice', 'superGreensSide']

appetizerProductIDs = {
    'chickenEggRoll': 18,
    'veggieSpringRoll': 19,
    'creamCheeseRangoon': 20,
    'applePieRoll': 21
}

appetizerProducts = ['chickenEggRoll', 'veggieSpringRoll', 'creamCheeseRangoon', 'applePieRoll']

drinkProductIDs = {
    'drPepper': 22,
    'sweetTea': 23,
    'pepsi': 24,
    'dietPepsi': 25,
    'mountainDew': 26,
    'liptonBriskRaspberryIcedTea': 27,
    'sierraMist': 28,
    'tropicanaLemonade': 29,
    'aquafina': 30,
    'gatoradeLemonLime': 31
}

drinkProducts = ['drPepper', 'sweetTea', 'pepsi', 'dietPepsi', 'mountainDew', 'liptonBriskRaspberryIcedTea', 'sierraMist', 'tropicanaLemonade', 'aquafina', 'gatoradeLemonLime']

menuItemsList = [
    'bowl', 'plate', 'biggerPlate', 'familyMeal', 'appetizerSmall', 'appetizerLarge', 
    'aLaCarteSideMedium', 'aLaCarteSideLarge', 'aLaCarteEntreeSmall', 
    'aLaCarteEntreeMedium', 'aLaCarteEntreeLarge', 'dessertSmall', 
    'dessertMedium', 'dessertLarge', 'drinksSmall', 'drinksMedium', 
    'drinksLarge', 'drinks'
]

menuItemIDs = {
    'bowl': 1,
    'plate': 2,
    'biggerPlate': 3,
    'familyMeal': 4,
    'appetizerSmall': 5,
    'appetizerLarge': 6,
    'aLaCarteSideMedium': 7,
    'aLaCarteSideLarge': 8,
    'aLaCarteEntreeSmall': 9,
    'aLaCarteEntreeMedium': 10,
    'aLaCarteEntreeLarge': 11,
    'dessertSmall': 12,
    'dessertMedium': 13,
    'dessertLarge': 14,
    'drinksSmall': 15,
    'drinksMedium': 16,
    'drinksLarge': 17,
    'drinks': 18
}

daysInMonth = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31}

orderID = 1 #orderID

orderMenuItemID = 1

orderMenuItemProductID = 1

#list of lists containing all the items ordered
#format of second list (i.e. list accessed by second index [][X]) :
#[orderMenuItemID (int), orderID (int), menuItemID(int), subtotalPrice (int)]
orderMenuItems = []
orderMenuItemProducts = []

def generateSide():
  isGreens = (randrange(1,17) == 16)
  if (isGreens):
    outputSide = 4
  else:
    outputSide = randrange(1,4)
  return outputSide

def generateEntree():
  outputEntree = randrange(0,len(entreeProducts)+1)
  premiumMultiplier = 0

  if (outputEntree >= len(entreeProducts)):
    outputEntree = 5
  else:
    outputEntree = entreeProductIDs[entreeProducts[outputEntree]]
  
  if ((outputEntree == 6) or (outputEntree == 7)):
    premiumMultiplier = 1
  return outputEntree, premiumMultiplier

def generateAppetizer():
  outputAppetizer = randrange(1,14)
  if (outputAppetizer <= 7):
    outputAppetizer = 18
  elif (outputAppetizer <= 10):
    outputAppetizer = 19
  elif (outputAppetizer <= 12):
    outputAppetizer = 20
  else:
    outputAppetizer = 21
  return outputAppetizer

def generateSmallDrink():
  outputDrink = randrange(1,8)
  if (outputDrink == 1):
    outputDrink = 23
  elif (outputDrink <= 3):
    outputDrink = 24
  else:
    outputDrink = 22
  return outputDrink

def generateProducts(currentMenuItem):
  global orderMenuItemProductID
  global orderMenuItemID
  global orderMenuItems
  global orderMenuItemProducts

  #[[order_menu_item_product_id (int), order_menu_item_id (int), product_id(int)], ..., ...]
  currentProduct = []
  subtotalPrice = 0

  currentSide = -1
  currentEntree = -1
  if (currentMenuItem == 'bowl'):
    #1 side
    currentSide = generateSide()
    subtotalPrice += 6.8
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentSide] ]
    orderMenuItemProductID += 1

    #1 entree
    currentEntree, premiumMultiplier = generateEntree()
    subtotalPrice += 1.5 + 1.5*premiumMultiplier
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'plate'):
    #1 side
    currentSide = generateSide()
    subtotalPrice += 6.8
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentSide] ]
    orderMenuItemProductID += 1

    #2 entrees
    for i in range(2):
      currentEntree, premiumMultiplier = generateEntree()
      subtotalPrice += 1.5 + 1.5*premiumMultiplier
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
      orderMenuItemProductID += 1
  elif (currentMenuItem == 'biggerPlate'):
    #1 side
    currentSide = generateSide()
    subtotalPrice += 6.8
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentSide] ]
    orderMenuItemProductID += 1

    #3 entrees
    for i in range(3):
      currentEntree, premiumMultiplier = generateEntree()
      subtotalPrice += 1.5 + 1.5*premiumMultiplier
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
      orderMenuItemProductID += 1
  elif (currentMenuItem == 'familyMeal'):
    #2 sides
    for i in range(2):
      currentSide = generateSide()
      subtotalPrice += 6.8
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentSide] ]
      orderMenuItemProductID += 1

    #3 entrees
    for i in range(3):
      currentEntree, premiumMultiplier = generateEntree()
      subtotalPrice += 1.5 + 4.5*premiumMultiplier
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
      orderMenuItemProductID += 1

    #price adjustment
    subtotalPrice += 24.9
  elif (currentMenuItem == 'appetizerSmall'):
    currentAppetizer = generateAppetizer()
    subtotalPrice += 2
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentAppetizer]]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'appetizerMedium'):
    #only medium appetizer = apple pie roll
    subtotalPrice += 6.2
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, 21]]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'appetizerLarge'):
    currentAppetizer = generateAppetizer()
    if ((currentAppetizer == 19) or (currentAppetizer == 18)):
      subtotalPrice += 11.2
    else:
      subtotalPrice += 8
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentAppetizer]]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'aLaCarteSmall'):
    #can only be entree
    currentEntree, premiumMultiplier = generateEntree()
    subtotalPrice += 5.2 + 1.5*premiumMultiplier
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'aLaCarteMedium'):
    #choose side or entree
    sideOrEntree = randrange(1,4)
    if (sideOrEntree <= 2): #entree
      currentEntree, premiumMultiplier = generateEntree()
      subtotalPrice += 8.5 + 3*premiumMultiplier
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
      orderMenuItemProductID += 1
    else: #side
      currentSide = generateSide()
      subtotalPrice += 4.4
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentSide] ]
      orderMenuItemProductID += 1
  elif (currentMenuItem == 'aLaCarteLarge'):
    #choose side or entree
    sideOrEntree = randrange(1,4)
    if (sideOrEntree <= 2): #entree
      currentEntree, premiumMultiplier = generateEntree()
      subtotalPrice += 11.2 + 4.5*premiumMultiplier
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentEntree]]
      orderMenuItemProductID += 1
    else: #side
      currentSide = generateSide()
      subtotalPrice += 5.4
      orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentSide] ]
      orderMenuItemProductID += 1
  elif (currentMenuItem == 'drinkSmall'):
    currentDrink = generateSmallDrink()
    if (currentDrink == 22): #fountainDrink
      subtotalPrice += 2.1
    elif (currentDrink == 23): #aquafina
      subtotalPrice += 2.3
    elif (currentDrink == 24): #gatorade
      subtotalPrice += 2.7
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, currentDrink] ]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'drinkMedium'):
    subtotalPrice += 2.3
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, 22] ]
    orderMenuItemProductID += 1
  elif (currentMenuItem == 'drinkLarge'):
    subtotalPrice += 2.5
    orderMenuItemProducts += [[orderMenuItemProductID, orderMenuItemID, 22] ]
    orderMenuItemProductID += 1
  return subtotalPrice


#INPUT: accepts dictionary of menuItemQuantites & current orderId & current orderMenuItemID
#OUTPUT: List of lists containing all the orderMenuItems in format explained above
def createMenuItems(menuItemsInOrder):
  global orderMenuItems
  global orderMenuItemProducts
  global orderMenuItemID 
  global orderID

  orderPriceBeforeTax = 0

  for i in range(len(menuItemsList)): #loops through every menu item in order
    currQuantity = menuItemsInOrder[menuItemsList[i]] #quantity of current menu item
    for j in range(currQuantity): #loops through individual quantity of each menu item
      #[[order_menu_item_product_id (int), order_menu_item_id (int), product_id(int)], ..., ...]
      menuItemSubtotal = generateProducts(menuItemsList[i])
      #[[orderMenuItemID (int), orderID (int), menuItemID(int), subtotalPrice (int)]]
      orderMenuItems += [[orderMenuItemID, orderID, menuItemIDs[menuItemsList[i]], menuItemSubtotal]]
      orderMenuItemID += 1
      orderPriceBeforeTax += menuItemSubtotal
  return orderPriceBeforeTax


#OUTPUT: random total price given restricted number of menu items
def generateOrder():
  quantityItems = {'bowl': 0, 'plate': 0, 'biggerPlate': 0, 'familyMeal': 0, 'appetizerSmall': 0, 'appetizerMedium': 0, 'appetizerLarge': 0, 'aLaCarteSmall': 0, 'aLaCarteMedium': 0, 'aLaCarteLarge': 0, 'drinkSmall': 0, 'drinkMedium': 0, 'drinkLarge': 0}
  
  '''
  for i in range(8):
    quantityItems[menuItemsList[i]] = randrange(0,2)
  '''
  numEntrees = randrange(0, 14)
  if (1 <= numEntrees <= 10):
    numEntrees = 1
  elif (11 <= numEntrees <= 12):
    numEntrees = 2
  else:
    numEntrees = 3
  for i in range(numEntrees):
    mainItem = randrange(1,27)
    if (1 <= mainItem <= 12):
      quantityItems['bowl'] += 1
    elif (13 <= mainItem <= 20):
      quantityItems['plate'] += 1
    elif (21 <= mainItem <= 25):
      quantityItems['biggerPlate'] += 1
    elif (mainItem == 26):
      quantityItems['familyMeal'] += 1
  
  
  if (numEntrees >= 2):
      numDrinks = randrange(1,3)
  else:
    numDrinks = randrange(1, 13)
    if (numDrinks <= 8):
      numDrinks = 0
    elif (numDrinks <= 12):
      numDrinks = 1
  for i in range(numDrinks):
    drinkItem = randrange(1,16)
    if (drinkItem <= 8):
      quantityItems['drinkSmall'] += 1
    elif (drinkItem <= 13):
      quantityItems['drinkMedium'] += 1
    else:
      quantityItems['drinkLarge'] += 1
  
  for i in range(numEntrees):
    isAppetizer = randrange(1, 11)
    if (isAppetizer <= 2):
      isAppetizer = True
    else:
      isAppetizer = False
    if (isAppetizer):
      appetizerItem = randrange(1,13)
      if (appetizerItem <= 8):
        quantityItems['appetizerSmall'] += 1
      elif (appetizerItem <= 11):
        quantityItems['appetizerMedium'] += 1
      elif (appetizerItem == 12):
        quantityItems['appetizerLarge'] += 1
  
  if (numEntrees == 0):
    numALaCarte = randrange(1,5)
    if (numALaCarte == 4):
      numALaCarte = 2
    else:
      numALaCarte = 1
  else:
    numALaCarte = randrange(1,11)
    if (numALaCarte <= 9):
      numALaCarte = 0
    else:
      numALaCarte = 1
  
  for i in range(numALaCarte):
    ALaCarteItem = randrange(1, 10)
    if (ALaCarteItem <= 5):
      quantityItems['aLaCarteSmall'] += 1
    elif (ALaCarteItem <= 8):
      quantityItems['aLaCarteMedium'] += 1
    else:
      quantityItems['aLaCarteLarge'] += 1

  return quantityItems
  # currentTotalPrice = quantityItems['bowl']*(menuPrices['bowl']) + quantityItems['plate']*(menuPrices['plate']) + quantityItems['biggerPlate']*(menuPrices['biggerPlate']) + quantityItems['aLaCarteSmall']*(menuPrices['aLaCarteSmall']) + quantityItems['aLaCarteMedium']*(menuPrices['aLaCarteMedium']) + quantityItems['aLaCarteLarge']*(menuPrices['aLaCarteLarge']) + quantityItems['appetizerSmall']*(menuPrices['appetizerSmall']) + quantityItems['drinkMedium']*(menuPrices['drinkMedium'])

  # if (currentTotalPrice == 0):
  #   currentTotalPrice = menuPrices['bowl'] + menuPrices['drinkMedium']



#Increments time for each order by 2:30 (could randomize number of seconds)
#Assuming that panda opens at 10:00 AM and closes at 10:30 PM everyday
#INPUT: time to be incremented (timestamp string) & # of seconds to increment
#OUTPUT: incremented timestamp string
#timestamps in format "YYYY-MM-DD HH:MM:SS"
def incrementTime(previousTime, secondsToIncrement):
  timeStamp = previousTime
  seconds = int(timeStamp[17:])
  minutes = int(timeStamp[14:16])
  hours = int(timeStamp[11:13])
  day = int(timeStamp[8:10])
  month = int(timeStamp[5:7])
  year = int(timeStamp[0:4])

  seconds += secondsToIncrement

  if (seconds >= 60):
    minutes += seconds//60
    seconds = seconds % 60
  
  if (minutes >= 60):
    hours += minutes//60
    minutes = minutes % 60
  
  if (hours >= 24):
    day += hours//24
    hours = hours % 24
  
  #checks to see if time exceeds panda express opening times
  if (hours >= 22) and (minutes >= 30):
    hours = 10
    minutes = 0
    day +=1
  
  if (day > daysInMonth[month]):
    prevDay = day

    day = day % daysInMonth[month] 

    month += prevDay//daysInMonth[month]

    #checks if months overflows BEFORE days (since months calculation depends on days)
    if (month > 12):   
      year += month//12
      month = month % 12

      #checks for leap year
      if (year % 4 == 0):
        daysInMonth[2] = 29
      else:
        daysInMonth[2] = 28

  #checks if months overflows AFTER days 
  if (month > 12):
    year += month//12
    month = month % 12

    #checks for leap year
    if (year % 4 == 0):
      daysInMonth[2] = 29
    else:
      daysInMonth[2] = 28

  
  #creating timestamp string
  date = str(year) + "-" + f'{month:02d}' + "-" + f'{day:02d}' 
  time = f'{hours:02d}' + ":" +  f'{minutes:02d}' + ":" + f'{seconds:02d}'
  timeStamp = date + " " + time

  return timeStamp

#NOT NEEDED since employee table is accessible from POS
#Opening employee table for writing
# with open("populate_employee.sql", 'w') as file1:
#   #writing employees into sql
#   file1.write("INSERT INTO employee (employee_id, first_name, last_name, role)\n")
#   file1.write("VALUES\n")

#   employeeID = {0:f"{randrange(0,10000):04d}", 1:f"{randrange(0,10000):04d}", 2:f"{randrange(0,10000):04d}"}

#   file1.write(f"({employeeID[0]}, 'Bella', 'Garzonie', 'manager'),\n") 
#   file1.write(f"({employeeID[1]}, 'Gretta', 'Weich', 'cashier'),\n") 
#   file1.write(f"({employeeID[2]}, 'Aurora', 'Jitrskul', 'cashier');\n\n") 

employeeID = [121202, 312879, 493268, 523506, 668453, 826497]  

#opening ordertable file for writing  
with open("populate_order.sql", 'w') as file2:
  file2.write('''INSERT INTO "order" (order_id, order_date_time, employee_id, total_price)\n''')
  file2.write("VALUES\n")

  #peak days 2024-08-31 & 2024-04-13 
  currentDate = "2022-09-23 10:00:00" #1 year before scripts were made

  '''
  REQUIREMENTS:
  - AT LEAST 52 weeks of sales history 
  - Inventory Items for AT LEAST 20 menu items (done : 40+)
  - approx 1 mil in sales for 1 year
  '''

  #peak days = 8/31/24 & 4/13/24
  totalRevenue = 0
  count = randrange(101, 121) #random method to determine how many orders on last day
  while (True): #loop for 2 years
    menuItemsInOrder = generateOrder() #randomizing menu items in the order
    
    orderPriceBeforeTax = createMenuItems(menuItemsInOrder)


    #checks if date = one of our two chosen peak days
    if (("2024-08-31" in currentDate) or ("2024-04-13" in currentDate)): #should double on avg
      if (" 12:" in currentDate): #lunch time
        currentDate = incrementTime(currentDate, randrange(5, 31))
      elif ((" 6:" in currentDate) or (" 7:" in currentDate) or (" 8:" in currentDate)): #dinner time
        currentDate = incrementTime(currentDate, randrange(5, 46)) 
      else:
        currentDate = incrementTime(currentDate, randrange(10, 301)) #10s-20 minutes
    else:
      if (" 12:" in currentDate): #lunch time
        currentDate = incrementTime(currentDate, randrange(5, 61))
      elif ((" 6:" in currentDate) or (" 7:" in currentDate) or (" 8:" in currentDate)): #dinner time
        currentDate = incrementTime(currentDate, randrange(5, 91)) 
      else:
        currentDate = incrementTime(currentDate, randrange(10, 1201)) #10s-20 minutes

    #ensuring correct SQL syntax
    if ("2024-09-23" in currentDate):
      if (count == 0):
        file2.write(f"({orderID}, '{currentDate}', '{employeeID[randrange(0,3)]}', '{orderPriceBeforeTax*1.0825:.2f}');")
        break
      else:
        file2.write(f"({orderID}, '{currentDate}', '{employeeID[randrange(0,3)]}', '{orderPriceBeforeTax*1.0825:.2f}'),\n")
        count -= 1
    else:
      file2.write(f"({orderID}, '{currentDate}', '{employeeID[randrange(0,3)]}', '{orderPriceBeforeTax*1.0825:.2f}'),\n")
    orderID += 1
    totalRevenue += orderPriceBeforeTax

with open("populate_order_menu_item.sql", 'w') as file3:
  file3.write("INSERT INTO order_menu_item (order_menu_item_id, order_id, menu_item_id, subtotal_price)\n")
  file3.write("VALUES\n")
  for i in range(len(orderMenuItems)):
    orderMenuItem = orderMenuItems[i]
    if (i == len(orderMenuItems)-1):
      file3.write(f'({orderMenuItem[0]}, {orderMenuItem[1]}, {orderMenuItem[2]}, {orderMenuItem[3]});')
    else:
      file3.write(f'({orderMenuItem[0]}, {orderMenuItem[1]}, {orderMenuItem[2]}, {orderMenuItem[3]}),\n')

with open("populate_order_menu_item_product.sql", 'w') as file4:
  file4.write("INSERT INTO order_menu_item_product (order_menu_item_product_id, order_menu_item_id, product_id)\n")
  file4.write("VALUES\n")

  lastLine = False #boolean to check if it's the last line 
  for i in range(len(orderMenuItemProducts)):

    orderMenuItemProduct = orderMenuItemProducts[i]
    if (i == len(orderMenuItemProducts)-1):
      file4.write(f'({orderMenuItemProduct[0]}, {orderMenuItemProduct[1]}, {orderMenuItemProduct[2]});')
    else:
      file4.write(f'({orderMenuItemProduct[0]}, {orderMenuItemProduct[1]}, {orderMenuItemProduct[2]}),\n')

print("Total revenue for 9/22-9/24: ", totalRevenue)
    

    # currentMenuItem = orderMenuItem[2] #get menu item id from orderMenuItems
    # #Need to randomize products for each orderMenuItem
    # numEntree = 0
    # numSides = 0

    # #write data in this order: (order_menu_item_product_id, order_menu_item_id, product_id)
    # #obscene if-elif branch to differentiate menuItems
    # if currentMenuItem == 1: #bowl
    #   #1 entree
    #   file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1

    #   #1 side
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {sideProductIDs[sideProducts[randrange(0,3)]]});')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {sideProductIDs[sideProducts[randrange(0,3)]]}),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 2: #plate
    #   #2 entrees
    #   file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1
    #   file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1

    #   #1 side
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {sideProductIDs[sideProducts[randrange(0,3)]]});')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {sideProductIDs[sideProducts[randrange(0,3)]]}),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 3: #biggerPlate
    #   #3 entrees
    #   file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1
    #   file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1
    #   file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1

    #   #1 side
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {sideProductIDs[sideProducts[randrange(0,3)]]});')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {sideProductIDs[sideProducts[randrange(0,3)]]}),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 8: #aLaCarteSmall (entree)
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]});')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 9: #aLaCarteMedium (entree)
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]});')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 10: #aLaCarteLarge (entree)
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]});')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, {entreeProductIDs[entreeProducts[randrange(0,11)]]}),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 5: #appetizerSmall
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, 18);')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, 18),\n')
    #   orderMenuItemProductID += 1
    # elif currentMenuItem == 12: #mediumDrink
    #   if (lastLine):
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, 22);')
    #   else:
    #     file4.write(f'({orderMenuItemProductID}, {orderMenuItem[0]}, 22),\n')
    #   orderMenuItemProductID += 1

    










