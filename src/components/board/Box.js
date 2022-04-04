import { useGlobalContext } from '../../context';

const Box = ({ n, i }) => {
  const { inputs, row, checkAns, rotateRef } = useGlobalContext();

  const { boxValue, boxColor } = inputs.letters[n].reduce(
    (properties, letter) => {
      const { x, val, color } = letter;
      if (x === i + 1) {
        properties.boxValue = val;
        properties.boxColor = color;
      }
      return properties;
    },
    {
      boxValue: 0,
      boxColor: null,
    }
  );

  if (n < row) {
    return (
      <div className='box-overlay show'>
        <div className='box-inner rotate'>
          <div className='box-card-front'>{boxValue}</div>
          <div className={`box-card-back ${boxColor}`}>{boxValue}</div>
        </div>
      </div>
    );
  } else if (n === row) {
    return (
      <div className={checkAns ? 'box-overlay show' : 'box-overlay'}>
        <div className='box-inner' ref={(el) => (rotateRef.current[i] = el)}>
          <div className='box-card-front'>{boxValue}</div>
          <div
            className={checkAns ? `box-card-back ${boxColor}` : 'box-card-back'}
          >
            {boxValue}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='box-overlay'>
        <div className='box-inner'>
          <div className='box-card-front'>{boxValue}</div>
          <div className='box-card-back'>{boxValue}</div>
        </div>
      </div>
    );
  }
};

export default Box;
