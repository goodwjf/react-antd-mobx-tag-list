import React from 'react'
import { render } from 'react-dom'
import TagList from './components/TagList'
import css from './index.scss'
import store from './store/state-task.js'

let selected = (tag) => {
  console.log(tag)
}

let removed = (tag, tags) => {
  console.log(tag, tags)
}

let add = (tag, tags) => {
  console.log(tag, tags)
}

render(
  <TagList
    width={200}
    height={500}
    data={store.list}
    onRemoved={removed}
    removeData={store.removeData}
    onSelected={selected}
    searchVisible={false}
    searchData={store.searchData}
    plus={true}
    plusName='添加任务'
    addData={store.addData}
    onAdd={add}
    arrow={false}
    sortData={store.sortData}
  />,
  document.getElementById('root')
)
