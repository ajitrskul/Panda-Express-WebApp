class Order {
    constructor() {
      this.subOrders = []; // Array to hold suborders
    }
  
    // Add a suborder to the order
    addSubOrder(subOrder) {
      this.subOrders.push(subOrder);
    }
  
    // Remove a suborder by index
    deleteSubOrder(index) {
      if (index >= 0 && index < this.subOrders.length) {
        this.subOrders.splice(index, 1);
      } else {
        console.warn('Invalid index');
      }
    }
  
    // Get a summary of all suborders
    getOrderSummary() {
      return this.subOrders.map(subOrder => subOrder.items);
    }
  
    // Convert the order to a string for display
    toString() {
      return this.subOrders.map(subOrder => `[${subOrder.items.join(', ')}]`).join(', ');
    }
}

export default Order;