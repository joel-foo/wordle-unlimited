import React, { useState, useEffect, useContext, useRef } from 'react';
import possibleRaw from './words/possible_words.txt';
import allowedRaw from './words/allowed_words.txt';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [correctWord, setCorrectWord] = useState('');

  //refers to current row in question:
  const [row, setRow] = useState(0);

  const [checkAns, setCheckAns] = useState(false);

  //refers to which box is focused:
  const [focusedElement, setFocusedElement] = useState('');

  //whether or not the box colors have been edited
  const [boxColorEdited, setBoxColorEdited] = useState(false);

  const [guessCount, setGuessCount] = useState(0);

  const [iconModal, setIconModal] = useState({ isModalOpen: false, icon: '' });

  const [errorCount, setErrorCount] = useState(0);

  //refers to 1vh
  const [viewHeight, setViewHeight] = useState(0.01 * window.innerHeight);

  const defaultInputs = {
    letters: [
      [
        { x: 1, val: '', color: '' },
        { x: 2, val: '', color: '' },
        { x: 3, val: '', color: '' },
        { x: 4, val: '', color: '' },
        { x: 5, val: '', color: '' },
      ],
      [
        { x: 1, val: '', color: '' },
        { x: 2, val: '', color: '' },
        { x: 3, val: '', color: '' },
        { x: 4, val: '', color: '' },
        { x: 5, val: '', color: '' },
      ],
      [
        { x: 1, val: '', color: '' },
        { x: 2, val: '', color: '' },
        { x: 3, val: '', color: '' },
        { x: 4, val: '', color: '' },
        { x: 5, val: '', color: '' },
      ],
      [
        { x: 1, val: '', color: '' },
        { x: 2, val: '', color: '' },
        { x: 3, val: '', color: '' },
        { x: 4, val: '', color: '' },
        { x: 5, val: '', color: '' },
      ],
      [
        { x: 1, val: '', color: '' },
        { x: 2, val: '', color: '' },
        { x: 3, val: '', color: '' },
        { x: 4, val: '', color: '' },
        { x: 5, val: '', color: '' },
      ],
      [
        { x: 1, val: '', color: '' },
        { x: 2, val: '', color: '' },
        { x: 3, val: '', color: '' },
        { x: 4, val: '', color: '' },
        { x: 5, val: '', color: '' },
      ],
    ],
  };

  //Board State
  const [inputs, setInputs] = useState(defaultInputs);

  const [isGuessCorrect, setIsGuessCorrect] = useState(false);

  //inputRef will be a callback ref to enable access to multiple inputs within the row
  const inputRef = useRef([]);

  //rotateRef will be a callback ref to enable access to multiple boxes within the row
  const rotateRef = useRef([]);

  //ref to be used for error handling
  const ref = useRef(null);

  const modalContainer = document.querySelector('.modal-container');

  //handle resizing to get accurate vh
  const handleResize = () => {
    setViewHeight(0.01 * window.innerHeight);
    document.documentElement.style.setProperty('--vh', `${viewHeight}px`);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const getCorrectWord = () => {
    fetch(possibleRaw)
      .then((r) => r.text())
      .then((text) => {
        const randomWord =
          text.split('\n')[Math.floor(Math.random() * text.split('\n').length)];
        setCorrectWord(randomWord.toUpperCase());
      });
  };

  //fetches 'word of the day'
  useEffect(() => {
    getCorrectWord();
    //handle promise
  }, []);

  //edits the grid as input letters are filled
  const editInputs = (xCoordinate, value) => {
    setInputs((inputs) => {
      const editedLetters = inputs.letters.map((letter, index) => {
        if (index === row) {
          const editedItems = letter.map((item) => {
            if (item.x === xCoordinate) {
              return { ...item, val: value.toUpperCase() };
            }
            return item;
          });
          return editedItems;
        }
        return letter;
      });
      return { ...inputs, letters: editedLetters };
    });
  };

  //validates inputs upon submission
  const checkValid = () => {
    let wordIsValid = false;
    const guess = inputs.letters[row]
      .map((letter) => letter.val)
      .join('')
      .toLowerCase();
    // compare list of allowed words with guess
    fetch(allowedRaw)
      .then((r) => r.text())
      .then((text) => {
        const words = text.split('\n');
        for (let i = 0; i < words.length; i++) {
          if (words[i] === guess) {
            wordIsValid = true;
            break;
          }
        }
        if (!wordIsValid) {
          addErrorMessage('not in word list');
          setErrorCount(errorCount + 1);
          wobbleBoxes();
        } else {
          setCheckAns(true);
          setGuessCount(guessCount + 1);
          if (guess === correctWord.toLowerCase()) {
            setIsGuessCorrect(true);
          }
        }
      });
  };

  //handles error messages and wobble box effect
  const addErrorMessage = (msg) => {
    const message = document.createElement('div');
    message.className = 'modal';
    message.textContent = msg;
    modalContainer.prepend(message);
    while (modalContainer.children.length > 8) {
      modalContainer.removeChild(modalContainer.lastElementChild);
    }
  };

  const wobbleBoxes = () => {
    document.querySelector(`#g${row}`).classList.add('error');
    setTimeout(() => {
      document.querySelector(`#g${row}`).classList.remove('error');
    }, 400);
  };

  //Handles key press:
  const handleKeyPress = (e = '', key = '') => {
    if (checkAns | isGuessCorrect) {
      return;
    }
    if (e) {
      e.preventDefault();
    }
    const inputKey = e.key || key;
    if (inputKey === 'Enter') {
      let isValid = true;
      const { letters } = inputs;
      for (let i = 0; i < letters[row].length; i++) {
        const { val } = letters[row][i];
        if (val === '') {
          isValid = false;
        }
      }
      if (!isValid) {
        addErrorMessage('not enough letters');
        setErrorCount(errorCount + 1);
        wobbleBoxes();
      } else {
        checkValid();
      }
    } else if (inputKey === 'Backspace') {
      let xCoordinate;
      for (let i = 0; i < 5; i++) {
        if (inputRef.current[i] === focusedElement) {
          xCoordinate = i + 1;
        }
      }
      if (xCoordinate > 1 && xCoordinate < 5) {
        inputRef.current[xCoordinate - 2].focus();
        editInputs(xCoordinate - 1, '');
      }
      if (xCoordinate === 5) {
        if (inputRef.current[xCoordinate - 1].value === '') {
          inputRef.current[xCoordinate - 2].focus();
          editInputs(xCoordinate - 1, '');
        } else {
          inputRef.current[xCoordinate - 1].focus();
          editInputs(xCoordinate, '');
        }
      }
    } else {
      const regMatch = inputKey.length === 1 && /[a-zA-Z]/.test(inputKey);

      const count = inputs.letters[row].reduce((total, letter) => {
        if (letter.val) {
          total += 1;
        }
        return total;
      }, 0);

      if (regMatch && count < 5) {
        for (let i = 0; i < 5; i++) {
          if (inputRef.current[i] === focusedElement) {
            editInputs(i + 1, inputKey);
            if (i < 4) {
              inputRef.current[i + 1].focus();
            }
          }
        }
      }
    }
  };

  // generates all unique letters, and their respective no. of occurrences for the correct word
  const getArrs = () => {
    const wordSet = new Set(correctWord);
    let wordArr = Array.from(wordSet);
    let countArr = [];
    for (let i = 0; i < wordArr.length; i++) {
      let count = 0;
      for (let j = 0; j < correctWord.length; j++) {
        if (wordArr[i] === correctWord[j]) {
          count += 1;
        }
      }
      countArr.push(count);
    }
    return { wordArr, countArr };
  };

  //edit box colors upon successful input validation, and using getArrs() to determine which letter should be colored what
  const editBoxColor = () => {
    setInputs((inputs) => {
      const editedLetters = inputs.letters.map((letter, index) => {
        if (index === row) {
          //trackArr tracks all letters in input
          let trackArr = [];

          const { wordArr, countArr } = getArrs();

          // push values into trackArr

          for (let i = 0; i < letter.length; i++) {
            trackArr.push(letter[i].val);
          }

          // get index of each item (e.g.r=1,r=2,r=3) by counting the number of previous items
          let countArr2 = [];
          for (let i = 0; i < trackArr.length; i++) {
            let prevCount = 1;
            for (let j = 0; j < i; j++) {
              if (trackArr[i] === trackArr[j]) {
                prevCount += 1;
              }
            }
            countArr2.push(prevCount);
          }

          // total instances of the letter occuring in the word, excluding correctly matched.
          for (let i = 0; i < trackArr.length; i++) {
            if (trackArr[i] === correctWord[i]) {
              for (let j = 0; j < wordArr.length; j++) {
                if (wordArr[j] === trackArr[i]) {
                  countArr[j] -= 1;
                }
              }
            }
          }

          const editedItems = letter.map((item, index) => {
            const { val } = item;

            if (val === correctWord[index]) {
              return { ...item, color: 'green' };
            } else {
              for (let i = 0; i < wordArr.length; i++) {
                if (wordArr[i] === val) {
                  //check if index (1,2,3...) of item <= no. of total occurrences of letter in word excluding correctly matched ones
                  if (countArr2[index] <= countArr[i]) {
                    return { ...item, color: 'orange' };
                  }
                }
              }
              return { ...item, color: 'gray' };
            }
          });
          return editedItems;
        }
        return letter;
      });
      return { ...inputs, letters: editedLetters };
    });
    //to set keyboard colors:
    setBoxColorEdited(true);
  };

  //when CheckAns is set to true
  useEffect(() => {
    editBoxColor();
    if (checkAns) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          rotateRef.current[i].className = 'box-inner rotate';
        }, 300 + i * 300);
        if (i === 4 && row < 5) {
          setTimeout(() => {
            if (!isGuessCorrect) {
              setRow(row + 1);
            }
            setCheckAns(false);
            //400 + 300*4 + 300(half duration of rotation)
          }, 1900);
        }
      }
    }
  }, [checkAns]);

  //display answer after 6 tries
  //shows option to restart
  useEffect(() => {
    if (guessCount === 6) {
      setTimeout(() => {
        const message = document.createElement('div');
        message.className = 'modal';
        message.textContent = correctWord;
        modalContainer.append(message);
        document.querySelector('.restart-icon').classList.add('show');
      }, 2100);
    }
  }, [guessCount]);

  useEffect(() => {
    if (isGuessCorrect) {
      setTimeout(() => {
        const message = document.createElement('div');
        message.className = 'modal';
        message.textContent = 'SPLENDID';
        modalContainer.append(message);
        document.querySelector('.restart-icon').classList.add('show');
      }, 2100);
    }
  }, [isGuessCorrect]);

  const handleRestartClick = () => {
    getCorrectWord();
    setRow(0);
    setCheckAns(false);
    setGuessCount(0);
    setInputs(defaultInputs);
    document.querySelector('.restart-icon').classList.remove('show');
    modalContainer.innerHTML = '';
    document.querySelectorAll('.key').forEach((el) => (el.className = 'key'));
    setIsGuessCorrect(false);
  };

  //handle how error messages are displayed in the modal. will not run on first render
  useEffect(() => {
    if (ref.current) {
      let timer = setTimeout(() => {
        let index = 0;
        for (let msg of [...modalContainer.children].reverse()) {
          index++;
          setTimeout(() => {
            msg.classList.add('fade');
            //remove only after 100ms once the fade animation completes
            setTimeout(() => {
              modalContainer.removeChild(msg);
            }, 100);
          }, 100 + index * 100);
        }
      }, 400);

      return () => clearTimeout(timer);
    }
    ref.current = 1;
  }, [errorCount]);

  return (
    <AppContext.Provider
      value={{
        inputs,
        row,
        checkAns,
        inputRef,
        setFocusedElement,
        boxColorEdited,
        setBoxColorEdited,
        guessCount,
        rotateRef,
        iconModal,
        setIconModal,
        handleKeyPress,
        handleRestartClick,
        isGuessCorrect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
