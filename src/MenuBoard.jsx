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

const screenContent = [
  { title: 'BURGERS & SANDWICHES', photo: 'burger-fries.jpg' },
  { title: 'TACOS · NACHOS · SALADS', photo: 'floyd-feature-1.jpg' },
  { title: 'SEAFOOD', photo: 'wings-platter.jpg' },
]

function Price({ children }) {
  return <span className="board-price">${children}</span>
}

const palette = { cream: '#f7f4ed', ink: '#22271f', muted: '#55584f', red: '#e86237', orange: '#f29b70', rule: '#d8d3c9' }

function roundRect(context, x, y, width, height, radius, color) {
  context.fillStyle = color
  context.beginPath()
  if (context.roundRect) context.roundRect(x, y, width, height, radius)
  else context.rect(x, y, width, height)
  context.fill()
}

function text(context, value, x, y, font, color = palette.ink, align = 'left') {
  context.font = font
  context.fillStyle = color
  context.textAlign = align
  context.textBaseline = 'top'
  context.fillText(String(value || ''), x, y)
}

function wrappedText(context, value, x, y, width, font, color, lineHeight, maxLines = 3) {
  context.font = font
  context.fillStyle = color
  context.textAlign = 'left'
  context.textBaseline = 'top'
  const words = String(value || '').trim().split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && context.measureText(candidate).width > width && lines.length < maxLines - 1) {
      lines.push(line)
      line = word
    } else line = candidate
  }
  if (line) lines.push(line)
  lines.slice(0, maxLines).forEach((valueLine, index) => context.fillText(valueLine, x, y + index * lineHeight, width))
  return Math.min(lines.length, maxLines) * lineHeight
}

