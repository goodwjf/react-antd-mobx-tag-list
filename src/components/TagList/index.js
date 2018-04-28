/*@使用说明

  // 基本设置
  width = { number }
  height = { number }
  data = { array }
  onRemoved = { function }
  removeData = { mobx.action }
  onSelected = { function }
  
  // 本地查询
  searchVisible = { Boolean }
  searchData = { mobx.action }

  // 尾部追加数据
  plus = { Boolean }
  plusName = 'string'
  addData = { mobx.action }
  onAdd = { function }
  
  // 数据项上下移动
  arrow = { Boolean }
  sortData = { mobx.action } 
*/

import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Tag, Input, Tooltip, Icon, Modal, Pagination, Button } from 'antd';
import css from './index.scss'
const confirm = Modal.confirm;
const Search = Input.Search;

@observer
class MyTag extends Component {

  render() {
    let props = this.props
    let type = props.icon.type || 'close'
    let icon = {
      'plus': {
        className: [css['my-tag'], css['tag-action']].join(' '),
        node: (<Icon type="plus" className={css['icon-action']} />)
      },
      'close': {
        className: [css['my-tag']].join(' '),
        node: (<Icon type="close" className={css['icon-action']} onClick={props.icon.event} />)
      }
    }
    
    return (
      <div
      type={type}
      data-val={props.val}
      data-index={props.index}
      className={icon[type].className}
      onClick={props.onClick}
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
  };

  componentDidMount() {
    this.setState({ tags: this.props.data })
  }

  handleClose = (e) => {
    let removedTag = e.target.parentNode.textContent
    confirm({
      title: '提示！',
      content: '确认要删除吗？',
      cancelText: '否',
      okText: '是',
      onOk: () => {
        // const data = this.state.data.filter(tag => tag !== removedTag);
        this.selectedTagNode && this.selectedTagNode.classList.add(css['tag-selected'])
        this.props.removeData(removedTag)
        this.props.onRemoved(removedTag, this.props.data)
      }
    });
    e.stopPropagation();
  }

  handleSelected = (e) => {
    if (this.selectedTagNode) {
      this.selectedTagNode.classList.remove(css['tag-selected'])
    }
    this.selectedTagNode = e.target
    this.selectedTagNode.classList.add(css['tag-selected'])
    this.props.onSelected(this.selectedTagNode.textContent)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const inputValue = this.state.inputValue;
    let data = this.props.data;
    if (inputValue && data.indexOf(inputValue) === -1) {
      this.props.addData(inputValue)
      this.props.onAdd(inputValue, this.props.data)
    }

    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  }

  handleInputSearch = (e) => {
    let val = e.target.value
    this.props.searchData && this.props.searchData(val)
  }

  handleArrow = (direction) => {
    this.props.sortData(this.selectedTagNode.textContent, direction)
  }

  searchInputRef = input => this.searchInput = input
  saveInputRef = input => this.input = input

  render() {
    const { inputVisible, inputValue } = this.state
    const { width, height, plusName, searchVisible, data, plus, arrow } = this.props
    return (
      <div>
        {searchVisible && (
        <div style={{ width }} className={css['search-box']}>
            <Search
              ref={this.searchInputRef}
              placeholder="输入关键词"
              onChange={this.handleInputSearch}
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
              size="small"
            />
         
            {arrow && (<Button icon="arrow-up" size="small" className={css.arrow} onClick={() => this.handleArrow('up')}/>)}
            {arrow && (<Button icon="arrow-down" size="small" className={css.arrow} onClick={() => this.handleArrow('down')}/>)}
    
        </div>
        )}
        <div className={css.box} style={{width, height}}>
          {data.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <MyTag 
                key={tag}
                icon={{
                  type: 'close',
                  event: this.handleClose
                }}
                index={index}
                val={tag}
                onClick = {this.handleSelected}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </MyTag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {plus && inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {plus && !inputVisible && (
            <MyTag
              icon={{
                type:'plus'
              }}
              onClick={this.showInput}
            >
              {plusName}
            </MyTag>
          )}
        </div>
      </div>
    );
  }
}

