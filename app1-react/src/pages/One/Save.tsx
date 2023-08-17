import React, { useRef, useState, useEffect } from 'react'
import { useSprings, animated, interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import { useHistory } from 'react-router-dom';
import clamp from 'lodash.clamp'
import './styles.css'
import {Button} from 'antd'
import { commonUtil } from 'qiankun-common';

const itemSize = { width: 200, height: 50, margin: 10 }
const columnNum = 3
const itemTotalWidth = itemSize.width + itemSize.margin * 2
const itemTotalHeight = itemSize.height + itemSize.margin * 2

function swap(arr, fromIndex, toIndex) {
  if (!Array.isArray(arr)) throw new Error('The first argument must be an array.')
  if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') throw new Error('The second and third arguments must be numbers.')

  let newArr = [...arr]
  let element = newArr[fromIndex]
  newArr.splice(fromIndex, 1)
  newArr.splice(toIndex, 0, element)

  return newArr
}

const fn = (order, down, originalIndex, curIndex, x, y) => (index) => {
  return down && index === originalIndex
    ? {
      x: x - itemSize.margin,
      y: y - itemSize.margin,
      scale: 1.1,
      zIndex: 1,
      shadow: 15,
      immediate: (key) => key === 'x' || key === 'y' || key === 'zIndex',
    }
    : {
      x: (order.indexOf(index) % columnNum) * itemTotalWidth,
      y: Math.floor(order.indexOf(index) / columnNum) * itemTotalHeight,
      scale: 1,
      zIndex: 0,
      shadow: 1,
      immediate: false,
    }
}

function DraggableList({ items}) {
  let history = useHistory();
  const order = useRef(items.map((_, index) => index))
  const [delta, setDelta] = useState([0, 0])
  const [springs, api] = useSprings(items.length, fn(order.current, false, 0, 0, 0, 0))
  const bind = useDrag(({ args: [originalIndex], down, movement: [mx, my], first}) => {
    const curIndex = order.current.indexOf(originalIndex)
    const itemX = (curIndex % columnNum) * itemTotalWidth
    const itemY = Math.floor(curIndex / columnNum) * itemTotalHeight

    if (first) {
      setDelta([mx - itemX, my - itemY])
    }

    const [dx, dy] = delta
    const newX = down ? mx - dx : itemX
    const newY = down ? my - dy : itemY

    const curRow = Math.round(newY / itemTotalHeight)
    const curCol = Math.round(newX / itemTotalWidth)
    const newIndex = clamp(curRow * columnNum + curCol, 0, items.length - 1)

    const newOrder = swap(order.current, curIndex, newIndex)
    order.current = newOrder

    api.start(fn(order.current, down, originalIndex, curIndex, newX, newY))
  },
  {delay: 200,
  }
  )

  const navigateToPageFour = (item) => {
    console.log(item)
    history.push('./childOneMenu/pageFour', { param1: item });
  };

  useEffect(() => {
    order.current = items.map((_, index) => index)
    api.start(fn(order.current, false, 0, 0, 0, 0))
  }, [items, api])


  return (
    <div className="content">
      {springs.map(({ zIndex, shadow, x, y, scale }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          className="item"
          onDoubleClick={() => navigateToPageFour(items[i])}
          style={{
            zIndex,
            boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            transform: interpolate([x, y, scale], (x, y, scale) => `translate3d(${x}px, ${y}px, 0) scale(${scale})`),
          }}
        >
          {items[i]}
        </animated.div>
      ))}
    </div>
  )
}

const data = [
  'Computer',
  'Biology',
  'Chemistry',
  'Physics',
  'Social Sciences',
  'Psychology',
  'Economics',
  'Literature',
  'History',
]
export default function Save() {
  const [items, setItems] = useState(JSON.parse(localStorage.getItem("items")) || [])

  const [value,setValue] = useState("")
  const handleAddItem = () => {
    setItems([...data, value])
     localStorage.setItem("items",JSON.stringify([...data, value]))
  }


  return (
    <div className="container">
      <div className="bg">
        <div style={{marginLeft:"30%",marginTop:"45%"}}>
          <h4 style={{marginLeft:"-5%"}}>Tab Name:<input style={{width:"68%",height:"130%",marginLeft:"-5%",marginTop:"-10%"}} value={value} onChange={(e) => setValue(e.target.value)}/></h4>
          <Button onClick={handleAddItem} style={{marginTop:"5%",marginLeft:"-16px",background:"#3097F1",borderColor:"#3097F1",color:"white",width:"70%"}}>Add New Item</Button>
        </div>
      </div>
      <DraggableList items={items}/>
    </div>
  )
}