function panel(context, x, y, width, height) {
  context.save()
  context.beginPath()
  if (context.roundRect) context.roundRect(x, y, width, height, 22)
  else context.rect(x, y, width, height)
  context.clip()
  const base = context.createLinearGradient(x, y, x + width, y + height)
  base.addColorStop(0, '#fffefb')
  base.addColorStop(.54, palette.cream)
  base.addColorStop(1, '#eee2d7')
  context.fillStyle = base
  context.fillRect(x, y, width, height)
  const sheen = context.createRadialGradient(x + width * .35, y + height * .04, 0, x + width * .35, y + height * .04, width * .86)
  sheen.addColorStop(0, 'rgba(255,255,255,.7)')
  sheen.addColorStop(.55, 'rgba(255,255,255,.16)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = sheen
  context.fillRect(x, y, width, height)
  context.restore()
}

function photoPanel(context, image, x, y, width, height) {
  context.save()
  context.beginPath()
  if (context.roundRect) context.roundRect(x, y, width, height, 22)
  else context.rect(x, y, width, height)
  context.clip()
  const base = context.createLinearGradient(x, y, x + width, y + height)
  base.addColorStop(0, '#30352d')
  base.addColorStop(1, '#191d18')
  context.fillStyle = base
  context.fillRect(x, y, width, height)
  if (image?.complete && image.naturalWidth) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const imageWidth = image.naturalWidth * scale, imageHeight = image.naturalHeight * scale
    context.drawImage(image, x + (width - imageWidth) / 2, y + (height - imageHeight) / 2, imageWidth, imageHeight)
  }
  context.fillStyle = 'rgba(19,23,19,.94)'
  context.fillRect(x, y, width, height)
  const sheen = context.createRadialGradient(x + width * .38, y, 0, x + width * .38, y, width * .85)
  sheen.addColorStop(0, 'rgba(255,255,255,.1)')
  sheen.addColorStop(.55, 'rgba(255,255,255,.02)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = sheen
  context.fillRect(x, y, width, height)
  context.restore()
}

function panelHeading(context, x, y, index, title, width, size = 42) {
  text(context, index, x, y + 5, '800 19px "DM Sans", Arial, sans-serif', palette.orange)
  text(context, title, x + 42, y, `900 ${size}px "DM Sans", Arial, sans-serif`, palette.red)
  context.fillStyle = palette.red
  context.fillRect(x, y + 61, width, 4)
  return y + 85
}

function readBoardData(board) {
  const read = (element) => element?.textContent?.replace(/\s+/g, ' ').trim() || ''
  const prices = (element) => [...element.querySelectorAll('.board-price')].map(read)
  const seafoodFeatures = [...board.querySelectorAll('.seafood-feature')]
  const shrimpRows = [...board.querySelectorAll('.shrimp-row')]
  return {
    sandwiches: [...board.querySelectorAll('.sandwich-row')].map((row) => ({
      name: read(row.querySelector('.sandwich-copy strong')),
      description: read(row.querySelector('.sandwich-copy small')),
      withSide: prices(row)[0],
      only: prices(row)[1],
    })),
    sandwichIntro: read(board.querySelector('.sandwich-panel > .panel-description')),
    sandwichNotes: [...board.querySelectorAll('.sandwich-notes span')].map(read),
    sandwichExtras: read(board.querySelector('.sandwich-extras')),
    tacoIntro: read(board.querySelector('.taco-panel .small-description')),
    tacos: [...board.querySelectorAll('.compact-row')].map((row) => ({ name: read(row.querySelector('span')), price: prices(row)[0] })),
    bowls: [...board.querySelectorAll('.featured-item')].map((item) => ({
      name: read(item.querySelector('strong')),
      price: prices(item)[0],
      description: read(item.querySelector('p')),
    })),
    bowlAddOns: read(board.querySelector('.add-ons')),
    saladIntro: read(board.querySelector('.salad-panel .small-description')),
    salads: [...board.querySelectorAll('.salad-list > div')].map((item) => ({
      name: read(item.querySelector('strong')),
      price: prices(item)[0],
      description: read(item.querySelector('small')),
    })),
    seafoodIntro: read(board.querySelector('.seafood-general-note')),
    seafood: [
      {
        name: read(seafoodFeatures[0]?.querySelector('h3')),
        description: read(seafoodFeatures[0]?.querySelector('p:not(.seafood-general-note)')),
        price: prices(seafoodFeatures[0] || board)[0],
      },
      {
        name: read(seafoodFeatures[1]?.querySelector('h3')),
        description: read(seafoodFeatures[1]?.querySelector('p:not(.seafood-general-note)')),
        price: prices(seafoodFeatures[1] || board)[0],
      },
      {
        name: read(seafoodFeatures[2]?.querySelector('h3')),
        description: read(seafoodFeatures[2]?.querySelector('p')),
        prices: shrimpRows.map((row) => ({
          name: read(row.querySelector('strong')),
          withSide: prices(row)[0],
          only: prices(row)[1],
        })),
      },
    ],
    drinkNote: read(board.querySelector('.drink-note strong')),
  }
}

function drawTvFrame(context, logo, title, number, warm = false) {
  const W = 3840, H = 2160, margin = 54
  const bg = context.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.8)
  bg.addColorStop(0, warm ? '#39342e' : '#343a30')
  bg.addColorStop(0.55, warm ? '#252620' : '#22271f')
  bg.addColorStop(1, warm ? '#191a17' : '#191d18')
  context.fillStyle = bg
  context.fillRect(0, 0, W, H)
  roundRect(context, margin, 36, 238, 96, 12, palette.cream)
  if (logo?.complete && logo.naturalWidth) {
    const fit = Math.min(212 / logo.naturalWidth, 76 / logo.naturalHeight)
    const logoW = logo.naturalWidth * fit, logoH = logo.naturalHeight * fit
    context.drawImage(logo, margin + (238 - logoW) / 2, 36 + (96 - logoH) / 2, logoW, logoH)
  }
  text(context, 'FLOYD WINGS AND GRILL', margin + 264, 40, '900 43px "DM Sans", Arial, sans-serif', palette.cream)
  text(context, 'MABLETON, GEORGIA', margin + 266, 92, '700 19px "DM Sans", Arial, sans-serif', '#bdc1b2')
  text(context, `SCREEN ${number} / 3  ·  FRESH, MADE TO ORDER`, W - margin, 42, '700 18px "DM Sans", Arial, sans-serif', '#bdc1b2', 'right')
  if (!warm) text(context, title, W - margin, 75, '900 32px "DM Sans", Arial, sans-serif', palette.orange, 'right')
  context.fillStyle = '#596050'
  context.fillRect(margin, 148, W - margin * 2, 2)
  context.fillRect(margin, 2090, W - margin * 2, 2)
  text(context, '*Prices and menu items may change', margin, 2105, '600 15px "DM Sans", Arial, sans-serif', '#c2c0b5')
  text(context, 'THANKS FOR DINING WITH US!', W / 2, 2103, '800 18px "DM Sans", Arial, sans-serif', '#f7f3e9', 'center')
  text(context, '5345 FLOYD RD SW #118 · MABLETON, GA', W - margin, 2105, '600 15px "DM Sans", Arial, sans-serif', '#c2c0b5', 'right')
}

function drawHeroBanner(context, image, top = 168) {
  const x = 54, width = 3732, height = 100
  context.save()
  context.beginPath()
  if (context.roundRect) context.roundRect(x, top, width, height, 20)
  else context.rect(x, top, width, height)
  context.clip()
  const bg = context.createLinearGradient(x, top, x + width, top + height)
  bg.addColorStop(0, '#22271f')
  bg.addColorStop(0.58, '#343a30')
  bg.addColorStop(1, '#e86237')
  context.fillStyle = bg
  context.fillRect(x, top, width, height)
  if (image?.complete && image.naturalWidth) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const imageWidth = image.naturalWidth * scale
    const imageHeight = image.naturalHeight * scale
    context.drawImage(image, x + (width - imageWidth) / 2, top + (height - imageHeight) / 2, imageWidth, imageHeight)
    context.fillStyle = 'rgba(34,39,31,.18)'
    context.fillRect(x, top, width, height)
  }
  const edge = context.createLinearGradient(x, top, x + width, top)
  edge.addColorStop(0, 'rgba(34,39,31,.3)')
  edge.addColorStop(0.18, 'rgba(34,39,31,0)')
  edge.addColorStop(0.82, 'rgba(34,39,31,0)')
  edge.addColorStop(1, 'rgba(34,39,31,.22)')
  context.fillStyle = edge
  context.fillRect(x, top, width, height)
  context.fillStyle = palette.red
  context.fillRect(x, top + height - 6, width, 6)
  context.restore()
}

