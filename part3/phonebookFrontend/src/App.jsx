
import { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

  const Filter = ({ filter, onChange }) => (
    <div>
      <span>Filter shown with </span>
      <input 
        value={filter}
        onChange={onChange}
      />
    </div>
  )

  const PersonForm = ({ onSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => (
    <form onSubmit={onSubmit}>
      <div>
        <h2>Add a new user</h2>
        name: <input 
          value={newName}
          onChange={handleNameChange}
        /> <br />
        number: <input 
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )

  const Persons = ({ persons, handleDelete }) => (
    <ul>
      {persons.map((person, i) => (
        <li key={i}>{person.name}  {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button></li>
      ))}
    </ul>
  )

  const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
    return (
      <div className={type === 'error' ? 'error' : 'message'}>
        {message}
      </div>
    )
  }

  const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState()
    const [messageType, setMessageType] = useState('message')

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

    const hook = () => {
      console.log('effect')
      personsService
        .getAll()
        .then(data => {
          console.log('promise fulfilled')
          setPersons(data)
        })
    }

  useEffect(hook, [])

    const addPerson = (event) => {
      event.preventDefault();
      if (newName.trim() === '' && newNumber.trim() === '') {
        alert('Please enter a name and a number.');
        return;
      }

      const existingPerson = persons.find(person => person.name === newName);
      if (existingPerson) {
        if (window.confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`)) {
          const updatedPerson = { ...existingPerson, number: newNumber };
          personsService
            .update(existingPerson.id, updatedPerson)
            .then(data => {
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : data));
              setMessage(`Updated ${data.name}`);
              setMessageType('message');
              setTimeout(() => setMessage(null), 3000);
              setNewName('');
              setNewNumber('');
            })
            .catch(error => {
              setMessageType('error');
              if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
              } else {
                setMessage(`Information of ${existingPerson.name} has already been deleted from server`);
              }
              setTimeout(() => setMessage(null), 5000);
              setPersons(persons.filter(person => person.id !== existingPerson.id));
            });
        }
        return;
      }

      if (persons.some(person => person.number === newNumber)) {
        setMessageType('error');
        setMessage(`${newNumber} is already added to phonebook`);
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const newPerson = { name: newName, number: newNumber };
      personsService
        .create(newPerson)
        .then(data => {
          setPersons(persons.concat(data));
          setMessage(`Added ${data.name}`);
          setMessageType('message');
          setTimeout(() => setMessage(null), 3000);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setMessageType('error');
          if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
          } else {
            setMessage('An unexpected error occurred');
          }
          setTimeout(() => setMessage(null), 5000);
        });
    }
    const handleDelete = (id) => {
      const person = persons.find(p => p.id === id);
      if (!window.confirm(`Are you sure you want to delete ${person ? person.name : 'this person'}?`)) {
        return;
      }
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
    }

    return (
      <div>
        <h2>Phonebook</h2>
        {message && <Notification message={message} type={messageType} />}
        <Filter filter={filter} onChange={e => setFilter(e.target.value)} />
        <PersonForm 
          onSubmit={addPerson}
          newName={newName}
          handleNameChange={e => setNewName(e.target.value)}
          newNumber={newNumber}
          handleNumberChange={e => setNewNumber(e.target.value)}
        />
        <h2>Numbers</h2>
        <Persons persons={filteredPersons} handleDelete={handleDelete} />
      </div>
    )
  }

export default App