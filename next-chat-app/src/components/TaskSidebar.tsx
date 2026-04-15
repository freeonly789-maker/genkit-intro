'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'idle' | 'loading' | 'done';
  description: string;
  completedAt?: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Analyze Tab vs Agent Usage Patterns',
    status: 'done',
    description: 'All set! We now track focus share, switching rates, and rolling engagement so PMs can compare tab-first and agent-first',
    completedAt: 'now'
  },
  {
    id: '2',
    title: 'Plan Mission Control',
    status: 'loading',
    description: 'Generating plan',
  },
  {
    id: '3',
    title: 'Build Landing Page',
    status: 'done',
    description: 'Fonts preload in the head...',
    completedAt: 'now'
  },
  {
    id: '4',
    title: 'PyTorch MNIST Experiment',
    status: 'done',
    description: 'PyTorch MNIST Experiments',
    completedAt: '10m'
  },
  {
    id: '5',
    title: 'Set up Cursor Rules for ...',
    status: 'done',
    description: 'Set up Cursor Rules for Dashboard...',
    completedAt: '30m'
  },
  {
    id: '6',
    title: 'Bioinformatics Tools',
    status: 'loading',
    description: '+135 -21 · Bioinformatics Tools',
  }
];

export default function TaskSidebar() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div className="sidebar-container" style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '280px',
      backgroundColor: 'var(--bg)',
      borderRight: '1px solid var(--border)',
      overflowY: 'auto',
      paddingTop: '1rem',
      zIndex: 40
    }}>
      {/* Header */}
      <div style={{
        padding: '0 1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--muted-fg)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Ready for Review
        </h2>
      </div>

      {/* Tasks List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0 0.5rem'
      }}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const isLoading = task.status === 'loading';
  const isDone = task.status === 'done';

  return (
    <button
      type="button"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        border: 'none',
        padding: '0.625rem 0.75rem',
        paddingLeft: 'calc(2px + 0.75rem)',
        backgroundColor: isDone ? 'var(--muted)' : 'transparent',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        borderRadius: '0.375rem',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        if (!isDone) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--muted)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDone) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }
      }}
    >
      {/* Icon Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1rem',
        height: '1rem',
        marginTop: '0.125rem',
        flexShrink: 0,
        position: 'relative'
      }}>
        {isLoading ? (
          // Loading spinner icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 256 256"
            style={{
              color: 'var(--muted-fg)',
              animation: 'spin 1s linear infinite'
            }}
          >
            <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path>
          </svg>
        ) : isDone ? (
          // Checkmark icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: 'var(--accent)'
            }}
          >
            <path d="M8 13.9766C4.70117 13.9766 2.02344 11.2988 2.02344 8C2.02344 4.70117 4.70117 2.02344 8 2.02344C11.2988 2.02344 13.9766 4.70117 13.9766 8C13.9766 11.2988 11.2988 13.9766 8 13.9766ZM8 12.9805C10.7539 12.9805 12.9805 10.7539 12.9805 8C12.9805 5.24609 10.7539 3.01953 8 3.01953C5.24609 3.01953 3.01953 5.24609 3.01953 8C3.01953 10.7539 5.24609 12.9805 8 12.9805ZM7.35547 10.7832C7.16211 10.7832 7.00391 10.7012 6.85742 10.5078L5.42773 8.75C5.3457 8.63867 5.29297 8.51562 5.29297 8.38672C5.29297 8.12891 5.49219 7.92383 5.74414 7.92383C5.9082 7.92383 6.03711 7.9707 6.17773 8.1582L7.33203 9.65234L9.76367 5.75C9.875 5.58008 10.0215 5.48633 10.168 5.48633C10.4141 5.48633 10.6484 5.65625 10.6484 5.91992C10.6484 6.04883 10.5723 6.17773 10.5078 6.29492L7.83008 10.5078C7.71289 10.6895 7.54883 10.7832 7.35547 10.7832Z"></path>
          </svg>
        ) : null}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
        gap: '0.0625rem'
      }}>
        {/* Title and Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: isDone ? 'var(--fg)' : 'var(--muted-fg)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {task.title}
          </div>
          {isDone && task.completedAt && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--muted-fg)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              {task.completedAt}
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--muted-fg)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          opacity: 0.8
        }}>
          {task.description}
        </div>
      </div>
    </button>
  );
}
