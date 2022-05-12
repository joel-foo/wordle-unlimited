import { useEffect } from 'react';
import { BsBackspace } from 'react-icons/bs';
import { useGlobalContext } from '../../context';

const Keyboard = () => {
  const { inputs, row, boxColorEdited, setBoxColorEdited, handleKeyPress } =
    useGlobalContext();

  const keysList = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  useEffect(() => {
    if (boxColorEdited) {
      setTimeout(() => {
        const { letters } = inputs;
        for (let list of keysList) {
          for (let key of list) {
            let tempColor = '';
            //compare each key with all input letters
            for (let i = 0; i <= row; i++) {
              for (let j = 0; j < letters[i].length; j++) {
                const { val, color } = letters[i][j];
                if (val === key) {
                  if (
                    !tempColor ||
                    color === 'green' ||
                    (color === 'orange' && tempColor === 'gray')
                  ) {
                    tempColor = color;
                  }
                }
              }
            }
            if (tempColor) {
              document.querySelector(`#${key}`).className = `key ${tempColor}`;
            }
          }
        }
      }, 2100);
      setBoxColorEdited(false);
    }
  }, [boxColorEdited]);

  return (
    <div className='keyboard-container'>
      <div className='keyboard'>
        {keysList.map((list, i) => {
          return (
            <div className='row' key={i}>
              {list.map((key, index) => {
                return (
                  <div
                    className={
                      (key === 'Enter') | (key === 'Backspace')
                        ? 'special'
                        : 'key'
                    }
                    onClick={() => handleKeyPress('', key)}
                    id={key}
                    key={index}
                  >
                    {key === 'Backspace' ? (
                      <BsBackspace style={{ width: '20px', height: '20px' }} />
                    ) : (
                      key
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Keyboard;
