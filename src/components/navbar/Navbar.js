import { BsList } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { useGlobalContext } from '../../context';
import { FiRefreshCcw } from 'react-icons/fi';

const Navbar = () => {
  const { setIconModal, handleRestartClick } = useGlobalContext();
  return (
    <nav>
      <div className='navbar'>
        <div className='left-section'>
          <BsList className='nav-icon' />
          <AiOutlineQuestionCircle
            className='nav-icon'
            onClick={() =>
              setIconModal({ isModalOpen: true, icon: 'question' })
            }
          />
        </div>
        <h1>
          Wordle <sup style={{ fontSize: '14px' }}>unlimited</sup>
        </h1>
        <div className='right-section'>
          <MdOutlineLeaderboard
            className='nav-icon'
            onClick={() =>
              setIconModal({ isModalOpen: true, icon: 'leaderboard' })
            }
          />

          <IoMdSettings
            className='nav-icon'
            onClick={() =>
              setIconModal({ isModalOpen: true, icon: 'settings' })
            }
          />
          <FiRefreshCcw
            className='nav-icon restart-icon'
            onClick={handleRestartClick}
          />
        </div>
      </div>
      <div className='underline'></div>
    </nav>
  );
};

export default Navbar;
