import { useRef, useState, type ReactNode, type PointerEvent } from 'react'

export default function KanbanScroll({ children }: { children: ReactNode }) {
  const [dragging, setDragging] = useState(false)
  const gesture = useRef<{ id: number; x: number; scroll: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  function start(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false
    // Touch retains native scrolling, including vertical page gestures.
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    gesture.current = { id: event.pointerId, x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false }
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.id !== event.pointerId) return
    const distance = event.clientX - current.x
    if (!current.moved && Math.abs(distance) < 6) return
    if (!current.moved) {
      current.moved = true
      suppressClick.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    event.preventDefault()
    event.currentTarget.scrollLeft = current.scroll - distance
  }
  function finish(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.id !== event.pointerId) return
    gesture.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  return <div
    className={`select-none overflow-x-auto pb-4 ${dragging ? 'cursor-grabbing [&_button]:cursor-grabbing' : 'cursor-grab [&_button]:cursor-grab'}`}
    role="region"
    aria-label="Quadro Kanban de chamados. Arraste para navegar horizontalmente ou use as setas do teclado."
    tabIndex={0}
    onPointerDown={start}
    onPointerMove={move}
    onPointerUp={finish}
    onPointerCancel={finish}
    onLostPointerCapture={() => { gesture.current = null; setDragging(false) }}
    onPointerLeave={() => { if (!gesture.current?.moved) gesture.current = null }}
    onDragStart={event => event.preventDefault()}
    onClickCapture={event => {
      if (suppressClick.current && event.detail !== 0) {
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
      }
    }}
  >{children}</div>
}