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

test('canonical public URLs stay indexable after hydration', async ({ page }) => {
  for (const route of publicRoutes) {
    const canonicalPath = route === '/' ? route : `${route}/`;
    await page.goto(canonicalPath);
    await expect(page.locator('#root')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${canonicalPath}$`));
    expect(await page.title()).not.toContain('Halaman Tidak Ditemukan');
  }
});

test('navigation, language, article, 404, and admin redirect remain functional', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Tentang Kami', exact: true }).first().click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.getByRole('button', { name: 'Ganti bahasa' }).first().click();
  await expect(page.getByRole('link', { name: 'About Us', exact: true }).first()).toBeVisible();
  await page.goto('/news');
  const article = page.getByRole('link', { name: /Baca selengkapnya|Read more/ }).first();
  if (await article.count()) {
    await article.click();
    await expect(page).toHaveURL(/\/news\/[^/]+\/$/);
    await expect(page.locator('article h1')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/news\/[^/]+\/$/);
  }
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

test('portfolio filters and opens an in-page project detail on desktop and mobile', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/portfolio/');
    const gallery = page.locator('#root #portfolio');
    await expect(gallery.locator('h1')).toContainText('Proyek');
    await expect(page.getByRole('heading', { name: 'Proyek Unggulan' })).toHaveCount(0);
    await gallery.locator('.flex.flex-wrap button').nth(1).click();
    const card = gallery.locator('.grid button').first();
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/portfolio\/$/);
    await expect(page.locator('#main-content article h1')).toBeVisible();
    await page.getByRole('button', { name: 'Kembali ke Proyek' }).first().click();
    await expect(gallery.locator('h1')).toBeVisible();
  }
});
