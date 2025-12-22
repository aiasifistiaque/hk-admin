# Quick Start Guide - Customer Service Chat

## 🚀 Getting Started

### View the System

1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/customer-service`
3. You'll see 3 mock queries

### Test the Features

#### Query List Page

```
/customer-service
```

- Search for queries
- Filter by status
- Click on Query #1 (John Doe) to open chat

#### Chat Page

```
/customer-service/1
```

- View messages
- Send new messages
- Change status in top-right dropdown
- Try to leave (will warn if status is "ongoing")

## 🔧 Customization

### Change Current Agent

Edit these lines:

**In page.tsx (line 49):**

```typescript
const currentAgentId = 'agent_123'; // Your agent ID
```

**In [id]/page.tsx (lines 107-108):**

```typescript
const currentAgentId = 'agent_123'; // Your agent ID
const currentAgentName = 'Agent Sarah'; // Your agent name
```

### Add More Mock Queries

Edit `mockQueries` array in `/customer-service/page.tsx`:

```typescript
const mockQueries: Query[] = [
	{
		id: '4',
		customerId: 'C004',
		customerName: 'New Customer',
		subject: 'New Query',
		status: 'unresolved',
		createdAt: new Date(),
		updatedAt: new Date(),
		messageCount: 0,
	},
	// ... more queries
];
```

### Modify Status Colors

Edit `QueryStatusBadge.tsx` (lines 27-48):

```typescript
const styles = {
	statusConfig: {
		unresolved: {
			color: 'blue', // Change to any Chakra color
			label: 'Unresolved',
			icon: '🆕',
		},
		// ... other statuses
	},
};
```

## 🔌 Backend Integration

### Step 1: Create API Routes

Create these files in `/src/app/api/`:

```
api/
├── queries/
│   ├── route.ts              // GET all queries
│   └── [id]/
│       ├── route.ts          // GET single query
│       ├── messages/
│       │   └── route.ts      // POST new message
│       ├── status/
│       │   └── route.ts      // PATCH status
│       └── assign/
│           └── route.ts      // POST assign/release
```

### Step 2: Replace Mock Data

**In page.tsx:**

```typescript
useEffect(() => {
	const fetchQueries = async () => {
		const res = await fetch('/api/queries');
		const data = await res.json();
		setQueries(data);
	};
	fetchQueries();
}, []);
```

**In [id]/page.tsx:**

```typescript
useEffect(() => {
	const fetchQuery = async () => {
		const res = await fetch(`/api/queries/${queryId}`);
		const data = await res.json();
		setQuery(data);
	};
	fetchQuery();
}, [queryId]);
```

### Step 3: Implement Message Sending

**In ChatWindow.tsx:**

```typescript
const handleSendMessage = async (content: string) => {
	const res = await fetch(`/api/queries/${currentQuery.id}/messages`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			senderId: currentAgentId,
			senderName: currentAgentName,
			content,
		}),
	});

	const newMessage = await res.json();
	setMessages([...messages, newMessage]);
};
```

### Step 4: Implement Status Changes

**In ChatWindow.tsx:**

```typescript
const handleStatusChange = async (newStatus: QueryStatus) => {
	await fetch(`/api/queries/${currentQuery.id}/status`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status: newStatus, agentId: currentAgentId }),
	});

	setCurrentQuery({ ...currentQuery, status: newStatus });
};
```

## 🧪 Testing Checklist

- [ ] Can view all queries
- [ ] Can search queries
- [ ] Can filter by status
- [ ] Can open available query
- [ ] Cannot open locked query
- [ ] Status auto-changes to "ongoing"
- [ ] Can send messages
- [ ] Can change status
- [ ] Cannot leave with "ongoing" status
- [ ] Cannot open second chat with active chat
- [ ] Status badges display correct colors
- [ ] Mobile responsive works
- [ ] Dark mode works

## 🎨 Theming

The system uses your existing theme from `/src/theme/colors.theme.ts`.

### Color Modes

Components automatically adapt to light/dark mode using:

```typescript
const bgColor = useColorModeValue('white', 'black');
```

### Brand Colors

Uses `brand.500`, `brand.600` from your theme for primary actions.

## 📝 Common Tasks

### Add New Status

1. Add to `QueryStatus` type in `types.ts`
2. Add to `statusConfig` in `QueryStatusBadge.tsx`
3. Add option in `StatusControl.tsx` select
4. Update backend validation

### Add File Upload

1. Add file input to `MessageInput.tsx`
2. Handle file in `handleSendMessage`
3. Display files in `MessageItem.tsx`
4. Update `Message` type in `types.ts`

### Add Agent Avatars

1. Add `avatarUrl` to `Agent` type
2. Display in `MessageItem.tsx`
3. Display in `AgentLockIndicator.tsx`

## 🐛 Troubleshooting

### Queries Not Displaying

- Check mock data in `page.tsx`
- Verify `Layout` component is imported
- Check console for errors

### Chat Not Opening

- Verify query ID exists in `mockQueryDetails`
- Check routing in `QueryCard` onClick
- Verify `useRouter` from `next/navigation`

### Styles Not Applying

- Ensure Chakra UI is wrapped in app
- Check theme provider in layout
- Verify style object syntax

## 📚 Additional Resources

- **GUIDELINES.md**: Full development guidelines
- **README.md**: Complete system documentation
- **types.ts**: TypeScript interfaces
- Chakra UI Docs: https://chakra-ui.com

## 🎯 Next Features to Add

1. Real-time updates (WebSocket)
2. Push notifications
3. File attachments
4. Canned responses
5. Agent notes (internal)
6. Query assignment rules
7. Performance metrics
8. Export chat history
9. Customer info sidebar
10. Multi-language support

---

Need help? Check the main README.md or GUIDELINES.md for detailed information.
