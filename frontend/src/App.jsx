import React from "react";
import PersistentDrawer from "./components/Drawer/persistentDrawer";
import TextProcessor from "./components/TextProcessor/TextProcessor";

const App = () => {
  // const [selectedText, setSelectedText] = useState("");
  // const [selectedCount, setSelectedCount] = useState(0);

  return (
    <PersistentDrawer>
      <TextProcessor />
    </PersistentDrawer>
  );
};

export default App;