function drawSandwichBanner(context, burger, top = 168) {
  const x = 54, width = 3732, height = 160
  context.save()
  context.beginPath()
  if (context.roundRect) context.roundRect(x, top, width, height, 16)
  else context.rect(x, top, width, height)
  context.clip()
  const bg = context.createLinearGradient(x, top, x + width, top + height)
  bg.addColorStop(0, '#30271f')
  bg.addColorStop(1, '#171b17')
  context.fillStyle = bg
  context.fillRect(x, top, width, height)
  if (burger?.complete && burger.naturalWidth) {
    const scale = Math.max(width / burger.naturalWidth, height / burger.naturalHeight)
    const imageWidth = burger.naturalWidth * scale, imageHeight = burger.naturalHeight * scale
    context.drawImage(burger, x + (width - imageWidth) / 2, top + (height - imageHeight) / 2, imageWidth, imageHeight)
  }
  const shade = context.createLinearGradient(x, top, x + width, top)
  shade.addColorStop(0, 'rgba(24,29,23,.82)')
  shade.addColorStop(.62, 'rgba(24,29,23,.64)')
  shade.addColorStop(1, 'rgba(24,29,23,.35)')
  context.fillStyle = shade
  context.fillRect(x, top, width, height)
  text(context, 'FRESHLY MADE IN MABLETON', x + 330, top + 23, '800 18px "DM Sans", Arial, sans-serif', '#f1a27e')
  text(context, 'HAMBURGERS', x + 330, top + 61, '700 76px "Playfair Display", Georgia, serif', palette.cream)
  context.font = 'italic 700 76px "Playfair Display", Georgia, serif'
  const titleWidth = context.measureText('HAMBURGERS').width
  text(context, '& SANDWICHES', x + 350 + titleWidth, top + 61, 'italic 700 76px "Playfair Display", Georgia, serif', '#ef7951')
  context.fillStyle = '#e86237'
  context.fillRect(x, top + height - 5, width, 5)
  context.restore()
}

async function loadPublicImage(path) {
  const image = new Image()
  image.src = `${import.meta.env.BASE_URL}${path}`
  try {
    await image.decode()
    return image
  } catch {
    return null
  }
}

