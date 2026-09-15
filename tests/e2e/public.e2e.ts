import { expect, test } from '@playwright/test';

const publicRoutes = ['/', '/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];

test('all public routes activate without browser or network errors', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') problems.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`); });
  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.locator('#main-content h1')).toBeVisible();
  }
  expect(problems.filter((problem) => !problem.includes('favicon'))).toEqual([]);
});

test('navigation, language, article, 404, and admin redirect remain functional', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Tentang Kami', exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await page.getByRole('button', { name: 'Ganti bahasa' }).first().click();
  await expect(page.getByRole('link', { name: 'About Us', exact: true }).first()).toBeVisible();
  await page.goto('/news');
  const article = page.getByRole('link', { name: /Baca selengkapnya|Read more/ }).first();
  if (await article.count()) { await article.click(); await expect(page.locator('article h1')).toBeVisible(); }
  await page.goto('/route-tidak-ada');
  await expect(page.getByRole('heading', { name: /Halaman tidak ditemukan|Page not found/ })).toBeVisible();
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('contact form handles a successful RPC response', async ({ page }) => {
  await page.route('**/rest/v1/rpc/submit_contact_message', (route) => route.fulfill({ status: 204, body: '' }));
  await page.goto('/contact');
  await page.getByLabel('Nama').fill('Pengguna Test');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Kebutuhan Anda').fill('Membutuhkan konsultasi LED untuk pengujian website.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /Kirim Permintaan/ }).click();
  await expect(page.getByText(/berhasil dikirim/i)).toBeVisible();
});
