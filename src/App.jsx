import { useState } from 'react'
import './App.css'
import variant2 from './assets/variant2.svg'
import variant3 from './assets/variant3.svg'
import variant4 from './assets/variant4.svg'
import variant5 from './assets/variant5.svg'
import variant6 from './assets/variant6.svg'
import variant7 from './assets/variant7.svg'
import variant9 from './assets/variant9.svg'

function App() {
  const [allPages, setAllPages] = useState({
    id: 'all',
    label: 'All pages',
    persistentChecked: false,
    cycleState: 0
  })

  const [pages, setPages] = useState([
    { id: 'page1', label: 'Page 1', persistentChecked: false, cycleState: 0 },
    { id: 'page2', label: 'Page 2', persistentChecked: false, cycleState: 0 },
    { id: 'page3', label: 'Page 3', persistentChecked: false, cycleState: 0 },
    { id: 'page4', label: 'Page 4', persistentChecked: false, cycleState: 0 },
    { id: 'page5', label: 'Page 5', persistentChecked: false, cycleState: 0 },
    { id: 'page6', label: 'Page 6', persistentChecked: false, cycleState: 0 },
    { id: 'page7', label: 'Page 7', persistentChecked: false, cycleState: 0 },
  ])

  const [hoveredId, setHoveredId] = useState(null)
  const [checkboxHoveredId, setCheckboxHoveredId] = useState(null)
  const [pressedId, setPressedId] = useState(null)
  const [justClickedId, setJustClickedId] = useState(null)

  const handleLabelClick = (id) => {
    if (id === 'all') {
      setAllPages({ ...allPages, persistentChecked: !allPages.persistentChecked, checkboxToggled: false })
    } else {
      setPages(pages.map(page => 
        page.id === id 
          ? { ...page, persistentChecked: !page.persistentChecked, checkboxToggled: false }
          : page
      ))
    }
  }

  const handleCheckboxClick = (id) => {
    setJustClickedId(id)
    if (id === 'all') {
      // Cycle through states: 0 → 1 → 2 → 3 → 4 → 0
      const nextState = (allPages.cycleState + 1) % 5
      setAllPages({ ...allPages, cycleState: nextState })
    } else {
      setPages(pages.map(page => {
        if (page.id === id) {
          const nextState = (page.cycleState + 1) % 5
          return { ...page, cycleState: nextState }
        }
        return page
      }))
    }
  }

  const getCheckboxVariant = (item, isHovered, isCheckboxHovered, isPressed, isJustClicked) => {
    const { persistentChecked, cycleState } = item

    if (persistentChecked) {
      if (isPressed) return variant7
      if (isHovered) return variant6
      return variant5
    }

    switch (cycleState) {
      case 0:
        if (isPressed) return variant3
        if (isHovered || isCheckboxHovered) return variant2
        return null

      case 1:
        if (isPressed) return variant7 
        if (isCheckboxHovered) return variant4  
        if (isHovered) return variant5 
        return null

      case 2:
        if (isHovered) return variant9 
        return null 

      case 3:
        if (isPressed) return variant3  
        if (isHovered) return variant9 
        return variant5 

      case 4:
        if (isPressed) return variant3 
        if (isHovered) return variant9
        return null

      default:
        return null
    }
  }

  const renderCheckboxItem = (item) => {
    const isHovered = hoveredId === item.id
    const isCheckboxHovered = checkboxHoveredId === item.id
    const isPressed = pressedId === item.id
    const isJustClicked = justClickedId === item.id
    const checkboxSrc = getCheckboxVariant(item, isHovered, isCheckboxHovered, isPressed, isJustClicked)

    return (
      <div
        key={item.id}
        className="checkbox-item"
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => {
          setHoveredId(null)
          setCheckboxHoveredId(null)
          setPressedId(null)
          setJustClickedId(null)
        }}
      >
        <span 
          className="label"
          onMouseDown={(e) => {
            console.log('Label MouseDown')
            setPressedId(item.id)
          }}
          onMouseUp={() => {
            console.log('Label MouseUp')
            setPressedId(null)
          }}
          onClick={() => handleLabelClick(item.id)}
        >
          {item.label}
        </span>
        <div 
          className="checkbox-wrapper"
          onMouseEnter={() => setCheckboxHoveredId(item.id)}
          onMouseLeave={() => setCheckboxHoveredId(null)}
          onMouseDown={(e) => {
            console.log('Checkbox MouseDown')
            setPressedId(item.id)
          }}
          onMouseUp={() => {
            console.log('Checkbox MouseUp')
            setPressedId(null)
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleCheckboxClick(item.id)
          }}
        >
          {checkboxSrc ? (
            <img src={checkboxSrc} alt="checkbox" className="checkbox-svg" />
          ) : (
            <div className="checkbox-default"></div>
          )}
        </div>
      </div>
    )
  }

  const handleDone = () => {
    const selectedPages = pages.filter(page => page.persistentChecked)
    const allPagesSelected = allPages.persistentChecked
    console.log('All pages selected:', allPagesSelected)
    console.log('Selected pages:', selectedPages.map(page => page.label))
  }

  return (
    <div className="app">
      <div className="modal">
        {/* All Pages */}
        <div className="all-pages-section">
          {renderCheckboxItem(allPages)}
        </div>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
        </div>

        {/* Pages */}
        <div className="pages-section">
          {pages.map(page => renderCheckboxItem(page))}
        </div>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
        </div>

        <div className="done-section">
          <button className="done-button" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
