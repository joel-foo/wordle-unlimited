import Row from './Row';

const Board = () => {
  return (
    <section className='grid'>
      {[...Array(6)].map((e, index) => {
        return <Row key={index} n={index} />;
      })}
    </section>
  );
};

/*Note: 
Array(6) gives [empty * 6],
but [...Array(6)] gives
[0: undefined
1: undefined
2: undefined
3: undefined
4: undefined
5: undefined]
*/

export default Board;
