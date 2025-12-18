# Customer Service Chat System - Development Guidelines

## Overview

A modular customer service chat system that allows CS agents to manage and respond to customer queries with concurrent access control and status management.

## System Architecture

### Pages

1. **Query List Page** (`/customer-service`)

   - Displays all customer queries
   - Shows query status, assigned agent, and metadata
   - Filters by status (unresolved, ongoing, resolved, for-later, invalid, follow-up)
   - Click to open chat (if available)

2. **Chat Page** (`/customer-service/[id]`)
   - Full chat interface for selected query
   - Real-time message display
   - Status controls in top-right corner
   - Agent must mark as "ongoing" to enter
   - Agent must change status to leave

## Component Structure

### Core Components (All under `_components/`)

1. **QueryList.tsx** (~80 lines)

   - Container for all query cards
   - Handles filtering and sorting
   - Shows agent's active chat prominently

2. **QueryCard.tsx** (~90 lines)

   - Individual query preview
   - Shows: customer name, subject, status, timestamp, assigned agent
   - Visual indicators for availability (busy/available)
   - Click handler with validation

3. **ChatWindow.tsx** (~95 lines)

   - Main chat container
   - Combines ChatHeader, MessageList, MessageInput
   - Manages chat state

4. **ChatHeader.tsx** (~85 lines)

   - Query metadata (customer, subject, ID)
   - Status control dropdown (top-right)
   - Leave chat button (requires status change)

5. **MessageList.tsx** (~90 lines)

   - Scrollable message container
   - Auto-scroll to newest
   - Distinguishes customer vs agent messages

6. **MessageItem.tsx** (~70 lines)

   - Individual message bubble
   - Shows sender, timestamp, content
   - Different styling for customer/agent

7. **MessageInput.tsx** (~80 lines)

   - Text input area
   - Send button
   - Character counter (optional)

8. **StatusControl.tsx** (~85 lines)

   - Status dropdown/selector
   - Valid statuses: ongoing, resolved, for-later, unresolved, invalid, follow-up
   - Validation before status change

9. **QueryStatusBadge.tsx** (~60 lines)

   - Visual status indicator
   - Color-coded badges
   - Icons for each status

10. **AgentLockIndicator.tsx** (~65 lines)
    - Shows if query is locked by another agent
    - Display agent name and duration
    - Warning messages

## Status Management

### Query Statuses

- **unresolved** (default): New query, available to take
- **ongoing**: Currently being handled by an agent (locked)
- **resolved**: Query completed successfully
- **for-later**: Needs follow-up, but not now
- **invalid**: Spam or irrelevant query
- **follow-up**: Requires additional action

### Business Rules

1. Agent must mark query as "ongoing" when entering chat
2. Query becomes unavailable to others when marked "ongoing"
3. Agent cannot open other chats while having an active "ongoing" chat
4. Agent must change status from "ongoing" before leaving
5. Only one agent can have a query in "ongoing" status

## Styling Guidelines

### Style Objects

- All styles defined as objects below component
- Use Chakra UI sx prop or style objects
- Follow existing theme patterns from `/theme/colors.theme.ts`

### Color Scheme

```typescript
const styles = {
	statusColors: {
		unresolved: 'blue.500',
		ongoing: 'orange.500',
		resolved: 'green.500',
		forLater: 'purple.500',
		invalid: 'red.500',
		followUp: 'teal.500',
	},
	backgrounds: {
		light: 'white',
		dark: 'black',
		card: 'background.light', // from theme
	},
};
```

### Layout

- Use Chakra UI Grid, Flex, Box components
- Mobile-first responsive design
- Consistent spacing: 2, 4, 6, 8 units

## Data Structure

### Query Object

```typescript
interface Query {
	id: string;
	customerId: string;
	customerName: string;
	subject: string;
	status: QueryStatus;
	assignedAgent?: string;
	assignedAgentId?: string;
	createdAt: Date;
	updatedAt: Date;
	messages: Message[];
}
```

### Message Object

```typescript
interface Message {
	id: string;
	queryId: string;
	senderId: string;
	senderType: 'customer' | 'agent';
	content: string;
	timestamp: Date;
}
```

## API Endpoints (To Be Implemented)

- `GET /api/queries` - Get all queries with filters
- `GET /api/queries/:id` - Get single query with messages
- `POST /api/queries/:id/messages` - Send new message
- `PATCH /api/queries/:id/status` - Update query status
- `POST /api/queries/:id/assign` - Assign query to agent
- `POST /api/queries/:id/release` - Release query from agent

## State Management

- Use Redux store (existing pattern in project)
- Store active query ID in agent state
- Sync query status updates across components
- Real-time updates via WebSocket (future enhancement)

## Code Quality Standards

### Component Rules

- Max 100 lines per component
- Single responsibility principle
- Styles object at bottom
- TypeScript strict mode
- Proper prop types

### File Organization

```
customer-service/
├── page.tsx (Query List Page)
├── [id]/
│   └── page.tsx (Chat Page)
├── _components/
│   ├── QueryList.tsx
│   ├── QueryCard.tsx
│   ├── ChatWindow.tsx
│   ├── ChatHeader.tsx
│   ├── MessageList.tsx
│   ├── MessageItem.tsx
│   ├── MessageInput.tsx
│   ├── StatusControl.tsx
│   ├── QueryStatusBadge.tsx
│   ├── AgentLockIndicator.tsx
│   └── index.tsx (exports)
└── GUIDELINES.md
```

## Testing Checklist

- [ ] Agent can view all queries
- [ ] Agent can filter by status
- [ ] Agent can open available query
- [ ] Agent cannot open busy query
- [ ] Status changes to "ongoing" on entry
- [ ] Query locks for other agents
- [ ] Messages send successfully
- [ ] Status can be changed via dropdown
- [ ] Agent cannot open second chat while one is ongoing
- [ ] Status must be changed before leaving
- [ ] Badge colors match status
- [ ] Mobile responsive layout

## Performance Considerations

- Lazy load messages (pagination)
- Debounce search/filter inputs
- Memoize expensive calculations
- Virtual scrolling for large message lists

## Accessibility

- Keyboard navigation support
- ARIA labels for status badges
- Screen reader friendly
- Focus management in modals

## Future Enhancements

- Real-time WebSocket updates
- Push notifications for new queries
- Typing indicators
- File attachment support
- Canned responses
- Agent performance metrics
- Query routing/assignment rules
