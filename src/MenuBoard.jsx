import { useEffect, useState } from 'react'

const sandwiches = [
  ['Hamburger', '8.95', '7.45', 'Grilled to order with mayo, lettuce, tomato & onion on a sesame seed roll.'],
  ['Cheeseburger', '9.45', '7.75', 'Mayo, cheese, lettuce, tomato & onion on a sesame seed roll.'],
  ['Bacon Cheeseburger', '9.95', '8.75', 'Mayo, bacon, cheese, lettuce, tomato & onion on a sesame seed roll.'],
  ['Double Decker', '12.49', '10.99', 'Two patties, American cheese, mayo, lettuce, tomato & onion.'],
  ['Turkey Burger', '9.95', '7.95', 'Seasoned third-pound turkey breast with mayo, lettuce, tomato & onion.'],
  ['Veggie Burger', '9.45', '7.75', 'Vegetarian burger with mayo, lettuce, tomatoes & onions.'],
  ['Chicken Burger', '9.75', '7.95', 'Grilled chicken, mayo, onion, lettuce & tomato on a toasted sesame roll.'],
  ['Gyro Sandwich', '9.75', '7.95', 'French beef & lamb, lettuce, tomato, onion & tzatziki in pita.'],
  ['Fajita Pita', '9.95', '8.45', 'Philly steak, grilled peppers & onions, cheese and sour cream in pita.'],
  ['Chicken Finger Sandwich', '10.45', '7.75', 'Fried chicken tenders with mayo, onion, lettuce & tomato on sesame roll.'],
  ['Chicken Quesadilla', '9.45', '7.85', 'Grilled chicken, onions, pepper & cheese in a flour tortilla.'],
  ['Fish Sandwich', '9.75', '7.85', 'Whiting, tilapia or catfish with lettuce, tomato, onion & tartar sauce.'],
  ['BLT Sandwich', '9.75', '7.85', 'Grilled bacon, mayo, lettuce & tomato on toasted white bread.'],
  ['Shrimp PoBoy Sandwich', '12.49', '8.99', 'Grilled shrimp, onions, peppers, white American cheese, mayo & lettuce.'],
  ['Philly Cheese Steak', '9.99', '8.45', 'Steak, bell peppers, mayo, onions & American cheese.'],
  ['Chicken Philly', '9.99', '8.45', 'Chicken steak, bell pepper, mayo, onions & American cheese.'],
]

const tacos = [
  ['Chicken', '5.99'],
  ['Beef', '6.99'],
  ['Shrimp', '6.99'],
  ['Shrimp & Chicken', '7.99'],
  ['Beef & Chicken', '7.99'],
  ['Chicken, Beef & Shrimp', '8.99'],
  ['Fried Fish', '6.99'],
]

function Price({ children }) {
  return <span className="board-price">${children}</span>
}

function drawRoundedBox(context, x, y, width, height, radius, color) {
  context.fillStyle = color
  context.beginPath()
  if (typeof context.roundRect === 'function') context.roundRect(x, y, width, height, radius)
  else context.rect(x, y, width, height)
  context.fill()
}

function drawTextNode(context, node, boardBounds) {
  const text = node.nodeValue || ''
  const wordPattern = /\S+/gu
  const style = window.getComputedStyle(node.parentElement)
  const fontSize = Number.parseFloat(style.fontSize) || 12
  const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.2
  context.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`
  context.fillStyle = style.color
  context.textBaseline = 'alphabetic'
  context.textAlign = 'left'
  if ('letterSpacing' in context) context.letterSpacing = style.letterSpacing || '0px'
  let previousLine = null
  let previousRight = 0

  for (const match of text.matchAll(wordPattern)) {
    const range = document.createRange()
    range.setStart(node, match.index)
    range.setEnd(node, match.index + match[0].length)
    const bounds = range.getBoundingClientRect()
    if (!bounds.width || !bounds.height) continue
    const baseline = bounds.top - boardBounds.top + Math.max(0, (lineHeight - fontSize) / 2) + fontSize * 0.82
    const line = Math.round(bounds.top)
    const measuredX = bounds.left - boardBounds.left
    const space = context.measureText(' ').width * 0.65
    const x = line === previousLine ? Math.max(measuredX, previousRight + space) : measuredX
    context.fillText(match[0], x, baseline)
    previousRight = x + context.measureText(match[0]).width
    previousLine = line
  }
}

function paintBoard(context, element, boardBounds) {
  const bounds = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden' || !bounds.width || !bounds.height) return

  const x = bounds.left - boardBounds.left
  const y = bounds.top - boardBounds.top
  const background = style.backgroundColor
  if (element.classList.contains('menu-board')) {
    const gradient = context.createRadialGradient(boardBounds.width / 2, 0, 0, boardBounds.width / 2, 0, boardBounds.width * 0.8)
    gradient.addColorStop(0, '#394032')
    gradient.addColorStop(0.55, '#272d24')
    gradient.addColorStop(1, '#1d211b')
    context.fillStyle = gradient
    context.fillRect(0, 0, boardBounds.width, boardBounds.height)
  } else if (background !== 'transparent' && background !== 'rgba(0, 0, 0, 0)') {
    const radius = Number.parseFloat(style.borderTopLeftRadius) || 0
    drawRoundedBox(context, x, y, bounds.width, bounds.height, radius, background)
  }

  const borderWidth = Number.parseFloat(style.borderBottomWidth) || 0
  if (borderWidth && style.borderBottomStyle !== 'none') {
    context.fillStyle = style.borderBottomColor
    context.fillRect(x, y + bounds.height - borderWidth, bounds.width, borderWidth)
  }

  if (element instanceof HTMLImageElement && element.complete && element.naturalWidth) {
    const fit = style.objectFit
    const scale = fit === 'cover'
      ? Math.max(bounds.width / element.naturalWidth, bounds.height / element.naturalHeight)
      : Math.min(bounds.width / element.naturalWidth, bounds.height / element.naturalHeight)
    const imageWidth = element.naturalWidth * scale
    const imageHeight = element.naturalHeight * scale
    context.drawImage(element, x + (bounds.width - imageWidth) / 2, y + (bounds.height - imageHeight) / 2, imageWidth, imageHeight)
    return
  }

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) drawTextNode(context, child, boardBounds)
    else if (child.nodeType === Node.ELEMENT_NODE) paintBoard(context, child, boardBounds)
  }
}

function MenuBoard() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const board = document.querySelector('.menu-board')
    const fields = [...board.querySelectorAll('*')].filter((element) => (
      element.childElementCount === 0 && element.textContent.trim() && !element.closest('.board-toolbar')
    ))
    fields.forEach((element, index) => { element.dataset.boardTextKey = `text-${index}` })

    try {
      const values = JSON.parse(localStorage.getItem('floyd-menu-board-edits-v2') || '{}')
      fields.forEach((element) => {
        if (typeof values[element.dataset.boardTextKey] === 'string') {
          element.textContent = values[element.dataset.boardTextKey]
        }
      })
    } catch {
      localStorage.removeItem('floyd-menu-board-edits-v2')
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll('.menu-board [data-board-text-key]').forEach((element) => {
      element.contentEditable = editing ? 'true' : 'false'
      element.spellcheck = false
    })
  }, [editing])

  const saveEdits = () => {
    const values = Object.fromEntries(
      [...document.querySelectorAll('.menu-board [data-board-text-key]')]
        .map((element) => [element.dataset.boardTextKey, element.textContent]),
    )
    localStorage.setItem('floyd-menu-board-edits-v2', JSON.stringify(values))
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  const resetBoard = () => {
    if (window.confirm('Clear saved menu edits and restore the original board?')) {
      localStorage.removeItem('floyd-menu-board-edits-v2')
      window.location.reload()
    }
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
  }

  const exportJpeg = async () => {
    setExporting(true)
    try {
      const board = document.querySelector('.menu-board')
      await document.fonts?.ready
      await Promise.all([...board.querySelectorAll('img')].map((image) => image.decode().catch(() => undefined)))
      const boardBounds = board.getBoundingClientRect()
      const width = Math.round(boardBounds.width)
      const height = Math.round(boardBounds.height)
      const outputWidth = 3840
      const outputHeight = 2160
      const canvas = document.createElement('canvas')
      canvas.width = outputWidth
      canvas.height = outputHeight
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas is unavailable')
      context.fillStyle = '#20251e'
      context.fillRect(0, 0, outputWidth, outputHeight)
      const scale = Math.min(outputWidth / width, outputHeight / height)
      context.translate((outputWidth - width * scale) / 2, (outputHeight - height * scale) / 2)
      context.scale(scale, scale)
      paintBoard(context, board, boardBounds)

      let jpeg = await new Promise((resolve) => {
        if (typeof canvas.toBlob === 'function') canvas.toBlob(resolve, 'image/jpeg', 0.96)
        else resolve(null)
      })
      if (!jpeg) {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.96)
        const response = await fetch(dataUrl)
        jpeg = await response.blob()
      }
      if (!jpeg) throw new Error('JPEG export could not be created')
      const downloadUrl = URL.createObjectURL(jpeg)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'floyd-wings-digital-menu-4k.jpg'
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
    } catch (error) {
      console.error('Could not export menu as JPEG', error)
      window.alert(`JPEG export failed: ${error.message || 'This browser could not create the image.'}`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
    <div className="board-toolbar" aria-label="Menu board controls">
      {editing ? <>
        <button className="toolbar-primary" onClick={saveEdits}>Save edits</button>
        <button onClick={() => window.location.reload()}>Discard</button>
        <button onClick={resetBoard}>Reset board</button>
      </> : <>
        <button className="toolbar-primary" onClick={() => setEditing(true)}>Edit menu</button>
        <button onClick={exportJpeg} disabled={exporting}>{exporting ? 'Exporting…' : 'Export 4K JPEG'}</button>
        <button onClick={toggleFullscreen}>Full screen</button>
      </>}
      {saved && <span role="status">Saved on this TV</span>}
    </div>
    <main className="menu-board">
      <header className="board-header">
        <div className="board-brand">
          <img src={`${import.meta.env.BASE_URL}floyd-logo.png`} alt="" />
          <div><span>FLOYD WINGS AND GRILL</span><small>MABLETON, GEORGIA</small></div>
        </div>
        <div className="board-header-note"><span>FRESH • MADE TO ORDER</span><strong>GOOD FOOD. GOOD PEOPLE.</strong></div>
      </header>

      <div className="board-columns">
        <section className="board-panel sandwich-panel">
          <div className="panel-heading"><span className="panel-index">01</span><h1>BURGERS <i>&amp;</i> SANDWICHES</h1><span className="heading-star">✳</span></div>
          <p className="panel-description">Fresh ground beef, “house-secret” seasoned and perfectly hand-pressed on the grill. Served with fries, potato salad, cole slaw or fried okra.</p>
          <div className="price-key" aria-label="Prices shown as sandwich with side, then sandwich only">
            <span></span>
            <span><strong>SANDWICH</strong><small>&amp; SIDE</small></span>
            <span><strong>SANDWICH</strong><small>ONLY</small></span>
          </div>
          <div className="sandwich-list">
            {sandwiches.map(([name, combo, alone, description]) => <div className="sandwich-row" key={name}>
              <div className="sandwich-copy"><strong>{name}</strong><small>{description}</small></div><Price>{combo}</Price><Price>{alone}</Price>
            </div>)}
          </div>
          <div className="sandwich-notes"><span>Substitute side salad +$1.99</span><span>Add 12 oz drink $1 · 16 oz $1.89</span></div>
          <p className="sandwich-extras">Add cheese $0.50 · bacon $1.25 · mushrooms $0.50 · substitute seasoned fries +$0.99</p>
        </section>

        <div className="board-middle">
          <section className="board-panel taco-panel">
            <div className="panel-heading"><span className="panel-index">02</span><h2>TACOS AT FLOYD</h2><span className="taco-flower">✳</span></div>
            <p className="small-description">Served with lettuce, tomato, onion &amp; cilantro. Sour cream on the side. Add cheese 95¢.</p>
            <div className="compact-list">
              {tacos.map(([name, price]) => <div className="compact-row" key={name}><span>{name} tacos <small>(2 pc)</small></span><Price>{price}</Price></div>)}
            </div>
          </section>

          <section className="board-panel bowls-panel">
            <div className="panel-heading"><span className="panel-index">03</span><h2>NACHOS <i>&amp;</i> BURRITOS</h2></div>
            <div className="featured-item"><div><strong>Nachos Mexicana</strong><Price>9.99</Price></div><p>Heated tortilla chips with blended beans, melted cheddar, lettuce, tomatoes, onions, jalapeños &amp; cilantro.</p></div>
            <div className="featured-item"><div><strong>Burritos Mexicana</strong><Price>9.99</Price></div><p>Black beans, fried rice, lettuce, tomatoes, onions &amp; cheddar. Served with sour cream; folded in tortillas.</p></div>
            <p className="add-ons">Add grilled chicken $2.99 · beef $3.99 · shrimp $3.99</p>
          </section>

          <section className="board-panel salad-panel">
            <div className="panel-heading"><span className="panel-index">04</span><h2>SALADS</h2></div>
            <p className="small-description">Dressings: bleu cheese, ranch, Italian, French, honey mustard, 1000 island, oil &amp; vinegar. Extra dressing 50¢.</p>
            <div className="salad-list">
              <div><strong>Classic Caesar</strong><Price>7.95</Price><small>Add chicken $2.99</small></div>
              <div><strong>The Peachtree Salad</strong><Price>7.95</Price><small>Fresh green salad, croutons, tomatoes, cucumber &amp; cheddar cheese.</small></div>
              <div><strong>The Roswell Salad</strong><Price>9.99</Price><small>Our “Peachtree” salad topped with grilled or fried chicken.</small></div>
              <div><strong>Fish Salad</strong><Price>11.99</Price><small>Whiting or tilapia over greens, croutons, tomatoes, cucumber &amp; cheddar. Catfish +$1.</small></div>
              <div><strong>Shrimp Salad</strong><Price>12.45</Price><small>Grilled shrimp over greens, croutons, tomatoes, cucumber &amp; cheddar.</small></div>
            </div>
          </section>
        </div>

        <section className="board-panel seafood-panel">
          <div className="panel-heading"><span className="panel-index">05</span><h2>SEAFOOD</h2></div>
          <p className="panel-description">All platters served with your choice of fries, potato salad or coleslaw, and cocktail or tartar sauce.</p>
          <article className="seafood-feature"><div><h3>Fish Dinner</h3><Price>10.75</Price></div><p>2 pieces of catfish, tilapia or whiting. Catfish +$1.</p></article>
          <article className="seafood-feature"><h3>Seafood Platter</h3><p>A perfect choice for seafood lovers: 2 pieces of catfish, tilapia or whiting and 3 pieces of golden fried shrimp. Catfish +$1.</p><div className="platter-price"><span>SEAFOOD PLATTER</span><Price>11.75</Price></div></article>
          <article className="seafood-feature shrimp-feature">
            <h3>Shrimp Basket</h3><p>Jumbo shrimp, lightly dusted and fried golden brown.</p>
            <div className="shrimp-key"><span></span><span>SHRIMP<br />&amp; SIDE</span><span>SHRIMP<br />ONLY</span></div>
            {[
              ['7 Piece', '9.99', '7.99'],
              ['10 Piece', '12.49', '10.99'],
              ['15 Piece', '17.65', '15.99'],
            ].map(([name, combo, alone]) => <div className="shrimp-row" key={name}><strong>{name}</strong><Price>{combo}</Price><Price>{alone}</Price></div>)}
          </article>
          <div className="drink-note"><span>MAKE IT A MEAL</span><strong>12 oz drink $1 <i>·</i> 16 oz $1.89</strong></div>
          <img className="seafood-photo" src={`${import.meta.env.BASE_URL}wings-platter.jpg`} alt="Golden fried seafood and dipping sauce" />
        </section>
      </div>

      <footer className="board-footer"><span>*Prices and menu items may change</span><strong>THANKS FOR DINING WITH US!</strong><span>5345 FLOYD RD SW #118 · MABLETON, GA</span></footer>
    </main>
    </>
  )
}

export default MenuBoard
