function SizeSelection({ onSizeSelect, itemType }) {
    const sizes = [
    { name: "Small" },
    { name: "Medium" },
    { name: "Large" },
    ];

    const disabledSizes = {
    appetizer: ["Medium"], 
    side: ["Small"], 
    };

    return (
    <div className="menu-section">
        <div className="menu-grid">
        {sizes.map((size, index) => (
            <button
            key={index}
            className={`menu-item-btn ${
                disabledSizes[itemType]?.includes(size.name) ? "invisible-btn" : ""
            }`}
            disabled={disabledSizes[itemType]?.includes(size.name)}
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