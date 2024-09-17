import { useState } from "react";
import { SwatchesPicker } from "react-color";

// src/types/color.ts
export interface Color {
  colorName: string;
  colorCode: string;
  imageUrl: File | null; // Use File type for uploaded images
}

export interface ColorSelectionProps {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}
const ColorSelection: React.FC<ColorSelectionProps> = ({
  colors,
  setColors,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState<number | null>(
    null
  );

  const handleAddColor = () => {
    setColors([
      ...colors,
      { colorName: "", colorCode: "#FFFFFF", imageUrl: null },
    ]);
  };

  const handleColorChange = (color: { hex: string }) => {
    if (currentColorIndex !== null) {
      const updatedColors = [...colors];
      updatedColors[currentColorIndex].colorCode = color.hex;
      setColors(updatedColors);
    }
  };

  const handleColorPickerClick = (index: number) => {
    setCurrentColorIndex(index);
    setShowColorPicker(true);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  const handleImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const updatedColors = [...colors];
      updatedColors[index].imageUrl = file; // Save the file object
      setColors(updatedColors);
    }
  };

  const handleDeleteColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-medium text-gray-700">Colors</h3>
      {colors.map((color, index) => (
        <div key={index} className="flex md:flex-row flex-col md:gap-0 gap-5 items-center space-x-2 mb-2">
          <input
            type="text"
            value={color.colorName}
            onChange={(e) => {
              const updatedColors = [...colors];
              updatedColors[index].colorName = e.target.value;
              setColors(updatedColors);
            }}
            placeholder="Color Name"
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => handleColorPickerClick(index)}
            style={{ backgroundColor: color.colorCode }}
            className="w-12 h-8 rounded-md border border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(index, e)}
            className="p-2 border border-gray-300 rounded-md"
          />
          {color.imageUrl && (
            <img
              src={URL.createObjectURL(color.imageUrl)}
              alt={color.colorName}
              className="w-12 h-8 rounded-md border border-gray-300"
            />
          )}
          <button
            type="button"
            onClick={() => handleDeleteColor(index)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddColor}
        className="bg-orange-400 text-white p-2 rounded-md"
      >
        Add Color
      </button>

      {showColorPicker && currentColorIndex !== null && (
        <div className="absolute z-10 p-4">
          <div
            onClick={handleColorPickerClose}
            className="fixed inset-0 bg-black opacity-50"
          />
          <div className="relative bg-white p-4 border border-gray-300 rounded-md">
            <SwatchesPicker
              color={colors[currentColorIndex].colorCode}
              onChange={handleColorChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelection;
