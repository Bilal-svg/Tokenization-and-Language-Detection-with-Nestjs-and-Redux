import React, { useState } from "react";
import PersistentDrawer from "./components/Drawer/persistentDrawer";
import TextProcessor from "./components/TextProcessor/TextProcessor";

const App = () => {
  const [selectedText, setSelectedText] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);

  const handleTextSelect = (text, count) => {
    setSelectedText(text);
    setSelectedCount(count);
  };

  return (
    <PersistentDrawer onTextSelect={handleTextSelect}>
      <TextProcessor
        selectedText={selectedText}
        selectedCount={selectedCount}
      />
    </PersistentDrawer>
  );
};

export default App;
