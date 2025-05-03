# Book Reading Application Routes

## Book Routes

The application provides the following routes for accessing books:

### Main Routes
- `/book/[slug]` - View a book by its slug identifier
- `/book/by-id/[id]` - View a book directly by its ID

### Convenience Routes
- `/books/[slug]` - Redirects to `/book/[slug]`
- `/read/[id]` - Redirects to `/book/by-id/[id]`

## Route Structure

The application follows Next.js file-based routing conventions:

```
app/
├── book/
│   ├── [slug]/
│   │   └── page.tsx      # Main book viewer by slug
│   └── by-id/
│       └── [id]/
│           └── page.tsx  # Book viewer by ID
│
├── books/
│   └── [slug]/
│       └── page.tsx      # Redirects to /book/[slug]
│
└── read/
    └── [id]/
        └── page.tsx      # Redirects to /book/by-id/[id]
```

## Component Structure

All book viewing routes use the `BookView` component which:
1. Accepts a `bookId` prop
2. Fetches the book data using the `getBookById` server action
3. Displays the book with interactive page flipping

Routes that receive a slug parameter first fetch the book ID using `getBookBySlug` before passing it to the `BookView` component. 