import { useGlobalContext } from '../../context';

const IconModal = () => {
  const { iconModal, setIconModal } = useGlobalContext();

  const { isModalOpen, icon } = iconModal;

  return (
    <div className={isModalOpen ? 'icon-modal show' : 'icon-modal'}>
      <div className='icon-modal-content'>
        <span
          className='close'
          onClick={() => setIconModal({ isModalOpen: false })}
        >
          &times;
        </span>
        {icon === 'question' ? (
          <Question />
        ) : icon === 'leaderboard' ? (
          <Leaderboard />
        ) : (
          <Settings />
        )}
      </div>
    </div>
  );
};

const Question = () => {
  return (
    <p>
      Rules are self-explanatory. Created by{' '}
      <a style={{ color: 'black' }} href='https://twitter.com/mercilessbtc'>
        @mercilessbtc
      </a>
      .
    </p>
  );
};

const Leaderboard = () => {
  return <p>I haven't learnt backend yet :3</p>;
};

const Settings = () => {
  return <p>No time to do settings</p>;
};

export default IconModal;
