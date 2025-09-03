import { useNotification } from '../contexts/NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../../services/anecdotes'

const AnecdoteForm = () => {
  const { setNotification } = useNotification()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      setNotification(`you created '${newAnecdote.content}'`, 5000)
    }
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    if (content.length < 5) {
      setNotification('Anecdote must be at least 5 characters long', 5000)
      return
    }
    
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm