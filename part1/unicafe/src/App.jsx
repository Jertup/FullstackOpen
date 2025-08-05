import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
);

const Feedback = (props) => {
  return (
    <>
      <Button onClick={() => props.setGood(good => good + 1)} text="good" />
      <Button onClick={() => props.setNeutral(neutral => neutral + 1)} text="neutral" />
      <Button onClick={() => props.setBad(bad => bad + 1)} text="bad" />
    </>
  )
}

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Stats = (props) => {
  const total = props.good + props.neutral + props.bad;
  // good=1, neutral=0, bad=-1
  const scoreSum = props.good * 1 + props.neutral * 0 + props.bad * -1;
  const average = total === 0 ? 0 : scoreSum / total;
  return (
    <>
      <h2>Statistics</h2>
      {total === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <StatisticLine text="Good" value={props.good} />
            <StatisticLine text="Neutral" value={props.neutral} />
            <StatisticLine text="Bad" value={props.bad} />
            <StatisticLine text="Total" value={total} />
            <StatisticLine text="Average" value={average.toFixed(1)} />
            <StatisticLine text="Positive" value={(props.good / total * 100).toFixed(1) + ' %'} />
          </tbody>
        </table>
      )}
    </>
  )
}
function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
      <Feedback
        setGood={setGood}
        setNeutral={setNeutral}
        setBad={setBad}
      />
      <Stats good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App
