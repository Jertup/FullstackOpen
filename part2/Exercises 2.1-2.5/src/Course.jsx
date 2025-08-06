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
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p><b>Number of exercises in total {total}</b></p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}


export default Course;
