import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteFilter from './components/AnecdoteFilter'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'

const App = () => {
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1
  })

  if (result.isLoading) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return (
      <div>
        Anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data
  return (
    <div>
    <h2>Anecdotes</h2>
    <Notification />
    <AnecdoteFilter  />
    <AnecdoteList anecdotes={anecdotes} />
    <AnecdoteForm  />
    </div>
  )
}

export default App