function renderTvSlide(context, data, logo, slide, foodPhoto) {
  const W = 3840, margin = 54, gap = 24, top = 290, height = 1770
  const cardTitle = (x, y, title, width, size = 54) => {
    text(context, title, x, y, `900 ${size}px "DM Sans", Arial, sans-serif`, palette.red)
    context.fillStyle = palette.red
    context.fillRect(x, y + size + 12, width, 3)
    return y + size + 34
  }

  if (slide === 0) {
    drawTvFrame(context, logo, 'BURGERS & SANDWICHES', 1, true)
    drawSandwichBanner(context, foodPhoto)
    const x = margin, w = W - margin * 2, p = 38, innerX = x + p, innerW = w - p * 2
    const panelTop = top + 60, panelHeight = height - 60
    photoPanel(context, foodPhoto, x, panelTop, w, panelHeight)
    let y = panelTop + 26
    const introW = innerW * .86, introX = innerX + (innerW - introW) / 2
    roundRect(context, introX - 18, y - 8, introW + 36, 62, 10, '#e8eed8')
    wrappedText(context, data.sandwichIntro, introX, y, introW, '500 30px "DM Sans", Arial, sans-serif', palette.ink, 38, 2)
    y += 74
    const colGap = 30, itemW = (innerW - colGap) / 2, sideW = 142, onlyW = 132, labelGap = 16
    const nameW = itemW - sideW - onlyW - labelGap
    for (let col = 0; col < 2; col += 1) {
      const cx = innerX + col * (itemW + colGap)
      text(context, 'SANDWICH', cx + nameW + sideW - 8, y, '800 22px "DM Sans", Arial, sans-serif', palette.cream, 'right')
      text(context, '& SIDE', cx + nameW + sideW - 8, y + 28, '900 22px "DM Sans", Arial, sans-serif', palette.red, 'right')
      text(context, 'SANDWICH', cx + itemW, y, '800 22px "DM Sans", Arial, sans-serif', palette.cream, 'right')
      text(context, 'ONLY', cx + itemW, y + 28, '900 22px "DM Sans", Arial, sans-serif', palette.red, 'right')
    }
    y += 62
    const notesHeight = 76, panelBottom = panelTop + panelHeight, rowHeight = (panelBottom - p - notesHeight - y) / 8
    data.sandwiches.forEach((item, index) => {
      const col = Math.floor(index / 8), row = index % 8
      const cx = innerX + col * (itemW + colGap), ry = y + row * rowHeight
      text(context, item.name, cx, ry + 10, '800 38px "DM Sans", Arial, sans-serif', '#ff916d')
      wrappedText(context, item.description, cx, ry + 58, nameW, '500 26px "DM Sans", Arial, sans-serif', '#fffaf1', 33, 3)
      text(context, item.withSide, cx + nameW + sideW - 8, ry + 10, '900 38px "DM Sans", Arial, sans-serif', '#fffaf1', 'right')
      text(context, item.only, cx + itemW, ry + 10, '900 38px "DM Sans", Arial, sans-serif', '#fffaf1', 'right')
      context.fillStyle = palette.rule
      context.fillRect(cx, ry + rowHeight - 2, itemW, 2)
    })
    const notesY = panelBottom - p - notesHeight
    text(context, data.sandwichNotes[0], innerX, notesY, '800 25px "DM Sans", Arial, sans-serif', palette.red)
    text(context, data.sandwichNotes[1], innerX + innerW, notesY, '800 25px "DM Sans", Arial, sans-serif', palette.red, 'right')
    text(context, data.sandwichExtras, innerX, notesY + 38, '600 21px "DM Sans", Arial, sans-serif', '#f1ece3')
    return
  }

  if (slide === 1) {
    drawTvFrame(context, logo, 'TACOS · NACHOS · SALADS', 2)
    drawHeroBanner(context, foodPhoto)
    const ratios = [1.08, 1.08, 1.2], totalW = W - margin * 2 - gap * 2
    const unit = totalW / ratios.reduce((sum, value) => sum + value, 0)
    const widths = ratios.map((value) => value * unit)
    const xs = [margin, margin + widths[0] + gap, margin + widths[0] + gap + widths[1] + gap]
    const pad = 30
    xs.forEach((x, index) => panel(context, x, top, widths[index], height))

    let x = xs[0] + pad, w = widths[0] - pad * 2
    let y = cardTitle(x, top + 32, 'Tacos at Floyd', w, 54)
    y += wrappedText(context, data.tacoIntro, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 3) + 22
    const tacoH = (top + height - 36 - y) / data.tacos.length
    data.tacos.forEach((item, i) => {
      const ty = y + i * tacoH
      text(context, item.name, x, ty + 5, '700 38px "DM Sans", Arial, sans-serif')
      text(context, item.price, x + w, ty + 5, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'right')
      context.fillStyle = palette.rule
      context.fillRect(x, ty + tacoH - 3, w, 2)
    })

    x = xs[1] + pad; w = widths[1] - pad * 2
    y = cardTitle(x, top + 32, 'Nachos & Burritos', w, 54)
    const bowlGap = 48, bowlH = (height - 190) / 2
    data.bowls.forEach((item, i) => {
      const iy = y + i * bowlH
      text(context, item.name, x, iy, '800 38px "DM Sans", Arial, sans-serif')
      text(context, item.price, x + w, iy, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'right')
      wrappedText(context, item.description, x, iy + 54, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 36, 4)
    })
    text(context, data.bowlAddOns, x, top + height - 82, '800 24px "DM Sans", Arial, sans-serif', palette.red)

    x = xs[2] + pad; w = widths[2] - pad * 2
    y = cardTitle(x, top + 32, 'Salads', w, 54)
    y += wrappedText(context, data.saladIntro, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 3) + 20
    const saladH = (top + height - 34 - y) / data.salads.length
    data.salads.forEach((item, i) => {
      const iy = y + i * saladH
      text(context, item.name, x, iy, '800 38px "DM Sans", Arial, sans-serif')
      text(context, item.price, x + w, iy, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'right')
      wrappedText(context, item.description, x, iy + 48, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 3)
      context.fillStyle = palette.rule
      context.fillRect(x, iy + saladH - 3, w, 2)
    })
    return
  }

  drawTvFrame(context, logo, 'SEAFOOD', 3)
  drawHeroBanner(context, foodPhoto)
  const seafoodTop = top, seafoodHeight = height
  const ratios = [1.08, 1.08, 1.2], seafoodGap = gap, totalW = W - margin * 2 - seafoodGap * 2
  const unit = totalW / ratios.reduce((sum, value) => sum + value, 0)
  const widths = ratios.map((value) => value * unit)
  const xs = [margin, margin + widths[0] + seafoodGap, margin + widths[0] + seafoodGap + widths[1] + seafoodGap]
  xs.forEach((x, index) => panel(context, x, seafoodTop, widths[index], seafoodHeight))
  const pad = 30, fish = data.seafood[0], platter = data.seafood[1], shrimp = data.seafood[2]

  let x = xs[0] + pad, w = widths[0] - pad * 2
  let y = cardTitle(x, seafoodTop + 32, fish.name, w, 54)
  text(context, fish.price, x + w, seafoodTop + 32, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'right')
  y += wrappedText(context, data.seafoodIntro, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 3) + 22
  y += wrappedText(context, fish.description, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 4) + 24
  text(context, 'CHOOSE YOUR FISH', x, y, '800 19px "DM Sans", Arial, sans-serif', palette.red)
  wrappedText(context, 'Catfish · Tilapia · Whiting', x, y + 32, w, '700 26px "DM Sans", Arial, sans-serif', palette.ink, 35, 2)

  x = xs[1] + pad; w = widths[1] - pad * 2
  y = cardTitle(x, seafoodTop + 32, platter.name, w, 54)
  text(context, platter.price, x + w, seafoodTop + 32, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'right')
  y += wrappedText(context, data.seafoodIntro, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 3) + 22
  wrappedText(context, platter.description, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 5)

  x = xs[2] + pad; w = widths[2] - pad * 2
  y = cardTitle(x, seafoodTop + 32, shrimp.name, w, 54)
  y += wrappedText(context, shrimp.description, x, y, w, '500 26px "DM Sans", Arial, sans-serif', palette.muted, 35, 4) + 18
  const c1 = 200, c2 = 200, priceStart = x + w - c1 - c2
  const tableY = y + 12
  text(context, 'SHRIMP & SIDE', priceStart + c1 / 2, tableY, '800 16px "DM Sans", Arial, sans-serif', palette.muted, 'center')
  text(context, 'SHRIMP ONLY', priceStart + c1 + c2 / 2, tableY, '800 16px "DM Sans", Arial, sans-serif', palette.muted, 'center')
  shrimp.prices.forEach((item, index) => {
    const iy = tableY + 42 + index * 105
    text(context, item.name, x, iy, '800 38px "DM Sans", Arial, sans-serif')
    text(context, item.withSide, priceStart + c1 / 2, iy, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'center')
    text(context, item.only, priceStart + c1 + c2 / 2, iy, '900 38px "DM Sans", Arial, sans-serif', palette.red, 'center')
    context.fillStyle = palette.rule
    context.fillRect(x, iy + 39, w, 2)
  })
  text(context, data.drinkNote, x + w - 8, seafoodTop + seafoodHeight - 66, '800 18px "DM Sans", Arial, sans-serif', palette.red, 'right')
}

