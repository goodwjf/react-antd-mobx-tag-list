import { getTaskList } from '../common/request-test.js'

import { observable, action, runInAction, autorun } from 'mobx'
class State {
  @observable tasks = []
  @observable list = []
  constructor() {
    this.loadData()
  }

  updateList() {
    this.list.replace(this.tasks)
  }

  @action.bound
  sortData(dataItem, direction) {
    let arr = this.tasks
    let index = arr.findIndex((item)=>{
      return item === dataItem
    })
    let config = {
      up() {
        if (index !== 0) {
          arr[index] = arr.splice(index - 1, 1, arr[index])[0]
        }
      },
      down() {
        if (index !== arr.length - 1) {
          arr[index] = arr.splice(index + 1, 1, arr[index])[0]
        }
      }
    }
    config[direction]()
    // @todo移动接口
    this.updateList()
  }

  @action.bound
  addData(dataItem) {
    this.tasks.push(dataItem)
    this.updateList()
    // @todo添加接口
  }

  @action.bound
  searchData(val) {
    let search = this.tasks.filter((item) => {
      return item.indexOf(val) !== -1
    })
    this.list.replace(search)
  }

  @action.bound
  removeData(dataItem) {
    this.tasks.remove(dataItem)
    this.updateList()
    // @todo 删除接口
  }

  @action.bound
  loadData() {
    getTaskList().then((res) => {
      runInAction(() => {
        this.tasks.replace(res.tasks)
        this.updateList()
      })
    })
  }
}

const state = new State()
export default state