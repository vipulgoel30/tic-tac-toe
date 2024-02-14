const Log = ({ logs }) => {
  return (
    <ol id="log">
      {logs.map(({ square: { row, col }, player }) => (
        <li
          key={`{${row} + ${col}`}
        >{`${player} selected [${row}, ${col}]`}</li>
      ))}
    </ol>
  );
};

export default Log;