function renderMenuCanvas(context, data, logo) {
  const W = 3840
  const H = 2160
  const margin = 54
  const gap = 26
  const headerY = 38
  const headerH = 104
  const footerY = 2101
  const contentY = 166
  const contentH = 1908
  const contentW = W - margin * 2 - gap * 2
  const ratio = [1.52, 1.12, 0.94]
  const unit = contentW / ratio.reduce((sum, part) => sum + part, 0)
  const widths = ratio.map((part) => part * unit)
  const xs = [margin, margin + widths[0] + gap, margin + widths[0] + gap + widths[1] + gap]

  const bg = context.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.8)
  bg.addColorStop(0, '#394032')
  bg.addColorStop(0.55, '#272d24')
  bg.addColorStop(1, '#1d211b')
  context.fillStyle = bg
  context.fillRect(0, 0, W, H)
  roundRect(context, margin, headerY, 238, headerH - 12, 12, palette.cream)
  if (logo?.complete && logo.naturalWidth) {
    const fit = Math.min(212 / logo.naturalWidth, 80 / logo.naturalHeight)
    const logoW = logo.naturalWidth * fit
    const logoH = logo.naturalHeight * fit
    context.drawImage(logo, margin + (238 - logoW) / 2, headerY + (headerH - 12 - logoH) / 2, logoW, logoH)
  }
  text(context, 'FLOYD WINGS AND GRILL', margin + 264, headerY + 5, '900 43px "DM Sans", Arial, sans-serif', '#f7f3e9')
  text(context, 'MABLETON, GEORGIA', margin + 266, headerY + 58, '700 19px "DM Sans", Arial, sans-serif', '#c9c6b9')
  text(context, 'FRESH • MADE TO ORDER', W - margin, headerY + 5, '700 18px "DM Sans", Arial, sans-serif', '#c9c6b9', 'right')
  text(context, 'GOOD FOOD. GOOD PEOPLE.', W - margin, headerY + 43, '800 25px "DM Sans", Arial, sans-serif', palette.orange, 'right')
  context.fillStyle = '#596050'
  context.fillRect(margin, headerY + headerH, W - margin * 2, 2)

  const sx = xs[0], sw = widths[0], px = sx + 34, pw = sw - 68
  panel(context, sx, contentY, sw, contentH)
  let y = panelHeading(context, px, contentY + 28, '01', 'BURGERS & SANDWICHES', pw, 42)
  wrappedText(context, data.sandwichIntro, px, y, pw, '500 19px "DM Sans", Arial, sans-serif', palette.muted, 25, 2)
  y += 58
  const price1 = 126, price2 = 118, colGap = 30
  const keyY = y + 3
  const itemColW = (pw - colGap) / 2
  const nameW = itemColW - price1 - price2 - 18
  const listX = px
  for (let column = 0; column < 2; column += 1) {
    const colX = listX + column * (itemColW + colGap)
    text(context, 'SANDWICH', colX + nameW + price1 - 7, keyY, '800 16px "DM Sans", Arial, sans-serif', palette.muted, 'right')
    text(context, '& SIDE', colX + nameW + price1 - 7, keyY + 23, '900 16px "DM Sans", Arial, sans-serif', palette.red, 'right')
    text(context, 'SANDWICH', colX + itemColW, keyY, '800 16px "DM Sans", Arial, sans-serif', palette.muted, 'right')
    text(context, 'ONLY', colX + itemColW, keyY + 23, '900 16px "DM Sans", Arial, sans-serif', palette.red, 'right')
  }
  y += 58
  const notesH = 72
  const rowTop = y + 8
  const listH = contentY + contentH - 30 - notesH - rowTop
  const rowH = listH / 8
  data.sandwiches.forEach((item, index) => {
    const column = Math.floor(index / 8)
    const row = index % 8
    const colX = listX + column * (itemColW + colGap)
    const rowY = rowTop + row * rowH
    const descW = nameW
    text(context, item.name, colX, rowY + 7, '800 23px "DM Sans", Arial, sans-serif', palette.ink)
    wrappedText(context, item.description, colX, rowY + 39, descW, '500 16px "DM Sans", Arial, sans-serif', palette.muted, 20, 3)
    text(context, item.withSide, colX + nameW + price1 - 7, rowY + 7, '900 22px "DM Sans", Arial, sans-serif', palette.red, 'right')
    text(context, item.only, colX + itemColW, rowY + 7, '900 22px "DM Sans", Arial, sans-serif', palette.red, 'right')
    context.fillStyle = palette.rule
    context.fillRect(colX, rowY + rowH - 2, itemColW, 2)
  })
  const noteY = contentY + contentH - 30 - notesH
  text(context, data.sandwichNotes[0], px, noteY, '800 17px "DM Sans", Arial, sans-serif', palette.red)
  text(context, data.sandwichNotes[1], px + pw, noteY, '800 17px "DM Sans", Arial, sans-serif', palette.red, 'right')
  wrappedText(context, data.sandwichExtras, px, noteY + 29, pw, '600 15px "DM Sans", Arial, sans-serif', palette.muted, 18, 2)

  const mx = xs[1], mw = widths[1], mp = 26, mi = mx + mp, miw = mw - mp * 2
  const middleGap = 22
  const middleRoom = contentH - middleGap * 2
  const rowHeights = [middleRoom * 0.24, middleRoom * 0.29, middleRoom * 0.47]
  let my = contentY

  panel(context, mx, my, mw, rowHeights[0])
  y = panelHeading(context, mi, my + 21, '02', 'TACOS AT FLOYD', miw, 32)
  wrappedText(context, data.tacoIntro, mi, y, miw, '500 15px "DM Sans", Arial, sans-serif', palette.muted, 20, 2)
  const tacoY = y + 43
  const tacoGap = 20, tacoW = (miw - tacoGap) / 2, tacoRowH = (rowHeights[0] - (tacoY - my) - 20) / 4
  data.tacos.forEach((item, index) => {
    const col = Math.floor(index / 4), row = index % 4
    const tx = mi + col * (tacoW + tacoGap), ty = tacoY + row * tacoRowH
    text(context, item.name, tx, ty, '700 18px "DM Sans", Arial, sans-serif')
    text(context, item.price, tx + tacoW, ty, '900 18px "DM Sans", Arial, sans-serif', palette.red, 'right')
  })
  my += rowHeights[0] + middleGap

  panel(context, mx, my, mw, rowHeights[1])
  y = panelHeading(context, mi, my + 21, '03', 'NACHOS & BURRITOS', miw, 32)
  const featureGap = 19, featureH = (rowHeights[1] - (y - my) - 54) / 2
  data.bowls.forEach((item, index) => {
    const iy = y + index * (featureH + featureGap)
    text(context, item.name, mi, iy, '800 19px "DM Sans", Arial, sans-serif')
    text(context, item.price, miw + mi, iy, '900 19px "DM Sans", Arial, sans-serif', palette.red, 'right')
    wrappedText(context, item.description, mi, iy + 29, miw, '500 15px "DM Sans", Arial, sans-serif', palette.muted, 19, 3)
  })
  text(context, data.bowlAddOns, mi, my + rowHeights[1] - 31, '800 15px "DM Sans", Arial, sans-serif', palette.red)
  my += rowHeights[1] + middleGap

  panel(context, mx, my, mw, rowHeights[2])
  y = panelHeading(context, mi, my + 21, '04', 'SALADS', miw, 32)
  wrappedText(context, data.saladIntro, mi, y, miw, '500 15px "DM Sans", Arial, sans-serif', palette.muted, 20, 3)
  y += 67
  const saladRowH = (rowHeights[2] - (y - my) - 19) / data.salads.length
  data.salads.forEach((item, index) => {
    const iy = y + index * saladRowH
    text(context, item.name, mi, iy, '800 18px "DM Sans", Arial, sans-serif')
    text(context, item.price, miw + mi, iy, '900 18px "DM Sans", Arial, sans-serif', palette.red, 'right')
    wrappedText(context, item.description, mi, iy + 26, miw, '500 14px "DM Sans", Arial, sans-serif', palette.muted, 17, 3)
    context.fillStyle = palette.rule
    context.fillRect(mi, iy + saladRowH - 3, miw, 1.5)
  })

  const fx = xs[2], fw = widths[2], fp = 30, fi = fx + fp, fiw = fw - fp * 2
  panel(context, fx, contentY, fw, contentH)
  y = panelHeading(context, fi, contentY + 28, '05', 'SEAFOOD', fiw, 40)
  y += wrappedText(context, data.seafoodIntro, fi, y, fiw, '500 18px "DM Sans", Arial, sans-serif', palette.muted, 24, 3) + 15
  const fish = data.seafood[0]
  text(context, fish.name, fi, y, '900 27px "DM Sans", Arial, sans-serif', palette.red)
  text(context, fish.price, fiw + fi, y, '900 27px "DM Sans", Arial, sans-serif', palette.red, 'right')
  y += 40 + wrappedText(context, fish.description, fi, y + 3, fiw, '500 18px "DM Sans", Arial, sans-serif', palette.ink, 24, 3) + 18
  context.fillStyle = palette.rule
  context.fillRect(fi, y - 6, fiw, 2)
  const platter = data.seafood[1]
  text(context, platter.name, fi, y, '900 27px "DM Sans", Arial, sans-serif', palette.red)
  y += 39
  y += wrappedText(context, platter.description, fi, y, fiw, '500 18px "DM Sans", Arial, sans-serif', palette.ink, 25, 4) + 8
  text(context, 'SEAFOOD PLATTER', fi, y, '800 15px "DM Sans", Arial, sans-serif', palette.muted)
  text(context, platter.price, fiw + fi, y, '900 26px "DM Sans", Arial, sans-serif', palette.red, 'right')
  y += 52
  context.fillStyle = palette.rule
  context.fillRect(fi, y - 7, fiw, 2)
  const shrimp = data.seafood[2]
  text(context, shrimp.name, fi, y, '900 27px "DM Sans", Arial, sans-serif', palette.red)
  y += 39
  y += wrappedText(context, shrimp.description, fi, y, fiw, '500 18px "DM Sans", Arial, sans-serif', palette.ink, 24, 3) + 16
  const shrimpC1 = 142, shrimpC2 = 142
  text(context, 'SHRIMP & SIDE', fiw + fi - shrimpC2 - shrimpC1, y, '800 12px "DM Sans", Arial, sans-serif', palette.muted, 'center')
  text(context, 'SHRIMP ONLY', fiw + fi - shrimpC2 / 2, y, '800 12px "DM Sans", Arial, sans-serif', palette.muted, 'center')
  y += 28
  shrimp.prices.forEach((item) => {
    text(context, item.name, fi, y, '800 19px "DM Sans", Arial, sans-serif')
    text(context, item.withSide, fiw + fi - shrimpC2 - shrimpC1 / 2, y, '900 20px "DM Sans", Arial, sans-serif', palette.red, 'center')
    text(context, item.only, fiw + fi - shrimpC2 / 2, y, '900 20px "DM Sans", Arial, sans-serif', palette.red, 'center')
    y += 42
  })
  const drinkY = contentY + contentH - 68
  context.fillStyle = palette.rule
  context.fillRect(fi, drinkY - 12, fiw, 2)
  text(context, data.drinkNote, fi, drinkY, '800 17px "DM Sans", Arial, sans-serif', palette.red)

  context.fillStyle = '#596050'
  context.fillRect(margin, footerY - 12, W - margin * 2, 2)
  text(context, '*Prices and menu items may change', margin, footerY + 4, '600 15px "DM Sans", Arial, sans-serif', '#c2c0b5')
  text(context, 'THANKS FOR DINING WITH US!', W / 2, footerY + 2, '800 18px "DM Sans", Arial, sans-serif', '#f7f3e9', 'center')
  text(context, '5345 FLOYD RD SW #118 · MABLETON, GA', W - margin, footerY + 4, '600 15px "DM Sans", Arial, sans-serif', '#c2c0b5', 'right')
}

