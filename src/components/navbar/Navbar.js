import { BsList } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { useGlobalContext } from '../../context';

const Navbar = () => {
  const style = { height: '25px', width: '25px', margin: '0px 5px' };
  const { setIconModal } = useGlobalContext();

  return (
    <>
      <nav>
        <div className='navbar'>
          <div className='left-section'>
            <BsList style={style} />
            <AiOutlineQuestionCircle
              style={style}
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
              style={style}
              onClick={() =>
                setIconModal({ isModalOpen: true, icon: 'leaderboard' })
              }
            />
            <IoMdSettings
              style={style}
              onClick={() =>
                setIconModal({ isModalOpen: true, icon: 'settings' })
              }
            />
          </div>
        </div>
        <div className='underline'></div>
      </nav>
    </>
  );
};

export default Navbar;
