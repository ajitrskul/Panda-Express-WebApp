function SizeSelection({ onSizeSelect, itemType }) {
    const sizes = [
      { name: "Small" },
      { name: "Medium" },
      { name: "Large" },
    ];
  
    return (
      <div className="menu-section">
        <div className="menu-grid">
          {sizes.map((size, index) => (
            <button
              key={index}
              className="menu-item-btn"
              onClick={() =>
                onSizeSelect({
                  name: size.name.toLowerCase(), 
                  type: itemType, 
                })
              }
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  export default SizeSelection;  