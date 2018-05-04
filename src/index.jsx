import React from 'react'
import { render } from 'react-dom'
import TagList from './components/TagList'
import css from './index.scss'
import store from './store/state-task.js'

let onSelected = (tag) => {
  console.log(tag)
}

let onRemoved = (tag) => {
  console.log(tag)
}

let onAdd = (tag) => {
  console.log(tag)
}

render(
  <TagList
    width={200}
    height={589}
    store={store}
    onRemoved={onRemoved}
    onSelected={onSelected}
    onAdd={onAdd}
    search={true}
    arrow={true}
    plus='bottom'
  />,
  document.getElementById('root')
)
