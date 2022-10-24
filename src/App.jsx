import Notes from "./components/Notes/Notes";
import NotesProvider from "./context/notesProvider";

function App() {
  return (
    <div className="App">
      <NotesProvider>
        <Notes />
      </NotesProvider>
    </div>
  );
}

export default App;