function MenuBoard() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportsOpen, setExportsOpen] = useState(false)
  const [screen, setScreen] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const updateFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  useEffect(() => {
    if (!fullscreen || editing) return undefined
    const timer = window.setInterval(() => setScreen((current) => (current + 1) % 3), 15000)
    return () => window.clearInterval(timer)
  }, [fullscreen, editing])

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

  const exportJpeg = async (slide) => {
    setExporting(true)
    try {
      const board = document.querySelector('.menu-board')
      await document.fonts?.ready
      const data = readBoardData(board)
      const logo = board.querySelector('.board-brand img')
      await logo.decode().catch(() => undefined)
      const photoPath = ['burger-fries.jpg', 'floyd-feature-1.jpg', 'wings-platter.jpg'][slide]
      const foodPhoto = await loadPublicImage(photoPath)
      const outputWidth = 3840
      const outputHeight = 2160
      const canvas = document.createElement('canvas')
      canvas.width = outputWidth
      canvas.height = outputHeight
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas is unavailable')
      renderTvSlide(context, data, logo, slide, foodPhoto)

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
      link.download = `floyd-wings-tv-${slide + 1}-${['sandwiches', 'tacos-nachos-salads', 'seafood'][slide]}-4k.jpg`
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
        <button aria-label="Previous screen" onClick={() => setScreen((current) => (current + 2) % 3)}>‹</button>
        <span className="screen-count">{screen + 1} / 3</span>
        <button aria-label="Next screen" onClick={() => setScreen((current) => (current + 1) % 3)}>›</button>
        <div className="export-menu-wrap">
          <button onClick={() => setExportsOpen(!exportsOpen)} aria-expanded={exportsOpen}>Export TV pictures</button>
          {exportsOpen && <div className="export-menu" aria-label="Export individual 4K TV pictures">
            <button disabled={exporting} onClick={() => exportJpeg(0)}>1 · Burgers &amp; sandwiches</button>
            <button disabled={exporting} onClick={() => exportJpeg(1)}>2 · Tacos, nachos &amp; salads</button>
            <button disabled={exporting} onClick={() => exportJpeg(2)}>3 · Seafood</button>
            {exporting && <span>Rendering 4K JPEG…</span>}
          </div>}
        </div>
        <button onClick={toggleFullscreen}>Full screen</button>
      </>}
      {saved && <span role="status">Saved on this TV</span>}
    </div>
    <main className="menu-board" data-screen={screen}>
      <header className="board-header">
        <div className="board-brand">
          <img src={`${import.meta.env.BASE_URL}floyd-logo.png`} alt="" />
          <div><span>FLOYD WINGS AND GRILL</span><small>MABLETON, GEORGIA</small></div>
        </div>
        <div className="board-header-note"><span>SCREEN {screen + 1} / 3 · FRESH, MADE TO ORDER</span><strong>{screenContent[screen].title}</strong></div>
      </header>

      <section className={`screen-banner${screen === 0 ? ' screen-banner-burgers' : ''}`} aria-hidden="true">
        {screen === 0 ? <>
          <img className="banner-food-background" src={`${import.meta.env.BASE_URL}${screenContent[screen].photo}`} alt="" />
          <div className="burger-banner-title"><span>FRESHLY MADE IN MABLETON</span><h1>HAMBURGERS <i>&amp; SANDWICHES</i></h1></div>
        </> : <img src={`${import.meta.env.BASE_URL}${screenContent[screen].photo}`} alt="" />}
      </section>

      <div className="board-columns" data-screen={screen}>
        <section className="board-panel sandwich-panel" style={{ '--menu-photo': `url("${import.meta.env.BASE_URL}burger-fries.jpg")` }}>
          <div className="panel-heading"><span className="panel-index">01</span><h1>BURGERS <i>&amp;</i> SANDWICHES</h1><span className="heading-star">✳</span></div>
          <p className="panel-description">Fresh ground beef, “house-secret” seasoned and perfectly hand-pressed on the grill. Served with fries, potato salad, cole slaw or fried okra.</p>
          <div className="sandwich-list">
            {[0, 1].map((column) => <div className="sandwich-column" key={column}>
              <div className="price-key" aria-label="Prices shown as sandwich with side, then sandwich only">
                <span></span>
                <span><strong>SANDWICH</strong><small>&amp; SIDE</small></span>
                <span><strong>SANDWICH</strong><small>ONLY</small></span>
              </div>
              {sandwiches.slice(column * 8, column * 8 + 8).map(([name, combo, alone, description]) => <div className="sandwich-row" key={name}>
                <div className="sandwich-copy"><strong>{name}</strong><small>{description}</small></div><Price>{combo}</Price><Price>{alone}</Price>
              </div>)}
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

        <section className="seafood-panel">
          <article className="board-panel seafood-feature"><div className="panel-heading seafood-feature-heading"><span className="panel-index">05</span><h3>Fish Dinner</h3><Price>10.75</Price></div><p className="seafood-general-note">All platters served with your choice of fries, potato salad or coleslaw, and cocktail or tartar sauce.</p><p>2 pieces of catfish, tilapia or whiting. Catfish +$1.</p></article>
          <article className="board-panel seafood-feature"><div className="panel-heading seafood-feature-heading"><span className="panel-index">06</span><h3>Seafood Platter</h3><Price>11.75</Price></div><p className="seafood-general-note">All platters served with your choice of fries, potato salad or coleslaw, and cocktail or tartar sauce.</p><p>2 pieces of catfish, tilapia or whiting with 3 pieces of golden fried shrimp. Catfish +$1.</p></article>
          <article className="board-panel seafood-feature shrimp-feature">
            <div className="panel-heading seafood-feature-heading"><span className="panel-index">07</span><h3>Shrimp Basket</h3></div><p>Jumbo shrimp, lightly dusted and fried golden brown.</p>
            <div className="shrimp-key"><span></span><span>SHRIMP<br />&amp; SIDE</span><span>SHRIMP<br />ONLY</span></div>
            {[
              ['7 Piece', '9.99', '7.99'],
              ['10 Piece', '12.49', '10.99'],
              ['15 Piece', '17.65', '15.99'],
            ].map(([name, combo, alone]) => <div className="shrimp-row" key={name}><strong>{name}</strong><Price>{combo}</Price><Price>{alone}</Price></div>)}
            <div className="drink-note"><span>MAKE IT A MEAL</span><strong>12 oz drink $1 <i>·</i> 16 oz $1.89</strong></div>
          </article>
          <img className="seafood-photo" src={`${import.meta.env.BASE_URL}wings-platter.jpg`} alt="Golden fried seafood and dipping sauce" />
        </section>
      </div>

      <footer className="board-footer"><span>*Prices and menu items may change</span><strong>THANKS FOR DINING WITH US!</strong><span>5345 FLOYD RD SW #118 · MABLETON, GA</span><span className="page-count">SCREEN {screen + 1} / 3</span></footer>
    </main>
    </>
  )
}

export default MenuBoard
