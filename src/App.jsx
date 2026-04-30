import { useState, useEffect, useRef } from 'react'

const TEAM = [
  { task: 'Team-Leader', members: 'Andrei Maximus'}, 
  { task: 'mini-team 1', members: 'David & Taisia' },
  { task: 'mini-team 2', members: 'Luiza & Ale' },
  { task: 'mini-team 3', members: 'Dragoș & Robert' },
]

const LEFT_PANEL = [
  { name: 'Maxim', src: '/maxim.png' },
  { name: 'Dragoș', src: '/dragos.png' },
  { name: 'Robert', src: '/robert.png' },
]

const RIGHT_PANEL = [
  { name: 'Taisia', src: '/taisia.png' },
  { name: 'David', src: '/david.png' },
  { name: 'Ale', src: '/ale.png' },
  { name: 'Luiza', src: '/luiza.png' },
]

function SidePanel({ members, side }) {
  return (
    <div className={`side-panel side-panel--${side}`}>
      <div className="side-fade side-fade--top" />
      {members.map((m) => (
        <div key={m.name} className="side-photo-item">
          <img src={m.src} alt={m.name} className="side-photo" />
          <div className={`side-overlay side-overlay--${side}`} />
        </div>
      ))}
      <div className="side-fade side-fade--bottom" />
    </div>
  )
}

const DEFAULT_WEEKS = [
  {
    id: 1,
    weekNum: 1,
    label: 'Week 1',
    content:
      'We selected our teams and chose the project we will be working on throughout the semester.',
    image: "/im1.jpeg",
  },
  {
    id: 2,
    weekNum: 2,
    label: 'Week 2 · 6 martie',
    content:
      'We divided the project into multiple parts, used diagrams and UML so that we can understand better what we needed to do. Our team leader selected the tasks we were going to work on.\n\nTask 7 → David & Taisia · Task 9 → Luiza & Ale · Task 6 → Dragoș & Robert',
    image: "/im2.jpeg",
  },
  {
    id: 3,
    weekNum: 3,
    label: 'Week 3',
    content: 'Working on our page design at the seminar.',
    image: "/im3.jpeg",
  },
  {
    id: 4,
    weekNum: 4,
    label: 'Week 4',
    content:
      'Every member of the team worked on and finished their respective tasks. Heading into week 5 ready to present our work at the lab.',
    image: null,
  },
  {
    id: 5,
    weekNum: 5,
    label: 'Week 5',
    content:
      '\Handed in our project at the lab today — mix of nerves and relief, but the lab teacher actually had good things to say, so we\'re calling that a win.',
    image: "/week5.jpeg",
  },
  {
    id: 6,
    weekNum: 6,
    label: 'Week 6',
    content:
      'We got the project from 922/2 and we discussed our tasks for this new assignment.',
    image: "/week6.jpeg",
  },
  {
    id: 7,
    weekNum: 7,
    label: 'Week 7',
    content:
      'We worked on this new project. Each member got some tasks for this brand new project that we received. On Wendnesday we turned in our work and it was good!',
    image: "/week7.jpeg",
  },

  {
    id: 8,
    weekNum: 8,
    label: 'Week 8',
    content:
      'Avengers, assemble! New challenge, new team, same ambition.',
    image: "/week8.png",
  }, 

  {
    id: 9,
    weekNum: 9,
    label: 'Week 9',
    content:
      'Tricky week for the team. Good thing we managed to merge the projects and finish the assignment in time.',
    image: "/week9.jpeg",
  },
]

const STORAGE_KEY = 'iss-blog-weeks-v7'

function loadWeeks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULT_WEEKS))
}

function saveWeeks(weeks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks))
  } catch (_) {}
}

// ── Confirm dialog ────────────────────────────────────────────
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal confirm-modal">
        <p className="confirm-message">
          Ești sigur că vrei să ștergi această intrare? Acțiunea nu poate fi anulată.
        </p>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Anulează</button>
          <button className="btn-danger" onClick={onConfirm}>Șterge</button>
        </div>
      </div>
    </div>
  )
}

// ── Add / Edit Modal ──────────────────────────────────────────
function WeekModal({ initial, onClose, onSave, nextWeekNum }) {
  const isEdit = !!initial
  const [label, setLabel] = useState(initial?.label ?? `Week ${nextWeekNum}`)
  const [content, setContent] = useState(initial?.content ?? '')
  const [image, setImage] = useState(initial?.image ?? null)
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation()
    setImage(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = () => {
    if (!label.trim() || !content.trim()) return
    const wn = parseInt(label.match(/\d+/)?.[0]) || nextWeekNum
    onSave({ label: label.trim(), content: content.trim(), image, weekNum: wn })
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editează săptămâna' : 'Adaugă săptămână'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Închide">×</button>
        </div>

        <div className="field">
          <label className="field-label">Etichetă săptămână</label>
          <input
            className="field-input"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Week 7 · 14 apr"
            autoFocus
          />
        </div>

        <div className="field">
          <label className="field-label">Ce s-a întâmplat</label>
          <textarea
            className="field-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descrieți activitățile echipei din această săptămână..."
          />
        </div>

        <div className="field">
          <label className="field-label">Fotografie (opțional)</label>
          <div className="upload-zone" onClick={() => fileRef.current.click()}>
            {image ? (
              <>
                <img src={image} alt="Preview" className="upload-preview" />
                <div className="upload-preview-actions">
                  <span className="upload-preview-label">Apasă pentru a schimba</span>
                  <button className="btn-remove-img" onClick={handleRemoveImage}>
                    Elimină fotografia
                  </button>
                </div>
              </>
            ) : (
              <p><span>Apasă</span> pentru a adăuga o fotografie</p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Anulează</button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!label.trim() || !content.trim()}
          >
            {isEdit ? 'Salvează modificările' : 'Salvează intrarea'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Week card ─────────────────────────────────────────────────
function WeekCard({ week, onEdit, onDelete }) {
  return (
    <div className="week-entry">
      <div className="week-left">
        <span className="week-num">{week.label.split('·')[0].trim()}</span>
        <div className="week-connector" />
      </div>

      <div className="week-right">
        <div className="week-card">
          {week.label.includes('·') && (
            <div className="week-date">{week.label.split('·').slice(1).join('·').trim()}</div>
          )}
          <p className="week-content">{week.content}</p>
          {week.image && (
            <img src={week.image} alt={`Fotografie ${week.label}`} className="week-image" />
          )}
          <div className="week-actions">
            <button className="btn-edit" onClick={() => onEdit(week)}>
              <IconEdit /> Editează
            </button>
            <button className="btn-delete" onClick={() => onDelete(week.id)}>
              <IconTrash /> Șterge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function IconEdit() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 1.75a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25V3h-3V1.75Zm4.5 0V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15H5.405a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15Z" />
    </svg>
  )
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const [weeks, setWeeks] = useState(() => loadWeeks())
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingWeek, setEditingWeek] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    saveWeeks(weeks)
  }, [weeks])

  const nextWeekNum = weeks.length
    ? Math.max(...weeks.map((w) => w.weekNum)) + 1
    : 1

  const handleAdd = ({ label, content, image, weekNum }) => {
    const newEntry = { id: Date.now(), weekNum, label, content, image }
    setWeeks((prev) => [...prev, newEntry].sort((a, b) => a.weekNum - b.weekNum))
    setShowAddModal(false)
  }

  const handleEdit = ({ label, content, image, weekNum }) => {
    setWeeks((prev) =>
      prev
        .map((w) => (w.id === editingWeek.id ? { ...w, label, content, image, weekNum } : w))
        .sort((a, b) => a.weekNum - b.weekNum)
    )
    setEditingWeek(null)
  }

  const handleDeleteConfirm = () => {
    setWeeks((prev) => prev.filter((w) => w.id !== deletingId))
    setDeletingId(null)
  }

  return (
    <>
    <SidePanel members={LEFT_PANEL} side="left" />
    <div className="page">
      <header className="site-header">
        <h1 className="site-title">Blog de blog</h1>
        <p className="site-subtitle">ISS · Banking App · UBB Cluj · 2025–2026</p>
        <div className="team-grid">
          {TEAM.map((t) => (
            <div className="team-badge" key={t.task}>
              <span className="badge-dot" />
              <span className="badge-task">{t.task}</span>
              <span className="badge-sep">·</span>
              <span className="badge-members">{t.members}</span>
            </div>
          ))}
        </div>
      </header>

      <main>
        {weeks.length === 0 ? (
          <div className="empty-state">Nicio intrare încă. Adaugă prima săptămână!</div>
        ) : (
          <div className="timeline">
            {weeks.map((week) => (
              <WeekCard
                key={week.id}
                week={week}
                onEdit={setEditingWeek}
                onDelete={setDeletingId}
              />
            ))}
          </div>
        )}

        <button className="add-week-btn" onClick={() => setShowAddModal(true)}>
          <span className="add-icon">+</span>
          Adaugă săptămână
        </button>
      </main>

      {showAddModal && (
        <WeekModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
          nextWeekNum={nextWeekNum}
        />
      )}

      {editingWeek && (
        <WeekModal
          initial={editingWeek}
          onClose={() => setEditingWeek(null)}
          onSave={handleEdit}
          nextWeekNum={nextWeekNum}
        />
      )}

      {deletingId && (
        <ConfirmDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
    <SidePanel members={RIGHT_PANEL} side="right" />
  </>
  )
}
