# Creating Routes and Layouts

Next.js simplifies routing through its intuitive file system-based router. To define a route, you create a directory within the `app` directory and include a `page.tsx` (or `.js`) file. For example, `app/settings/page.tsx` will create a route accessible at `/settings`. This convention extends to layouts and other special files, forming the basis of Next.js's opinionated approach to web development.

## Static Routes

Static routes are the most basic type of route in Next.js. As demonstrated above, simply placing a `page.tsx` file within a directory creates a static route. Next.js will automatically make this file accessible as a route. Only files named `page` are treated as route components within a directory, with a few exceptions for special files like `layout` and `loading`.

## Dynamic Routes

For dynamic routes, use square brackets `[]` to define parameters within your directory structure. For instance, `app/users/[id]/page.tsx` creates a dynamic route where `[id]` is a parameter. This route would match paths like `/users/123`, `/users/abc`, etc.

**Catch-all Segments:**

Next.js also supports catch-all segments using `[...paramName]`. For example, `app/docs/[...topic]/page.tsx` will match any path starting with `/docs/`, such as `/docs/a/b/c`.

**Optional Catch-all Segments:**

To make a catch-all segment optional (i.e., also match the base route), use `[[...paramName]]`. `app/docs/[[...topic]]/page.tsx` would match both `/docs` and `/docs/a/b`.

## Layouts

Layouts are React components that wrap page components, providing a consistent UI structure across routes. To create a layout, add a `layout.tsx` file within a directory. A root layout is required in the `app` directory to wrap all routes. Layouts persist across page transitions, meaning they do not re-render when navigating between routes that share the same layout.

To render the current page within a layout, use the `{children}` prop.

**Templates:**

If you need a layout-like component that re-renders on every route change, use a `template.tsx` file instead of `layout.tsx`. Templates behave similarly to layouts but are not persistent. Routes will use the nearest `layout` or `template` in their ancestor directory structure.

## Route Groups

Route groups allow you to organize routes without affecting the URL path structure. By wrapping a directory name in parentheses, like `(group-name)`, you create a route group. This is useful for applying layouts to multiple routes without segmenting the URL.

For example, you might use route groups to separate marketing pages from application pages within the `app` directory, like `app/(marketing)/` and `app/(app)/`. This allows you to define different layouts for each group (e.g., a marketing layout and an application layout) without `/marketing/` or `/app/` appearing in the URL paths.

## Routing

Use the `<Link>` component. It performs prefetching of routes and client side routing. If you don't use this you will be navigating with full page loads from the server.

There's much more to explore in the [official documentation](https://nextjs.org/docs/app/building-your-application/routing).

## Exercise

Look at the routes below. Create each one of them. Remember to export a React component as the default export in each `page.tsx` file. The component can render `null` if you just want to test the routing. For layouts, be sure to render `{children}`.

---

# Server Actions for Authentication and Form Validation

Server Actions, also known as server functions, are a React feature enabling client components to call asynchronous functions directly on the server. They are especially powerful within React Server Components (RSCs), particularly for form handling. Consider them streamlined API endpoints for your application, offering a more integrated and efficient way to manage server-side logic. For more in-depth information, consult the official [Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) and [React](https://react.dev/reference/rsc/server-functions) documentation.

## Auth Server Functions

```ts
//....
export async function signIn(formData: FormData): Promise<ActionResponse> {
  try {
    // Add a small delay to simulate network latency
    await mockDelay(700)

    // Extract data from form
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate with Zod
    const validationResult = SignInSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Find user by email
    const user = await getUserByEmail(data.email)
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: {
          email: ['Invalid email or password'],
        },
      }
    }

    // Verify password
    const isPasswordValid = await verifyPassword(data.password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: {
          password: ['Invalid email or password'],
        },
      }
    }

    // Create session
    await createSession(user.id)

    return {
      success: true,
      message: 'Signed in successfully',
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      message: 'An error occurred while signing in',
      error: 'Failed to sign in',
    }
  }
}

export async function signUp(formData: FormData): Promise<ActionResponse> {
  try {
    // Add a small delay to simulate network latency
    await mockDelay(700)

    // Extract data from form
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    // Validate with Zod
    const validationResult = SignUpSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(data.email)
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
        errors: {
          email: ['User with this email already exists'],
        },
      }
    }

    // Create new user
    const user = await createUser(data.email, data.password)
    if (!user) {
      return {
        success: false,
        message: 'Failed to create user',
        error: 'Failed to create user',
      }
    }

    // Create session for the newly registered user
    await createSession(user.id)

    return {
      success: true,
      message: 'Account created successfully',
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      message: 'An error occurred while creating your account',
      error: 'Failed to create account',
    }
  }
}

export async function signOut(): Promise<void> {
  try {
    await mockDelay(300)
    await deleteSession()
  } catch (error) {
    console.error('Sign out error:', error)
    throw new Error('Failed to sign out')
  } finally {
    redirect('/signin')
  }
}
```