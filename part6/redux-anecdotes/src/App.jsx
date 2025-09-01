import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {

  const dispatch = useDispatch()


  return (
    <div>
    <AnecdoteList dispatch={dispatch} />
    <AnecdoteForm dispatch={dispatch} />
    </div>
  )
}

export default App