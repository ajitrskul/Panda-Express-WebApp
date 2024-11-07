class SubOrder {
  constructor(...items) {
    this.items = items; // Array to hold items in a suborder
  }

  // Add an item to the suborder
  addItem(item) {
    this.items.push(item);
  }

  // Remove item from the suborder
  deleteItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1); // Remove the item if found
    } else {
      console.warn(`Item "${item}" not found in SubOrder.`);
    }
  }

  // Convert items to a string for display purposes
  toString() {
    return this.items.join(', ');
  }
}

export default SubOrder;