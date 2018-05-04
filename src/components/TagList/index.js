/*@使用说明

  width={200}
  height={589}
  store={store}
  onRemoved={this.onRemoved}
  onSelected={this.onSelected}
  //开启筛选
  search={true}
  //开启排序
  arrow={true}
  //开启追加
  plus={true|top}
  onAdd={this.onAdd}
*/

import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Tag, Input, Tooltip, Icon, Modal, Pagination, Button } from 'antd'
import css from './index.scss'
const confirm = Modal.confirm
const Search = Input.Search

function onOverflowContainer(container, element, direction) {
  if (container.scrollHeight === container.clientHeight) {
    return
  }
  const offsetBox = container.getBoundingClientRect().top
  const box = element.getBoundingClientRect()
  const containerHeight = container.clientHeight
  const elementHeight = element.offsetHeight
  let scrollUp = box.top - offsetBox - elementHeight // (box.top < offsetBox)
  let scrollDown = box.bottom - containerHeight - offsetBox + elementHeight// (box.bottom > containerHeight + offsetBox)

  if (direction === 'up' && scrollUp < 0) {
    container.scrollTop += scrollUp
  }

  if (direction === 'down' && scrollDown > 0) {
    container.scrollTop += scrollDown
  }
}

@observer
class MyTag extends Component {

  onClick = (e) => {
    this.props.onClick(this.props.val)
  }
  onClose = (e) => {
    this.props.icon.event(this.props.val)
    e.stopPropagation()
  }
  componentWillUpdate(nextProps) {
    if (nextProps.highLight) {
      this.tag.scrollIntoViewIfNeeded(false)
    }
  }
  render() {
    let props = this.props
    let type = props.icon.type || 'close'
    let highLight = props.highLight ? css['tag-selected'] : ""
    let icon = {
      'plus': {
        className: [css['my-tag'], css['tag-action']].join(' '),
        node: (<Icon type="plus" className={css['icon-action']} />)
      },
      'close': {
        className: [css['my-tag'], highLight].join(' '),
        node: (<Icon type="close" className={css['icon-action']} onClick={this.onClose} />)
      }
    }

    return (
      <div
        ref={(tag)=>{this.tag = tag}}
        type={type}
        className={icon[type].className}
        onClick={this.onClick}
      >
        { props.children }
        { icon[type].node }
      </div>
    )
  }
}

@observer
export default class TagList extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
    selectedValue:''
  };

  handleClose = (removedTag) => {
    confirm({
      title: '提示！',
      content: '确认要删除吗？',
      cancelText: '否',
      okText: '是',
      onOk: () => {
        let val = this.searchInput.input.input.value
        this.props.store.removeData(removedTag)
        this.props.onRemoved(removedTag)
        if(val) {
          this.props.store.searchData(val)
        }
      }
    });
  }

  handleSelected = (val) => {
    this.setState({selectedValue: val}, () => {
      this.props.onSelected(this.state.selectedValue)
    })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const inputValue = this.state.inputValue;
    let data = this.props.store.list;
    if (inputValue && data.indexOf(inputValue) === -1) {
      this.props.onAdd(inputValue)
      this.props.store.addData(inputValue)
    }

    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  }

  handleInputSearch = (e) => {
    this.props.store.searchData(e.target.value)
  }

  handleArrow = (direction) => {
    this.state.selectedValue && this.props.store.sortData(this.state.selectedValue, direction)
  }

  initTop() {
    let { search, arrow, plus } = this.props
    let arr = []
    if(search) {
      arr.push(
        <Search
          key='search'
          ref={this.searchInputRef}
          placeholder="输入关键词"
          onChange={this.handleInputSearch}
          style={{ width: 200 }}
        />
      )
    }
    if (arrow) {
      arr.push(
        <Tooltip title="选中任务点击向上移动" key='arrowup'>
          <Button icon="arrow-up" className={css.arrow} onClick={() => this.handleArrow('up')} />
        </Tooltip>
      )
      arr.push(
        <Tooltip title="选中任务点击向下移动" key='arrowdown'>
          <Button icon="arrow-down" className={css.arrow} onClick={() => this.handleArrow('down')} />
        </Tooltip>
      )
    }
    if (plus === 'top') {
      arr.push(
        <Tooltip title="新建" key='create'>
          <Button icon="plus" style={{ marginLeft: 2 }} onClick={() => this.props.onAdd()} />
        </Tooltip>
      )
    }
    return arr
  }

  initBottom() {
    let { inputVisible, inputValue } = this.state
    let { plus } = this.props
    if(plus === 'bottom') {
      if(inputVisible) {
      return (
          <Input
            ref={this.saveInputRef}
            type="text"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )
      }
      if(!inputVisible) {
      return (
          <MyTag
            icon={{ type: 'plus' }}
            onClick={this.showInput}
          > 添加 </MyTag>
        )
      }
    }
  }
  searchInputRef = input => this.searchInput = input
  saveInputRef = input => this.input = input
  render() {
    const { selectedValue } = this.state
    const { width, height, store} = this.props
    return (
      <div>
        <div style={{ width }} className={css['search-box']}>
          { this.initTop() }
        </div>
        <div className={css.box} style={{ width, height }} ref={this.boxRef}>
          {store.list.map((val, index) => {
            const isLongVal = val.length > 20;
            const tagElem = (
              <MyTag
                key={index}
                icon={{
                  type: 'close',
                  event: this.handleClose
                }}
                highLight={selectedValue === val}
                val={val}
                onClick = {this.handleSelected}
              >
                {isLongVal ? `${val.slice(0, 20)}...` : val}
              </MyTag>
            );
            return  isLongVal ? <Tooltip title={val} key={index}>{tagElem}</Tooltip> : tagElem;
          })}
          { this.initBottom() }
        </div>
      </div>
    );
  }
}

