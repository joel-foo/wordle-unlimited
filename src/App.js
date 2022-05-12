import Navbar from './components/navbar/Navbar';
import Board from './components/board/Board';
import Keyboard from './components/keyboard/Keyboard';
import IconModal from './components/modals/IconModal';

function App() {
  return (
    <main>
      <Navbar />
      <div className='modal-container'></div>
      <IconModal />
      <Board />
      <Keyboard />
    </main>
  );
}

export default App;
