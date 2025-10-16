import { test, expect } from '@playwright/test'

test('displays DM screen toolbar controls', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Widget Library' })).toBeVisible()
  await expect(page.getByRole('button', { name: /hide sidebar/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /hide widgets/i })).toBeVisible()
})

test('navigates between the DM screen and widget library', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Widget Library' }).click()
  await expect(page).toHaveURL(/widget-library/)
  await expect(page.getByRole('heading', { level: 1, name: 'Widget Library' })).toBeVisible()
  await page.getByRole('link', { name: '← Back to DM Screen' }).click()
  await expect(page).toHaveURL('/')
})
