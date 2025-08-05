import {useState} from 'react'
const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}
const Part = (props) => (
  <p>{props.name} {props.exercises}</p>
);

const Content = (props) => {
  return (
    <>
      {props.parts.map((part, i) => (
        <Part key={i} name={part.name} exercises={part.exercises} />
      ))}
    </>
  )
}

const Total = (props) => {
  // using reduce instead of manually adding exercises
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>Number of exercises {total}</p>
  )
}


const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => { 
    setAll(allClicks.concat('L')); 
    setLeft(left + 1);  
  }
  
  const handleRightClick = () => { 
    setAll(allClicks.concat('R')); 
    setRight(right + 1);  
  }


  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
      {left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
      {right}
        <p>{allClicks.join(' ')}</p>
    </div>
  )
}

export default App
