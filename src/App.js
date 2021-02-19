import {useEffect, useState} from 'react';
import './App.css';

function useIncrement(initialValue = 0, step =1){
  const [count, setCount] = useState(initialValue)

  const increment = () => {
    setCount( prevCount => prevCount + 1)
  }

  return [ 
    count,
    increment
  ]
}

function useAutoIncrement(initialValue = 0, step = 1){

  const [autoCount, setAutoCount] = useState(0)

  useEffect(()=>{
    const timer = window.setInterval(function(){
              setAutoCount( prevAutoCount => prevAutoCount + 1 )
      }, 1000)

      return function() {
        clearInterval(timer)
      } 
  }, [])
    return autoCount


}

function useDisplayCompteur(showCompteur = true){
  const [isCompteurVisible, setCompteur] = useState(showCompteur)

  const displayCompteur = () => {
    setCompteur( prevIsCompteurVisible => !prevIsCompteurVisible )
  }

  return [
    isCompteurVisible,
    displayCompteur
  ]
}

function useFetch(url){
  const [state, setState] = useState({
    items: [],
    loading: true
  })

  useEffect(function() {
    (async function() {
        const response = await fetch(url)
        const responseData = await response.json()
        if (response.ok) {
          setState({
            items: responseData,
            loading: false
          })
        } else {
          alert(JSON.stringify(responseData))
          setState(state => ({...state, loading: false}))
        }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [
    state.loading,
    state.items
  ]

}

function PostTable() {
  const [loading, items] = useFetch ('https://jsonplaceholder.typicode.com/comments?_limit=5')

  if (loading) {
    return (
      <p>Loading...</p>
    )
  } 

  return (
    <>
      {items.map(post => {
        return (
          <div key={post.id}>
            <h4>{post.name} by <span>{post.email}</span></h4>       
            <p>{post.body}</p>
          </div>
        )
      })
      }
    </>
  )
}


function App() {

  const [count, increment] = useIncrement(0)
  const autoCount = useAutoIncrement(10)
  const [isCompteurVisible, displayCompteur] = useDisplayCompteur(true)


  return (
    <>
      <label>
        Afficher le compteur
        <input type="checkbox" onChange={displayCompteur} checked={isCompteurVisible}></input>
      </label>

      {isCompteurVisible ? 
        <div>
          <h1>{count}</h1>
          <button onClick={increment}>Incrémenter</button>
          <p>Autocount : {autoCount}</p>
          <button>Launch Autocount</button>
        </div>
      : null
      }
      <PostTable />
    </>
  )
}

export default App;
