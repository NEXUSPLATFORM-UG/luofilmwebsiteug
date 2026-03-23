import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.location.href = "/youku.html";
  }, []);

  return null;
}

export default App;
