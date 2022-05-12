import { useEffect } from 'react';
import Box from './Box';
import { useGlobalContext } from '../../context';

const Row = ({ n }) => {
  const {
    inputs,
    row,
    checkAns,
    inputRef,
    setFocusedElement,
    handleKeyPress,
    isGuessCorrect,
  } = useGlobalContext();

  //focus on 1st box of row in question
  useEffect(() => {
    const firstBox = inputRef.current[0];
    firstBox.focus();
  }, [row]);

  //create focus effect whenever input is non-empty, should be removed when checking answer so that there is no double outline during box rotation
  useEffect(() => {
    if (!checkAns) {
      if (n === row) {
        for (let i = 0; i < 5; i++) {
          if (inputRef.current[i].value !== '') {
            inputRef.current[i].className = 'input-letter input-focus';
          } else {
            inputRef.current[i].className = 'input-letter';
          }
        }
      }
    }
  });

  const onInputPress = (e) => {
    handleKeyPress(e, '');
  };

  //listens for inputs only if the guess is not correct
  useEffect(() => {
    if (!isGuessCorrect | !checkAns) {
      if (n === row) {
        window.addEventListener('keydown', onInputPress);
        //cleanup function
        return () => {
          window.removeEventListener('keydown', onInputPress);
        };
      }
    }
  });

  const getBoxClass = () => {
    //remove box border if n<current row or if n=current row and checkAns is true
    if (n < row || (checkAns && n === row)) {
      return 'box no-border';
    } else {
      return 'box';
    }
  };

  const getInputClass = () => {
    if (n < row || (checkAns && n === row)) {
      return 'input-letter hide';
    } else {
      return 'input-letter';
    }
  };

  return (
    <form className='grid-container' autoComplete='off' id={`g${n}`}>
      {[...Array(5)].map((e, i) => {
        const { val } = inputs.letters[n][i];

        if (n === row) {
          return (
            <div className={getBoxClass()} key={i}>
              <input
                className={getInputClass()}
                value={val}
                type='text'
                ref={(el) => (inputRef.current[i] = el)}
                onFocus={() => setFocusedElement(inputRef.current[i])}
                readOnly
              />
              <Box n={n} i={i} />
            </div>
          );
        } else {
          return (
            <div className={getBoxClass()} key={i}>
              <input
                className={getInputClass()}
                value={val}
                type='text'
                readOnly
              />
              <Box n={n} i={i} />
            </div>
          );
        }
      })}
    </form>
  );
};

export default Row;
