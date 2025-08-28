const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jer Tup',
        username: 'testUser',
        password: 'securepassword'
      }
    })
    await page.goto('http://localhost:5173')
  })
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

  const locator = page.getByText('Blogs')
  await expect(locator).toBeVisible()
  
  // Check for login form or other elements that should always be present
  await expect(page.getByText('Blogs')).toBeVisible()
  })

  test('user can login', async ({page}) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', {name: 'login'}).click()
    await page.getByLabel('Username').fill('testUser')
    await page.getByLabel('Password').fill('securepassword')
    await page.getByRole('button', {name: 'login'}).click()

    await expect(page.getByText('Jer Tup logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('Username').fill('testUser')
      await page.getByLabel('Password').fill('securepassword')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('user can create a new blog', async ({ page }) => {
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('E2E Testing with Playwright')
      await page.getByLabel('Author').fill('Playwright')
      await page.getByLabel('URL').fill('http://E2E/Testing')
      await page.getByRole('button', { name: 'Add Blog'}).click()
      
      // Wait for the notification message first
      await expect(page.getByText('a new blog E2E Testing with Playwright by Playwright added')).toBeVisible()
      
      // Then check that the blog appears in the blog list with a more specific selector
      await expect(page.locator('.blog-title-author').filter({ hasText: 'E2E Testing with Playwright by Playwright' })).toBeVisible()
    })
    test('user can like a blog', async ({ page}) => {
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('E2E Testing with Playwright')
      await page.getByLabel('Author').fill('Playwright')
      await page.getByLabel('URL').fill('http://E2E/Testing')
      await page.getByRole('button', { name: 'Add Blog'}).click()

      await page.locator('.blog-title-author')
        .filter({ hasText: "E2E Testing with Playwright by Playwright"})
        .getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like'}).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
      
    })

    test('user can delete a blog they created', async ({ page }) => {
      // Create a blog first
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('Blog to Delete')
      await page.getByLabel('Author').fill('Test Author')
      await page.getByLabel('URL').fill('http://delete.test')
      await page.getByRole('button', { name: 'Add Blog'}).click()
      
      // Wait for blog creation
      await expect(page.getByText('a new blog Blog to Delete by Test Author added')).toBeVisible()
      
      // Expand the blog to see the delete button
      await page.locator('.blog-title-author')
        .filter({ hasText: "Blog to Delete by Test Author"})
        .getByRole('button', { name: 'view' }).click()
      
      // Handle the confirmation dialog - accept it
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('Remove blog Blog to Delete by Test Author?')
        await dialog.accept()
      })
      
      // Click the delete button
      await page.getByRole('button', { name: 'Delete' }).click()
      
      // Verify the blog is no longer visible
      await expect(page.locator('.blog-title-author')
        .filter({ hasText: "Blog to Delete by Test Author"})).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page, request }) => {
      // Create a second user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Second User',
          username: 'secondUser',
          password: 'anotherpassword'
        }
      })
      
      // First user creates a blog
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('First User Blog')
      await page.getByLabel('Author').fill('First Author')
      await page.getByLabel('URL').fill('http://first.test')
      await page.getByRole('button', { name: 'Add Blog'}).click()
      
      // Wait for blog creation
      await expect(page.getByText('a new blog First User Blog by First Author added')).toBeVisible()
      
      // Verify first user can see delete button when blog is expanded
      await page.locator('.blog-title-author')
        .filter({ hasText: "First User Blog by First Author"})
        .getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
      
      // Logout
      await page.getByRole('button', { name: 'logout' }).click()
      
      // Login as second user
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('Username').fill('secondUser')
      await page.getByLabel('Password').fill('anotherpassword')
      await page.getByRole('button', { name: 'login' }).click()
      
      // Verify second user is logged in
      await expect(page.getByText('Second User logged in')).toBeVisible()
      
      // Expand the blog created by first user
      await page.locator('.blog-title-author')
        .filter({ hasText: "First User Blog by First Author"})
        .getByRole('button', { name: 'view' }).click()
      
      // Verify second user cannot see the delete button
      await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
    })

    test ('ensure that blogs are arranged by most likes', async ({ page }) => {
      // Create first blog
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('E2E Testing with Playwright')
      await page.getByLabel('Author').fill('Playwright')
      await page.getByLabel('URL').fill('http://E2E/Testing')
      await page.getByRole('button', { name: 'Add Blog'}).click()
      
      // Wait for first blog to be created
      await expect(page.getByText('a new blog E2E Testing with Playwright by Playwright added')).toBeVisible()

      // Create second blog
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('Blog to like')
      await page.getByLabel('Author').fill('Test Author')
      await page.getByLabel('URL').fill('http://like.test')
      await page.getByRole('button', { name: 'Add Blog'}).click()
      
      // Wait for second blog to be created
      await expect(page.getByText('a new blog Blog to like by Test Author added')).toBeVisible()

      // Create third blog
      await page.getByRole('button', { name: 'New Blog'}).click()
      await page.getByLabel('Title').fill('Blog to notLike')
      await page.getByLabel('Author').fill('Test Author2')
      await page.getByLabel('URL').fill('http://like2.test')
      await page.getByRole('button', { name: 'Add Blog'}).click()
      
      // Wait for third blog to be created
      await expect(page.getByText('a new blog Blog to notLike by Test Author2 added')).toBeVisible()

      // Like the first blog 2 times
      // Function to like a blog multiple times
      const likeBlog = async (blogTitle, numberOfLikes) => {
        await page.locator('.blog-title-author')
          .filter({ hasText: blogTitle })
          .getByRole('button', { name: 'view' }).click()
        
        for (let i = 1; i <= numberOfLikes; i++) {
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText(`Likes: ${i}`)).toBeVisible()
        }
        
        await page.getByRole('button', { name: 'hide' }).click()
      }

      // Like the first blog 2 times
      await likeBlog("E2E Testing with Playwright by Playwright", 2)

      // Like the second blog 3 times
      await likeBlog("Blog to like by Test Author", 3)

      // Verify that the blogs are in order
      await expect(page.locator('.blog-title-author').nth(0)).toContainText('Blog to like by Test Author')
      await expect(page.locator('.blog-title-author').nth(1)).toContainText('E2E Testing with Playwright by Playwright')
      await expect(page.locator('.blog-title-author').nth(2)).toContainText('Blog to notLike by Test Author2')
    })

  })
})