import { useSelector } from 'react-redux'
import { useNotification } from '../contexts/NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../../services/anecdotes'

const AnecdoteList = ({ anecdotes }) => {
  const filter = useSelector(state => state.filter)
  const { setNotification } = useNotification()
  const queryClient = useQueryClient()
  
  const voteMutation = useMutation({
    mutationFn: ({ id, updatedAnecdote }) => anecdoteService.update(id, updatedAnecdote),
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      ))
    }
  })
  
  const filteredAnecdotes = anecdotes
    .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)
  
  const vote = (id) => {
    const anecdote = anecdotes.find(a => a.id === id)
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    voteMutation.mutate({ id, updatedAnecdote })
    setNotification(`you voted '${anecdote.content}'`, 5000)
  }

  return (
    <>
      <h2>Anecdotes</h2>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList