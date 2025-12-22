# Component Architecture

## 📊 Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     customer-service/                        │
│                         page.tsx                             │
│                    (Query List Page)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   <QueryList />                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │ <QueryCard/> │  │ <QueryCard/> │  │ <QueryCard/>│  │ │
│  │  │              │  │              │  │             │  │ │
│  │  │  [Badge]     │  │  [Badge]     │  │  [Badge]    │  │ │
│  │  │  [Lock?]     │  │  [Lock?]     │  │  [Lock?]    │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

                            ↓ Click Query

┌─────────────────────────────────────────────────────────────┐
│                  customer-service/[id]/                      │
│                         page.tsx                             │
│                      (Chat Page)                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  <ChatWindow />                        │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │              <ChatHeader />                      │  │ │
│  │  │  Customer: John Doe                              │  │ │
│  │  │  [Badge] [StatusControl] [Leave]                 │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │              <MessageList />                     │  │ │
│  │  │  ┌────────────────────┐                          │  │ │
│  │  │  │  <MessageItem />   │ ← Customer Message       │  │ │
│  │  │  └────────────────────┘                          │  │ │
│  │  │              ┌────────────────────┐              │  │ │
│  │  │              │  <MessageItem />   │ ← Agent      │  │ │
│  │  │              └────────────────────┘              │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │             <MessageInput />                     │  │ │
│  │  │  [Text Area]                         [Send 📤]   │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Component Hierarchy

```
App
├── customer-service/page.tsx (Query List)
│   └── QueryList
│       ├── QueryCard (multiple)
│       │   ├── QueryStatusBadge
│       │   └── AgentLockIndicator (conditional)
│       └── Filters (search, status)
│
└── customer-service/[id]/page.tsx (Chat)
    └── ChatWindow
        ├── ChatHeader
        │   ├── QueryStatusBadge
        │   └── StatusControl
        ├── MessageList
        │   └── MessageItem (multiple)
        └── MessageInput
```

## 🔄 Data Flow

```
┌─────────────┐
│  Mock Data  │ (Replace with API)
└──────┬──────┘
       │
       ├─→ page.tsx (Query List)
       │   ├─→ QueryList receives queries[]
       │   └─→ QueryCard receives individual query
       │
       └─→ [id]/page.tsx (Chat)
           └─→ ChatWindow receives query with messages[]
               ├─→ MessageList receives messages[]
               └─→ MessageInput sends new message
```

## 🎯 Component Responsibilities

### Query List Page Components

**QueryList** (Container)

- Manages search and filter state
- Renders grid of QueryCards
- Handles navigation to chat

**QueryCard** (Presentational)

- Displays query summary
- Shows status badge
- Shows lock indicator if busy
- Click handler for opening chat

**QueryStatusBadge** (Presentational)

- Renders color-coded status
- Shows status icon and label

**AgentLockIndicator** (Presentational)

- Shows when query is locked
- Displays agent name and duration

### Chat Page Components

**ChatWindow** (Container)

- Manages chat state
- Coordinates child components
- Handles status changes
- Marks query as ongoing on entry

**ChatHeader** (Presentational + Logic)

- Displays query metadata
- Contains status control
- Leave chat button

**StatusControl** (Smart Component)

- Status dropdown
- Validates status changes
- Prevents leaving with ongoing status
- Triggers API calls

**MessageList** (Container)

- Scrollable message container
- Auto-scrolls to newest
- Renders MessageItems

**MessageItem** (Presentational)

- Individual message bubble
- Different styles for customer/agent
- Shows timestamp and sender

**MessageInput** (Smart Component)

- Text input with validation
- Send button with loading state
- Character counter
- Keyboard shortcuts (Enter to send)

## 🔐 Business Logic Flow

### Opening a Chat

```
1. User clicks QueryCard
2. QueryList checks if agent has active chat
3. If yes → Show alert
4. If no → Navigate to /customer-service/[id]
5. Chat page checks if query is locked
6. If locked → Show error
7. If available → Load ChatWindow
8. ChatWindow automatically marks as "ongoing"
9. Query becomes unavailable to others
```

### Sending a Message

```
1. User types message in MessageInput
2. Presses Enter or clicks Send
3. Message sent to API (currently mock)
4. New message added to MessageList
5. Auto-scroll to bottom
6. Input cleared
```

### Changing Status

```
1. Agent selects new status in dropdown
2. StatusControl validates change
3. API call to update status (currently mock)
4. Query state updated
5. Toast notification shown
6. If changed from "ongoing" → Query becomes available
```

### Leaving Chat

```
1. Agent clicks Leave Chat
2. StatusControl checks current status
3. If "ongoing" → Show warning, prevent leave
4. If other status → Allow navigation
5. Navigate back to /customer-service
6. Query becomes available to others
```

## 📦 Shared Types

```typescript
// types.ts exports:
- QueryStatus (union type)
- Query (interface)
- Message (interface)
- Agent (interface)
```

All components import from `./types` for type safety.

## 🎨 Styling Strategy

- **Theme Integration**: Uses `useColorModeValue` for dark mode
- **Style Objects**: Defined at bottom of each component
- **Chakra Props**: Inline for simple styles
- **Style Objects**: For complex/reusable styles
- **Responsive**: Breakpoints: `base`, `md`, `lg`

## 🔧 Extension Points

### Easy to Add

1. **New Status**: Add to type, badge config, dropdown
2. **File Upload**: Extend Message type, add to input
3. **Avatars**: Add to Agent/Customer, display in messages
4. **Timestamps**: Already in Message, can enhance display
5. **Read Receipts**: Add to Message type, show indicator

### Moderate Complexity

1. **Real-time Updates**: Add WebSocket connection
2. **Push Notifications**: Integrate notification API
3. **Typing Indicators**: Add to ChatWindow state
4. **Agent Notes**: New component, separate from messages
5. **Query Assignment**: Add assignment logic to backend

### Advanced Features

1. **AI Suggestions**: Integrate ML model for responses
2. **Analytics Dashboard**: Track metrics, response times
3. **Multi-language**: i18n integration
4. **Voice Messages**: Add audio recording
5. **Video Chat**: Integrate WebRTC

---

This architecture ensures maintainability, scalability, and follows React best practices!
