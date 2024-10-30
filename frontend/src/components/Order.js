class Order {
    constructor() {
      this.items = [];
    }
  
    // Add or update an item in the order
    addItem(item) {
      const existingItem = this.items.find(i => i.name === item.name);
      if (existingItem) {
        // If the item already exists, update quantity and details
        existingItem.quantity += item.quantity || 1;
        existingItem.details = [...existingItem.details, ...(item.details || [])];
      } else {
        // Add new item with a default quantity and optional details
        this.items.push({
          ...item,
          quantity: item.quantity || 1,
          details: item.details || []  // Initialize details if not provided
        });
      }
    }
  
    // Remove an item from the order by name
    removeItem(name) {
      this.items = this.items.filter(item => item.name !== name);
    }
  
    // Update the details for a specific item
    updateItemDetails(name, newDetails) {
      const item = this.items.find(i => i.name === name);
      if (item) {
        item.details = newDetails;
      }
    }
  
    // Update quantity for an item in the order
    updateItemQuantity(name, quantity) {
      const item = this.items.find(i => i.name === name);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeItem(name);
        }
      }
    }
  
    // Calculate the total price of the order
    getTotalPrice() {
      return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  
    // Clear the entire order
    clearOrder() {
      this.items = [];
    }
  
    // Get a summary of the order items
    getOrderSummary() {
      return this.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        details: item.details,
        total: item.price * item.quantity
      }));
    }
  }
  
  export default Order;
  