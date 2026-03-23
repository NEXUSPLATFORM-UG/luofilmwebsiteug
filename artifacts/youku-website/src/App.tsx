import { Switch, Route } from "wouter";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/play/:id" component={PlayPage} />
        <Route>
          <div className="flex items-center justify-center min-h-screen text-gray-500">
            <div className="text-center">
              <p className="text-6xl mb-4">404</p>
              <p className="text-lg">Page not found</p>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
